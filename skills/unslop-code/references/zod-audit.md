# Zod 4 audit (unslop-code)

Read this in Phase 1 before spawning the implementer. Fetch [https://zod.dev/llms.txt](https://zod.dev/llms.txt) for current Zod 4 APIs. FMC pin and router usage: skill `tech-stack` (Validation: Zod 4) and `tanstack-router-conventions` → `params-search-ui-routes.md`.

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
```
