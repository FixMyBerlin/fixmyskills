# Harness patterns

Copy the pattern that fits the target, adapt names. Keep each harness to the one or two invariants that matter for it.

## Shared run count

`src/test/fuzz.ts` (or next to the existing test helpers):

```ts
// 100 runs inside the normal test run; `bun run test:fuzz` sets FUZZ_RUNS for a deep run
export const fuzzRuns = Number(process.env.FUZZ_RUNS ?? 100)
```

Use it as `{ numRuns: fuzzRuns }`. DB-backed harnesses: `Math.min(fuzzRuns, 200)`.

## Invariant catalog

Pick per target. The first two cover most FMC boundaries.

| Invariant           | Assertion                                                                                 | Typical target                                      |
| ------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------- |
| **Rejects cleanly** | `schema.safeParse(anything)` never throws (custom `.transform` / `.refine` code can)      | Server function / API route input schemas           |
| **Accepted ⇒ safe** | Whatever the schema accepts, the handler logic runs without throwing; numbers stay finite | Handler logic behind the schema, geo calculations   |
| **Round-trip**      | `parse(stringify(x))` deep-equals `x`                                                     | `routerSearch`, custom search serializers, encoders |
| **Idempotent**      | `f(f(x)) === f(x)`                                                                        | slugify, normalize, trim/clean helpers              |
| **Bounded output**  | Result within known range (lng/lat ranges, 0–100 %, length ≤ limit)                       | Geo math, percentages, truncation                   |
| **Differential**    | Two implementations agree within tolerance                                                | WASM vs Turf (`rust-wasm-geo`), old vs new refactor |

## Server function input

Test the exported schema and the handler logic, not `createServerFn` itself. If the logic is inline in `.handler(...)`, extract it into a plain function in the same server module first (small refactor, mention it in the report). Keep DB access behind a parameter or skip that part — see "With Postgres" below.

```ts
import { fc, test } from '@fast-check/vitest'
import { expect } from 'vitest'
import { fuzzRuns } from '@/test/fuzz'
import { updateNoteInput, buildNoteUpdate } from './notes.server'

// Hostile: any value at all must give a Zod result, never an exception
test.prop([fc.anything()], { numRuns: fuzzRuns })('updateNoteInput rejects garbage cleanly', (input) => {
  expect(() => updateNoteInput.safeParse(input)).not.toThrow()
})

// Valid-shaped: fields of the right kind with hostile content
const noteLike = fc.record({
  id: fc.oneof(fc.integer(), fc.string()),
  title: fc.string({ unit: 'binary' }), // includes lone surrogates, control chars
  body: fc.option(fc.string({ maxLength: 10_000 })),
})

test.prop([noteLike], { numRuns: fuzzRuns })('accepted input builds a valid update', (input) => {
  const parsed = updateNoteInput.safeParse(input)
  fc.pre(parsed.success) // only check inputs the schema lets through
  expect(() => buildNoteUpdate(parsed.data)).not.toThrow()
})
```

Build the valid-shaped generator by hand from the schema's fields — do not add a Zod→arbitrary library.

## API route handler

Handlers take a `Request`; build one per run. Assert on the status, not the body.

```ts
test.prop([fc.oneof(fc.json(), fc.string(), fc.constant(''))], { numRuns: fuzzRuns })(
  'POST /api/export never answers 5xx',
  async (body) => {
    const res = await handleExport(new Request('http://test/api/export', { method: 'POST', body }))
    expect(res.status).toBeLessThan(500)
  },
)
```

If the handler needs auth/context, pass a stub context — see `playwright-skill` / `tanstack-start-auth` for the project's stub pattern.

## Search params round-trip

Every FMC router has `routerSearch.parse` / `routerSearch.stringify` (`tanstack-router-conventions` → `router-search-serialization.md`).

