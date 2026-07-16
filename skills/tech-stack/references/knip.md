# Knip (explicit deps)

Load for unused deps/exports, tiered enforcement, or pre-push scaffold.

**Templates:** [knip.config](../examples/knip.config.mjs.template) · [husky pre-push](../examples/husky/pre-push.template) · [ensure-bun.sh](../examples/husky/ensure-bun.sh.template)

## Decisions (not in templates)

- Not in `check`; scripts `knip` (strict, pre-push) + `knip-warn` (advisory) — [knip template](../examples/knip.config.mjs.template), [finish-work](../../finish-work/SKILL.md); names per [package-json-scripts.md](package-json-scripts.md)
- `knip-warn` still exits non-zero on missing/unlisted deps (always `error`); only exports/types/enumMembers are downgraded to warnings — so in `finish-work` treat its output as advisory regardless of exit code
- Knip finds **your** unlisted imports; [phantom deps](bun-install.md) are bugs inside third-party `node_modules` (Bun global store)

## Customize the template

Copy [knip.config.mjs.template](../examples/knip.config.mjs.template) → project-root `knip.config.mjs`. Tune before first green run — defaults target TanStack Start `app/` layout.

| Key                  | What it does                                                                                 | How to tune                                                                                                                                                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`entry`**          | Roots Knip traces from — importers of deps/exports. Missing entry → false “unused file/dep”. | Keep app entrypoints: router, route files, tests, `scripts/`, seeds. Add config files Knip plugins miss (`vite.config.ts`, `playwright.config.ts`). Drop globs that do not exist.                                                   |
| **`paths`**          | Import alias → filesystem mapping for **unlisted** resolution.                               | Knip already reads `tsconfig` `compilerOptions.paths`. **Omit `paths`** when aliases live only in tsconfig. Add entries only for Vite/webpack aliases **not** in tsconfig. Values must mirror tsconfig (e.g. `'@/*': ['./src/*']`). |
| **`ignoreBinaries`** | CLI names used in scripts but not npm deps — suppresses false “unlisted binary”.             | Keep dev tools you shell out to (`gh`, `rg`, `code`). Add project CLIs; remove names you never invoke.                                                                                                                              |
| **`ignore`**         | Skip analysis for matched paths entirely.                                                    | `.agents/**` for agent scratch. Add generated output dirs if needed — prefer `ignoreFiles` for “unused file” only.                                                                                                                  |

**Workflow for agents:** read `tsconfig.json` paths + folder layout → adjust `entry` globs → run `bun run knip-warn` → fix unlisted deps first, then trim dead exports. [Knip config reference](https://knip.dev/reference/configuration).
