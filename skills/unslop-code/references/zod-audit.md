# Zod 4 audit (unslop-code)

Read this in Phase 2 before spawning the implementer. Phase 1 (TypeScript) ran first; pick up its why-keeps whose root fix is a parse. Fetch [https://zod.dev/llms.txt](https://zod.dev/llms.txt) for current Zod 4 APIs. FMC pin and router usage: skill `tech-stack` (Validation: Zod 4) and `tanstack-router-conventions` → `params-search-ui-routes.md`.

## Where Zod belongs

Untrusted or boundary data: `JSON.parse`, env, cookies, headers, URL / search, FormData, request bodies, `localStorage` / `sessionStorage`, postMessage, third-party payloads.

**Not Zod:** React props, values already parsed by a parent schema, in-process arguments the compiler already types from trusted callers.

## Contract from known data

Make the contract clear so we do not over-check for every possible case. Look at what the input actually is from what we know about the data (writer, persisted shape, API we own).

| Do                                                         | Do not                                               |
| ---------------------------------------------------------- | ---------------------------------------------------- |
| Schema the fields the producer actually writes             | `.optional()` / nullable / union "just in case"      |
| `z.object({ token: z.string() })` when that is the JSON    | `z.record(z.unknown())` then extra runtime narrowing |
| Reuse one schema; `z.infer<typeof Schema>` at the boundary | Duplicate TS interfaces _and_ a looser schema        |
| `safeParse` when you must return 4xx / fallback            | `parse` then catch-all that hides contract bugs      |
| Zod 4 APIs from current docs (`import { z } from 'zod'`)   | Zod 3-only APIs, `@tanstack/zod-adapter`             |

**Example:** `tokenFromAuthJson`. If our code writes `{ token: string }`, schema that. Do not also accept `access_token`, nested `data.session`, or empty objects unless something in **this** repo still produces them.

## GeoJSON

Nobody hand-writes GeoJSON. Three layers, each with an owner:

| Need                            | Use                                                                          |
| ------------------------------- | ---------------------------------------------------------------------------- |
| Types                           | `@types/geojson` — `GeoJSON.Point`, `Feature`, `FeatureCollection`           |
| Constructing a feature          | Turf helpers — `point()`, `lineString()`, `featureCollection()`              |
| Parsing GeoJSON we did not make | A Zod schema, then `z.infer` (never `parse(x) as GeoJSON.FeatureCollection`) |

`@types/geojson` and per-function `@turf/*` imports are the FMC defaults (skill `tech-stack`).

Do not write the object by hand:

```ts
const geometry = { type: 'Point' as const, coordinates: [lng, lat] }
const fc = { type: 'FeatureCollection', features } as GeoJSON.FeatureCollection
```

Use the helper. It returns a correctly typed value, so the `as const` and the cast both disappear:

```ts
import { featureCollection, point } from '@turf/helpers'

const marker = point([lng, lat], { id })
const fc = featureCollection([marker])
```

For data crossing a boundary (API response, WASM string, uploaded file, `localStorage`), parse it and infer the type from the schema:

```ts
const parsed = FeatureCollectionSchema.parse(JSON.parse(raw))
```

Check what the repo already has before writing a schema — `rg -n -e 'featureCollection\(' -e "from '@turf" -e 'GeoJSON\.' -e 'FeatureCollectionSchema'`. Reuse the app's helper or schema. Do not add a new GeoJSON validation library when the app has one, and do not hand-roll `z.object({ type: z.literal('Point'), … })` next to an existing schema.

Type-only GeoJSON (React props, a value a parent already parsed) stays a why-not — `@types/geojson` is enough.

## Why-not (record, do not convert)

- TypeScript-only (no runtime value)
- Already `validateSearch` / parent `safeParse` output
- Prisma / generated client types for rows we already loaded
- Narrowing after a schema (`.discriminatedUnion` already did it)

## Search (give to `explore`)

Focus on untrusted values (`JSON.parse`, env, cookies, request bodies), not every `as` in the app.

```bash
rg -n -g '*.ts' -g '*.tsx' -e 'JSON\.parse' -e "from 'zod'" -e 'from "zod"' -e 'safeParse' -e 'tokenFromAuthJson' -e 'validateSearch'
rg -n -g '*.ts' -g '*.tsx' -e 'process\.env' -e 'as unknown' -e 'as any'
rg -n -g '*.ts' -g '*.tsx' -e "type: '(Point|LineString|Polygon|Feature|FeatureCollection)'" -e 'GeoJSON\.' -e "from '@turf"
```

The third line finds hand-built GeoJSON and shows which helpers the app already imports.
