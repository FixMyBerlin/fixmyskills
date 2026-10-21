# fixmyskills

Shared [Claude Code skills](https://code.claude.com/docs/en/skills) for FixMyBerlin / FMC projects.

Repo-specific skills (e.g. tilda-geo processing, topic-docs, static datasets, local isolation) live in that project under `.claude/skills/`, not here. Those are on-demand playbooks — everyday coding conventions stay in the project’s `CLAUDE.md` / `AGENTS.md`.

## Skills catalog

| Skill                                                              | Description                                                                                                                               | Command                                                                                                                          |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [model-policy](skills/model-policy/)                               | Once per machine: Opus 5.5 orchestrates, Haiku subagents compacting at 100k, effort per agent — writes `~/.claude` rule, agents, settings | `bunx skills add FixMyBerlin/fixmyskills --skill model-policy -g -a claude-code -y`<br>then `/model-policy`                      |
| [new-project-setup](skills/new-project-setup/)                     | Bootstrap a greenfield FMC repo — git, AGPL license, Bun tooling, finish-work commits                                                     | `bunx skills add FixMyBerlin/fixmyskills --skill new-project-setup -g -a claude-code -y`                                         |
| [tech-stack](skills/tech-stack/)                                   | Default FMC stack for geo-heavy React SPAs — tooling, tsconfig, when to use sibling skills                                                | `bunx skills add FixMyBerlin/fixmyskills --skill tech-stack -g -a claude-code -y`                                                |
| [review-dependabot](skills/review-dependabot/)                     | Review and merge Dependabot PRs — changelog triage, risk tiers, rebase merge                                                              | `bunx skills add FixMyBerlin/fixmyskills --skill review-dependabot -g -a claude-code -y`                                         |
| [nuqs](skills/nuqs/)                                               | URL query state — prefer TanStack `validateSearch`; nuqs for Next.js / shared libs                                                        | `bunx skills add FixMyBerlin/fixmyskills --skill nuqs -g -a claude-code -y`                                                      |
| [playwright-skill](skills/playwright-skill/)                       | TanStack Start E2E (TILDA patterns), smoke tests, stubbed auth, ad-hoc automation                                                         | `bunx skills add FixMyBerlin/fixmyskills --skill playwright-skill -g -a claude-code -y`<br>then `bun run setup` in the skill dir |
| [react-dev](skills/react-dev/)                                     | React 19 + TypeScript, Compiler, oxlint, useEffect discipline; FMC TanStack Start — not routing/server                                    | `bunx skills add FixMyBerlin/fixmyskills --skill react-dev -g -a claude-code -y`                                                 |
| [react-map-gl](skills/react-map-gl/)                               | react-map-gl/maplibre — MapProvider, layers, URL viewport, tilda-geo patterns                                                             | `bunx skills add FixMyBerlin/fixmyskills --skill react-map-gl -g -a claude-code -y`                                              |
| [osm-pbfs](skills/osm-pbfs/)                                       | Once per machine: shared local OSM PBF cache — symlink extracts, do not copy or re-download                                               | `bunx skills add FixMyBerlin/fixmyskills --skill osm-pbfs -g -a claude-code -y`                                                  |
| [tailwind-plus](skills/tailwind-plus/)                             | Once per machine: local Tailwind Plus + Catalyst workspace (private repo) — copy markup instead of inventing it                           | `bunx skills add FixMyBerlin/fixmyskills --skill tailwind-plus -g -a claude-code -y`                                             |
| [rust-wasm-geo](skills/rust-wasm-geo/)                             | Rust/WASM geo — Turf vs WASM, crates, wasm-bindgen, Vite for FMC geo-heavy apps                                                           | `bunx skills add FixMyBerlin/fixmyskills --skill rust-wasm-geo -g -a claude-code -y`                                             |
| [tanstack-router-conventions](skills/tanstack-router-conventions/) | TanStack Router: validateSearch, pretty search URLs, loaders + Query, typed routes (SPA or Start)                                         | `bunx skills add FixMyBerlin/fixmyskills --skill tanstack-router-conventions -g -a claude-code -y`                               |
| [tanstack-start-conventions](skills/tanstack-start-conventions/)   | TanStack Start: app layout, boundaries, server functions, SSR, API route validation (requires router skill)                               | `bunx skills add FixMyBerlin/fixmyskills --skill tanstack-start-conventions -g -a claude-code -y`                                |
| [tanstack-start-auth](skills/tanstack-start-auth/)                 | Better Auth config + TanStack Start routes, sessions, cookies (FMC/TILDA)                                                                 | `bunx skills add FixMyBerlin/fixmyskills --skill tanstack-start-auth -g -a claude-code -y`                                       |
| [tanstack-better-upload](skills/tanstack-better-upload/)           | Better Upload direct-to-S3 in TanStack Start; optional react-dropzone for multi-file UX                                                   | `bunx skills add FixMyBerlin/fixmyskills --skill tanstack-better-upload -g -a claude-code -y`                                    |
| [zustand-state-management](skills/zustand-state-management/)       | Zustand v5 conventions: `*-store.ts` layout, custom hooks, atomic selectors                                                               | `bunx skills add FixMyBerlin/fixmyskills --skill zustand-state-management -g -a claude-code -y`                                  |
| [prisma](skills/prisma/)                                           | Prisma schema naming (models, relations), legacy renames, migrate workflows                                                               | `bunx skills add FixMyBerlin/fixmyskills --skill prisma -g -a claude-code -y`                                                    |
| [fuzz-hardening](skills/fuzz-hardening/)                           | Harden input handling with fast-check fuzz tests in Vitest — attack surface map, harnesses, regressions, CI                               | `bunx skills add FixMyBerlin/fixmyskills --skill fuzz-hardening -g -a claude-code -y`                                            |
| [finish-work](skills/finish-work/)                                 | Pre-commit checks (`bun run check`) and FMC commit message format                                                                         | `bunx skills add FixMyBerlin/fixmyskills --skill finish-work -g -a claude-code -y`                                               |
| [unslop-code](skills/unslop-code/)                                 | Orchestrated cleanup after LLM work: TS, Zod 4 + GeoJSON, shims, undeployed WIP, location, decision lift, semantic HTML, leftover process | `bunx skills add FixMyBerlin/fixmyskills --skill unslop-code -g -a claude-code -y`                                               |
| [close-worktree](skills/close-worktree/)                           | Land a worktree feature branch onto `develop`, preserve keepable untracked files, then remove worktree + local branch                     | `bunx skills add FixMyBerlin/fixmyskills --skill close-worktree -g -a claude-code -y`                                            |
| [academic-research](skills/academic-research/)                     | Evidence-bound academic research — facts, quotes, sources; OpenAlex, Semantic Scholar, Crossref, BASE, DNB                                | `bunx skills add FixMyBerlin/fixmyskills --skill academic-research -g -a claude-code -y`                                         |
| [user-changelog](skills/user-changelog/)                           | Weekly end-user release notes from Git (German output in `docs/user-changelog.md`, SHA boundaries)                                        | `bunx skills add FixMyBerlin/fixmyskills --skill user-changelog -g -a claude-code -y`                                            |
| [keystatic-astro](skills/keystatic-astro/)                         | Keystatic + Astro Content Layer — CMS schemas, content collections, glob loaders, MDX blocks, fetched collections                         | `bunx skills add FixMyBerlin/fixmyskills --skill keystatic-astro -g -a claude-code -y`                                           |
| [maproulette-tagfix](skills/maproulette-tagfix/)                   | MapRoulette Tag Fix challenges — cooperativeWork GeoJSON, stable OSM external IDs, task_markdown, rebuilds                                | `bunx skills add FixMyBerlin/fixmyskills --skill maproulette-tagfix -g -a claude-code -y`                                        |
| [touch-ipad-review](skills/touch-ipad-review/)                     | Review React web apps for iPad / touchscreen usability — touch targets, hover failures, Safari quirks, Tailwind fixes                     | `bunx skills add FixMyBerlin/fixmyskills --skill touch-ipad-review -g -a claude-code -y`                                         |

### Deprecated skills

Skills under [deprecated/](deprecated/) are archived and **not** installable. After an upstream removal, run `bunx skills update -g` (interactive) to be prompted to uninstall local copies — see [deprecated/README.md](deprecated/README.md).

## Install & update

FMC installs all skills from this repo **globally** (`-g`, into `~/.claude/skills/`), once per machine.

Uses the [Skills CLI](https://skills.sh) (`bunx skills`).

### Install

List available skills in this repo:

```bash
bunx skills add FixMyBerlin/fixmyskills --list
```

Install all skills:

```bash
bunx skills add FixMyBerlin/fixmyskills --all -g -a claude-code -y
```

Install one skill:

```bash
bunx skills add FixMyBerlin/fixmyskills --skill zustand-state-management -g -a claude-code -y
```

Install the TanStack stack skills:

```bash
bunx skills add FixMyBerlin/fixmyskills \
  --skill tanstack-router-conventions \
  --skill tanstack-start-conventions \
  --skill tanstack-start-auth \
  -g -a claude-code -y
```

`tanstack-router-conventions` alone is enough for a Router SPA. TILDA Geo keeps the full project-specific doc in `docs/TanStack-Start-App-Structure-And-Conventions.md`; use `tanstack-router-conventions` + `tanstack-start-conventions` for the portable summary.

Local development when this repo is a sibling of your project:

```bash
bunx skills add ../skills --skill react-dev -g -a claude-code -y
```

After install, run `bun run setup` inside `playwright-skill` if you use browser automation.

### Update

```bash
bunx skills update -g -y
```

### Remove

The CLI command is `remove` (alias `rm`); `-g` removes from global scope:

```bash
bunx skills remove react-dev -g -y          # one skill
bunx skills remove skill1 skill2 -g -y      # several
bunx skills remove -g                       # interactive picker
```

### Machine-level setup

`model-policy`, `osm-pbfs` and `tailwind-plus` configure your machine rather than a project.

`osm-pbfs` and `tailwind-plus` check their folder first and walk you through setup if it is missing. Paths default to `~/Development/_osm-pbfs` and `~/Development/_tailwind`; override with `OSM_PBFS_DIR` / `TAILWIND_PLUS_DIR`. Ask Tobias for access to the private `tordans/tailwind-plus` repo.

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
