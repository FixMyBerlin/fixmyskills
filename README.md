# fixmyskills

Shared [Cursor Agent Skills](https://cursor.com/docs/context/skills) for FixMyBerlin / FMC projects.

Tilda-geo–specific skills (processing, topic-docs, static datasets, etc.) live in the [tilda-geo](https://github.com/FixMyBerlin/tilda-geo) repo under `.cursor/skills/`, not here.

## Skills catalog

| Skill                                                            | Description                                                                                            | Command                                                                                                                  |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| [tech-stack](skills/tech-stack/)                                 | Default FMC stack for geo-heavy React SPAs — tooling, tsconfig, when to use sibling skills             | `bunx skills add FixMyBerlin/fixmyskills --skill tech-stack -a cursor -y`                                                |
| [review-dependabot](skills/review-dependabot/)                   | Review and merge Dependabot PRs — changelog triage, risk tiers, rebase merge                           | `bunx skills add FixMyBerlin/fixmyskills --skill review-dependabot -a cursor -y`                                         |
| [nuqs](skills/nuqs/)                                             | URL query state — prefer TanStack `validateSearch`; nuqs for Next.js / shared libs                     | `bunx skills add FixMyBerlin/fixmyskills --skill nuqs -a cursor -y`                                                      |
| [playwright-skill](skills/playwright-skill/)                     | TanStack Start E2E (TILDA patterns), smoke tests, stubbed auth, ad-hoc automation                      | `bunx skills add FixMyBerlin/fixmyskills --skill playwright-skill -a cursor -y`<br>then `bun run setup` in the skill dir |
| [react-dev](skills/react-dev/)                                   | React 19 + TypeScript, Compiler, oxlint, useEffect discipline; FMC TanStack Start — not routing/server | `bunx skills add FixMyBerlin/fixmyskills --skill react-dev -a cursor -y`                                                 |
| [react-map-gl](skills/react-map-gl/)                             | react-map-gl/maplibre — MapProvider, layers, URL viewport, tilda-geo patterns                          | `bunx skills add FixMyBerlin/fixmyskills --skill react-map-gl -a cursor -y`                                              |
| [rust-wasm-geo](skills/rust-wasm-geo/)                           | Rust/WASM geo — Turf vs WASM, crates, wasm-bindgen, Vite for FMC geo-heavy apps                        | `bunx skills add FixMyBerlin/fixmyskills --skill rust-wasm-geo -a cursor -y`                                             |
| [tanstack-start-migration](skills/tanstack-start-migration/)     | Migrate Next.js apps to TanStack Start                                                                 | `bunx skills add FixMyBerlin/fixmyskills --skill tanstack-start-migration -a cursor -y`                                  |
| [tanstack-start-conventions](skills/tanstack-start-conventions/) | TanStack Start/Router: app layout, boundaries, Query loaders, SSR, API vs UI validation                | `bunx skills add FixMyBerlin/fixmyskills --skill tanstack-start-conventions -a cursor -y`                                |
| [tanstack-start-auth](skills/tanstack-start-auth/)               | Better Auth config + TanStack Start routes, sessions, cookies (FMC/TILDA)                              | `bunx skills add FixMyBerlin/fixmyskills --skill tanstack-start-auth -a cursor -y`                                       |
| [tanstack-better-upload](skills/tanstack-better-upload/)         | Better Upload direct-to-S3 in TanStack Start; optional react-dropzone for multi-file UX                | `bunx skills add FixMyBerlin/fixmyskills --skill tanstack-better-upload -a cursor -y`                                    |
| [zustand-state-management](skills/zustand-state-management/)     | Zustand v5 conventions: `*-store.ts` layout, custom hooks, atomic selectors                            | `bunx skills add FixMyBerlin/fixmyskills --skill zustand-state-management -a cursor -y`                                  |
| [finish-work](skills/finish-work/)                               | Pre-commit checks (`bun run check`) and FMC commit message format                                      | `bunx skills add FixMyBerlin/fixmyskills --skill finish-work -a cursor -y`                                               |
| [user-changelog](skills/user-changelog/)                         | Weekly end-user release notes from Git (German output in `docs/user-changelog.md`, SHA boundaries)     | `bunx skills add FixMyBerlin/fixmyskills --skill user-changelog -a cursor -y`                                            |

## Install & update

FMC projects use the [Skills CLI](https://skills.sh) (`bunx skills`) to install Cursor agent skills. Project installs are tracked in `skills-lock.json` at the repo root — commit that file so everyone (and CI) gets the same skill versions.

| npm                 | Skills CLI                                  |
| ------------------- | ------------------------------------------- |
| `package-lock.json` | `skills-lock.json`                          |
| `node_modules/`     | `.agents/skills/` (+ agent symlinks/copies) |
| `npm ci`            | `bunx skills experimental_install`          |

### Restore skills after clone (recommended)

If your project already has a `skills-lock.json`, reinstall every locked skill in one step:

```bash
bunx skills experimental_install
```

**What it does:** reads `skills-lock.json`, fetches each skill from its pinned source (e.g. `FixMyBerlin/fixmyskills`), and installs them into `.agents/skills/` with links for Cursor. It is idempotent — safe to run after every clone, in onboarding scripts, or in CI.

**When to use it:** fresh clone, new machine, deleted `.agents/skills/`, or any time you want the exact versions in the lockfile without re-running individual `add` commands.

### Add or change skills

List available skills in this repo:

```bash
bunx skills add FixMyBerlin/fixmyskills --list
```

Install one skill for Cursor (project scope; updates `skills-lock.json`):

```bash
bunx skills add FixMyBerlin/fixmyskills --skill zustand-state-management -a cursor -y
```

Install all skills from this repo:

```bash
bunx skills add FixMyBerlin/fixmyskills --all -a cursor -y
```

Install the TanStack Start stack skills (shared across FMC TanStack projects):

```bash
bunx skills add FixMyBerlin/fixmyskills \
  --skill tanstack-start-conventions \
  --skill tanstack-start-auth \
  -a cursor -y
```

TILDA Geo keeps the full project-specific doc in `docs/TanStack-Start-App-Structure-And-Conventions.md`; use `tanstack-start-conventions` for the portable summary.

Local development when this repo is a sibling of your project:

```bash
bunx skills add ../skills --skill react-dev -a cursor -y
```

After adding skills, commit the updated `skills-lock.json`.

### Remove skills

The CLI command is `remove` (alias `rm`) — there is no `uninstall` subcommand:

```bash
bunx skills remove                        # interactive picker
bunx skills remove react-dev -y             # remove one skill, skip prompts
bunx skills remove skill1 skill2 -y         # remove several
```

**What it does:** deletes the skill from `.agents/skills/` and unlinks it from agent directories (e.g. Cursor).

**Lockfile gap:** `remove` does **not** update `skills-lock.json`. The removed skill stays in the lockfile, so `bunx skills experimental_install` will install it again. Until the CLI fixes this, manually delete the skill entry from `skills-lock.json` (or remove the whole file if empty) and commit that change alongside the removal.

### Update skills to latest versions

Pull newer skill content from the source repos and refresh the lockfile:

```bash
bunx skills update -p -y                    # all project skills
bunx skills update react-dev -p -y          # one skill
```

Commit the updated `skills-lock.json` so the team stays in sync.

**Note:** The Skills CLI installs Cursor project skills to `.agents/skills/` by default. After install, run `bun run setup` inside `playwright-skill` if you use browser automation. `experimental_install` is an experimental CLI command (a stable `skills ci` alias may land later); it is the supported way to restore from `skills-lock.json` today.

## Development

This repo uses [Bun](https://bun.sh) (`packageManager` in `package.json`). Install tooling and hooks:

```bash
bun install
```

Format markdown and `package.json` files:

```bash
bun run format
```

## License

AGPL-3.0 — see [LICENSE](LICENSE).
