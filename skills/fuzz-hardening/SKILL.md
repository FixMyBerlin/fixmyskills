---
name: fuzz-hardening
description: >-
  Harden an FMC Bun + TypeScript app (TanStack Start, React, Zod, Prisma,
  Postgres/PostGIS, GitHub Actions) with fuzz / property-based tests: find the
  code that takes untrusted input, write fast-check harnesses in Vitest, fix
  what breaks, keep failures as regression tests, wire into CI. Use for "fuzz
  this project", "harden", "property tests", "find edge-case crashes", or
  testing server functions, API routes, search params, GeoJSON or upload
  parsing against malformed input.
---

# Fuzz hardening

Throw generated, hostile input at the code that reads untrusted data, until it either handles it or we find a bug. The user may not know fuzzing — make the technical calls yourself, explain each one in one sentence, and ask only where the answer changes the work.

## Decisions already made

Do not re-open these unless the project breaks an assumption:

| Choice    | Default                                                                                                                                    | Why                                                                                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Technique | Property-based fuzzing with [fast-check](https://fast-check.dev) (`fast-check` + `@fast-check/vitest`), dev deps                           | JS is memory-safe, so the bugs are unhandled throws, 500s, wrong results, `NaN`, hangs — fast-check finds those and **shrinks** each failure to a minimal input |
| Runner    | Existing Vitest setup (stack default). Files `*.fuzz.test.ts` next to the code under test                                                  | Picked up by the project's `test-run` script with no new tooling; `vitest run .fuzz.` runs only the fuzz files                                                  |
| Level     | Call the function / Zod schema / handler **directly**, not over HTTP                                                                       | 1000s of runs per second, no server, deterministic                                                                                                              |
| Runs      | `numRuns: 100` on every test run; a `test-fuzz` script runs `FUZZ_RUNS=20000`                                                              | PR CI stays fast; the deep run is opt-in                                                                                                                        |
| Not used  | Jazzer.js / libFuzzer / AFL (coverage-guided, Node-native, not Vitest/Bun); HTTP fuzzers like Schemathesis (FMC apps have no OpenAPI spec) | Cost > value for this stack                                                                                                                                     |

Harness code, generators and the invariant catalog: [references/harness-patterns.md](references/harness-patterns.md). Load it at step 3.

## Workflow

```
- [ ] 1. Preflight: stack, test setup, existing fuzz files
- [ ] 2. Map attack surface → ranked target list
- [ ] 3. Write harnesses for the chosen targets (≤ 5 per run)
- [ ] 4. Run, triage, fix, pin regressions
- [ ] 5. Wire scripts + CI
- [ ] 6. Report
```

### 1. Preflight

Read `package.json` (scripts — expect `test-run` / `check` / `check-ci` per skill `tech-stack` → `references/package-json-scripts.md` — and `vitest`, `fast-check`, `zod`, `@prisma/client`, `@turf/*`), the Vitest config (`testTimeout`, path alias such as `@/`), and `.github/workflows/`. Check for existing `*.fuzz.test.ts` — if present, this is a **follow-up run**: extend, do not duplicate.

Stop and tell the user if there is no Vitest. Offer to add it (one devDep + `vitest.config.ts` + `test-run` script); do not fall back to `bun test` silently.

In monorepos (`app/`, `processing/`), work per package that has its own `package.json`.

### 2. Map the attack surface

Search for these, cheapest first. Skip anything that only renders UI or wraps a third-party library without own logic.

| Look for                                                                                       | Why it matters                                                                     |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `createServerFn(...).validator(...)`, API routes (`server.handlers`)                           | Every request body is attacker-controlled                                          |
| `routerSearch.parse` / `.stringify` (every FMC router has one), `validateSearch`               | Anyone can edit a URL; parse errors break the page, round-trip bugs break links    |
| Zod schemas with `.transform`, `.refine`, `.preprocess`, custom coercion                       | Custom code inside validation — the schema may accept what the code then chokes on |
| GeoJSON / coordinate / bbox parsing, Turf calls on user geometry, WASM geo functions           | Invalid rings, antimeridian, `NaN`, empty geometries                               |
| Upload / import parsing (CSV, GeoJSON files, OSM tags, `JSON.parse` on request or file data)   | Arbitrary bytes from outside                                                       |
| `$queryRawUnsafe`, `$executeRawUnsafe`, `Prisma.raw`, template-built SQL, `ST_GeomFromGeoJSON` | Injection and PostGIS errors surfacing as 500                                      |
| Own pure utils: slug, normalize, format/parse dates (`@date-fns/tz`), unit conversion          | Cheap invariants (round-trip, idempotence), DST edge cases                         |

Raw SQL with string interpolation of user data is a **finding by itself** — fix it with parameters (`$queryRaw` tagged template / `Prisma.sql`) instead of fuzzing it.

Rank: _untrusted × own logic × blast radius_. Server input > URL input > file import > internal utils.

**Ask once** (AskUserQuestion, multi-select) with the top 3–6 targets, your recommendation first. Write each option for someone who has never heard of fuzzing: what it is, who can send input to it, what we will check — no invariant names, no generator talk. Example option:

> **Server function `updateNote`** (`notes.server.ts`) — takes the note form from any logged-in user. We check that garbage input never crashes it and that anything it accepts can be saved. Recommended.

Skip the question when there are ≤ 3 targets and all are clearly server-side input — just state the list and proceed.

### 3. Write harnesses

Install once: `bun add -d fast-check @fast-check/vitest`. Add the shared run-count helper from the reference, using the project's import style (alias or relative).

Per target, test the **one or two invariants** from the catalog that fit — not all of them. Every harness gets two generators:

- **valid-shaped** input (built from the schema's fields, so the schema accepts most of it) — finds logic bugs past validation
- **hostile** input (`fc.anything()`, broken JSON, wrong types) — must be rejected cleanly

Keep the valid-shaped generator close to what the schema accepts. `fc.pre(...)` only skips the odd case; if the schema rejects most generated values, fast-check aborts with "too many pre-condition failures" — fix the generator, not the limit.

If a target needs Postgres/PostGIS (raw SQL, `ST_*` on stored geometry), check for an existing test DB setup (Docker compose service, `DATABASE_URL` in test env). None present → ask the user before adding one; meanwhile fuzz the pure part (the input that would reach the DB) and skip the DB step.

### 4. Run, triage, fix

Use the project's Vitest, not `bunx`: `bun vitest run .fuzz.` first with default runs, then once with `FUZZ_RUNS=5000 bun vitest run .fuzz. --testTimeout=120000`.

**Green at both run counts → the target is done.** Report it as covered and move on. Do not add invariants or raise runs to force a finding.

For each failure, fast-check prints the shrunk counterexample plus `seed` and `path`. Triage:

| Failure                                                                                                             | Action                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Crash / unhandled throw / 500 on hostile input                                                                      | Bug. Fix at the boundary (tighten schema, catch, return 4xx). No question                                                                               |
| Schema accepts, downstream throws or returns `NaN`/`Infinity`                                                       | Bug. Tighten schema or harden the function. No question                                                                                                 |
| Round-trip mismatch, wrong result where intent is obvious                                                           | Bug. Fix                                                                                                                                                |
| Result is "wrong" but intent is unclear (e.g. accept `""` name, `-0`, lone surrogates, coordinates outside Germany) | **Ask** with the exact input, current output and the two plausible rules. Batch these into one question                                                 |
| Harness is wrong (generator produces impossible input, "too many pre-condition failures")                           | Fix the generator, not the code — say so in the report                                                                                                  |
| Vitest timeout only at high `FUZZ_RUNS`                                                                             | Not a bug — the property is slow, not stuck. Raise `--testTimeout` or lower that harness's `numRuns`. A real hang reproduces with one input at 100 runs |

After each fix, pin the shrunk input as a plain `it(...)` regression test in the same file (see reference). Never weaken an invariant to make a run pass.

Cap the session: if a target keeps producing new failures after three fix rounds, stop, list them, and ask whether to continue on that target.

### 5. Wire scripts and CI

- `package.json`: add `"test-fuzz": "FUZZ_RUNS=20000 vitest run .fuzz. --testTimeout=600000"` (kebab-case, no `:` — see skill `tech-stack` → `references/package-json-scripts.md`). Do not touch `check` / `check-ci` — fuzz files already run inside `test-run` at 100 runs.
- CI: the existing PR workflow runs `check-ci` → `test-run`, so nothing to add there. Offer (ask, default yes) a weekly scheduled job running `bun run test-fuzz` — template in the reference. A failing scheduled run prints the seed; re-run locally with it.

### 6. Report

Short, plain language, for someone new to fuzzing:

- Targets covered, invariant per target, runs executed
- Bugs found and fixed (one line each, with the shrunk input)
- Open questions / skipped targets and why
- How to re-run: `bun run test-fuzz`; how to replay a CI failure (seed/path)

Then hand off to skill `finish-work` for checks and the commit (topic usually `Dev`, or the affected area when a user-visible bug was fixed).

## Out of scope

Keep this skill on input handling. Do not pull in during a fuzz run:

- React component / UI fuzzing — use `playwright-skill` for flows
- Dependency vulnerabilities — `review-dependabot`
- GitHub Actions or Dockerfile hardening, auth/permission review — mention to the user as separate work if you notice something serious; do not fix it here

## Related

skill `tech-stack` | skill `tanstack-start-conventions` (server functions, API route validation) | skill `tanstack-router-conventions` (search serialization) | skill `rust-wasm-geo` (differential WASM vs Turf) | skill `prisma` | skill `finish-work`