```ts
const searchValue = fc.oneof(
  fc.string(),
  fc.integer(),
  fc.boolean(),
  fc.array(fc.string(), { maxLength: 5 }),
  fc.dictionary(fc.string({ minLength: 1 }), fc.string(), { maxKeys: 3 }),
)
const search = fc.dictionary(fc.string({ minLength: 1 }), searchValue, { maxKeys: 5 })

test.prop([search], { numRuns: fuzzRuns })('routerSearch round-trips', (s) => {
  expect(routerSearch.parse(routerSearch.stringify(s))).toEqual(s)
})

// Users edit URLs by hand: parsing any string must not throw
test.prop([fc.string({ unit: 'binary' })], { numRuns: fuzzRuns })('routerSearch.parse survives any URL', (raw) => {
  expect(() => routerSearch.parse(`?${raw}`)).not.toThrow()
})
```

Also round-trip each route's `validateSearch` schema with its own valid-shaped values when it has custom serializers (map viewport, filters).

## Geo input

```ts
const lng = fc.oneof(fc.double({ min: -180, max: 180, noNaN: true }), fc.constantFrom(-180, 180, 0, -0))
const lat = fc.oneof(fc.double({ min: -90, max: 90, noNaN: true }), fc.constantFrom(-90, 90, 0, -0))
const position = fc.tuple(lng, lat)
// Mostly invalid rings on purpose: self-intersecting, unclosed, duplicates, too short
const ring = fc.array(position, { minLength: 0, maxLength: 12 })
const polygon = fc.record({ type: fc.constant('Polygon'), coordinates: fc.array(ring, { maxLength: 3 }) })

test.prop([polygon], { numRuns: fuzzRuns })('area is finite for any accepted polygon', (geom) => {
  const parsed = polygonSchema.safeParse(geom)
  fc.pre(parsed.success)
  const result = calculateArea(parsed.data)
  expect(Number.isFinite(result)).toBe(true)
  expect(result).toBeGreaterThanOrEqual(0)
})
```

Out-of-range coordinates (`fc.double()` unbounded, `NaN`, `Infinity`) go into the **rejects cleanly** harness for the schema.

## With Postgres / PostGIS

Only when the project already has a test database (compose service + test `DATABASE_URL`). Wrap each run in a transaction that rolls back.

```ts
test.prop([polygon], { numRuns: Math.min(fuzzRuns, 200) })(
  'every accepted polygon is stored as valid PostGIS geometry',
  async (geom) => {
    const parsed = polygonSchema.safeParse(geom)
    fc.pre(parsed.success)
    const [row] = await prisma.$queryRaw<{ valid: boolean }[]>`
      SELECT ST_IsValid(ST_GeomFromGeoJSON(${JSON.stringify(parsed.data)})) AS valid`
    expect(row.valid).toBe(true)
  },
)
```

A failure here means the Zod schema accepts geometry PostGIS rejects or stores invalid — usually fix by validating rings in the schema (closed, ≥ 4 positions) or by `ST_MakeValid` at insert, depending on what the product wants (ask).

## Pinning a failure

fast-check prints the shrunk counterexample and `{ seed, path }`. After the fix, add a plain example test next to the property so the case runs forever, independent of the random seed:

```ts
it('regression: title with lone surrogate (fuzz)', () => {
  expect(updateNoteInput.safeParse({ id: 1, title: '\uD800' }).success).toBe(false)
})
```

To replay a CI failure locally before fixing: pass the printed values, `{ numRuns: fuzzRuns, seed: 1234, path: '0:1:3', endOnFailure: true }`. Remove them again afterwards.

## Scheduled CI job

`.github/workflows/fuzz.yml` — only after the user agreed. Match `actions/checkout` and the Bun setup to the project's existing workflow.

```yaml
name: Fuzz

on:
  schedule:
    - cron: '0 3 * * 1' # Monday 03:00 UTC
  workflow_dispatch:

permissions:
  contents: read

jobs:
  fuzz:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v6
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run test:fuzz
```

Monorepo: add `working-directory:` per package. DB-backed harnesses need the project's Postgres service in this job too — copy it from the existing CI job, or leave those files out with a Vitest `exclude` for the scheduled run.
