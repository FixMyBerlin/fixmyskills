# fixmyskills

Shared [Claude Code skills](https://code.claude.com/docs/en/skills) for FixMyBerlin / FMC projects.

Repo-specific skills (e.g. tilda-geo processing, topic-docs, static datasets, local isolation) live in that project under `.claude/skills/`, not here. Those are on-demand playbooks — everyday coding conventions stay in the project’s `CLAUDE.md` / `AGENTS.md`.

## Skills catalog

| Skill                                                              | Description                                                                                                                                                 | Command                                                                                                                       |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [model-policy](skills/model-policy/)                               | Once per machine: Opus 5.5 orchestrates, Haiku subagents compacting at 100k, effort per agent — writes `~/.claude` rule, agents, settings                   | `bunx skills add FixMyBerlin/fixmyskills --skill model-policy -g -a claude-code -y`<br>then `/model-policy`                   |
| [new-project-setup](skills/new-project-setup/)                     | Bootstrap a greenfield FMC repo — git, AGPL license, skills, Bun tooling, finish-work commits                                                               | `bunx skills add FixMyBerlin/fixmyskills --skill new-project-setup -a claude-code -y`                                         |
| [tech-stack](skills/tech-stack/)                                   | Default FMC stack for geo-heavy React SPAs — tooling, tsconfig, when to use sibling skills                                                                  | `bunx skills add FixMyBerlin/fixmyskills --skill tech-stack -a claude-code -y`                                                |
| [review-dependabot](skills/review-dependabot/)                     | Review and merge Dependabot PRs — changelog triage, risk tiers, rebase merge                                                                                | `bunx skills add FixMyBerlin/fixmyskills --skill review-dependabot -a claude-code -y`                                         |
| [nuqs](skills/nuqs/)                                               | URL query state — prefer TanStack `validateSearch`; nuqs for Next.js / shared libs                                                                          | `bunx skills add FixMyBerlin/fixmyskills --skill nuqs -a claude-code -y`                                                      |
| [playwright-skill](skills/playwright-skill/)                       | TanStack Start E2E (TILDA patterns), smoke tests, stubbed auth, ad-hoc automation                                                                           | `bunx skills add FixMyBerlin/fixmyskills --skill playwright-skill -a claude-code -y`<br>then `bun run setup` in the skill dir |
| [react-dev](skills/react-dev/)                                     | React 19 + TypeScript, Compiler, oxlint, useEffect discipline; FMC TanStack Start — not routing/server                                                      | `bunx skills add FixMyBerlin/fixmyskills --skill react-dev -a claude-code -y`                                                 |
| [react-map-gl](skills/react-map-gl/)                               | react-map-gl/maplibre — MapProvider, layers, URL viewport, tilda-geo patterns                                                                               | `bunx skills add FixMyBerlin/fixmyskills --skill react-map-gl -a claude-code -y`                                              |
| [osm-pbfs](skills/osm-pbfs/)                                       | Shared local OSM PBF cache — symlink extracts, do not copy or re-download                                                                                   | `bunx skills add FixMyBerlin/fixmyskills --skill osm-pbfs -a claude-code -y`                                                  |
| [rust-wasm-geo](skills/rust-wasm-geo/)                             | Rust/WASM geo — Turf vs WASM, crates, wasm-bindgen, Vite for FMC geo-heavy apps                                                                             | `bunx skills add FixMyBerlin/fixmyskills --skill rust-wasm-geo -a claude-code -y`                                             |
| [tanstack-router-conventions](skills/tanstack-router-conventions/) | TanStack Router: validateSearch, pretty search URLs, loaders + Query, typed routes (SPA or Start)                                                           | `bunx skills add FixMyBerlin/fixmyskills --skill tanstack-router-conventions -a claude-code -y`                               |
| [tanstack-start-conventions](skills/tanstack-start-conventions/)   | TanStack Start: app layout, boundaries, server functions, SSR, API route validation (requires router skill)                                                 | `bunx skills add FixMyBerlin/fixmyskills --skill tanstack-start-conventions -a claude-code -y`                                |
| [tanstack-start-auth](skills/tanstack-start-auth/)                 | Better Auth config + TanStack Start routes, sessions, cookies (FMC/TILDA)                                                                                   | `bunx skills add FixMyBerlin/fixmyskills --skill tanstack-start-auth -a claude-code -y`                                       |
| [tanstack-better-upload](skills/tanstack-better-upload/)           | Better Upload direct-to-S3 in TanStack Start; optional react-dropzone for multi-file UX                                                                     | `bunx skills add FixMyBerlin/fixmyskills --skill tanstack-better-upload -a claude-code -y`                                    |
| [zustand-state-management](skills/zustand-state-management/)       | Zustand v5 conventions: `*-store.ts` layout, custom hooks, atomic selectors                                                                                 | `bunx skills add FixMyBerlin/fixmyskills --skill zustand-state-management -a claude-code -y`                                  |
| [prisma](skills/prisma/)                                           | Prisma schema naming (models, relations), legacy renames, migrate workflows                                                                                 | `bunx skills add FixMyBerlin/fixmyskills --skill prisma -a claude-code -y`                                                    |
| [fuzz-hardening](skills/fuzz-hardening/)                           | Harden input handling with fast-check fuzz tests in Vitest — attack surface map, harnesses, regressions, CI                                                 | `bunx skills add FixMyBerlin/fixmyskills --skill fuzz-hardening -a claude-code -y`                                            |
| [finish-work](skills/finish-work/)                                 | Pre-commit checks (`bun run check`) and FMC commit message format                                                                                           | `bunx skills add FixMyBerlin/fixmyskills --skill finish-work -a claude-code -y`                                               |
| [unslop-code](skills/unslop-code/)                                 | Orchestrated cleanup after LLM work: TS, Zod 4 + GeoJSON, shims, undeployed WIP, location, decision lift, semantic HTML, leftover process, then unslop-text | `bunx skills add FixMyBerlin/fixmyskills --skill unslop-code -a claude-code -y`                                               |
| [unslop-text](skills/unslop-text/)                                 | Rewrite plans, markdown, comments, and copy so a human can follow the decision chain without losing facts                                                   | `bunx skills add FixMyBerlin/fixmyskills --skill unslop-text -a claude-code -y`                                               |
| [close-worktree](skills/close-worktree/)                           | Land a worktree feature branch onto `develop`, preserve keepable untracked files, then remove worktree + local branch                                       | `bunx skills add FixMyBerlin/fixmyskills --skill close-worktree -a claude-code -y`                                            |
| [academic-research](skills/academic-research/)                     | Evidence-bound academic research — facts, quotes, sources; OpenAlex, Semantic Scholar, Crossref, BASE, DNB                                                  | `bunx skills add FixMyBerlin/fixmyskills --skill academic-research -a claude-code -y`                                         |
| [user-changelog](skills/user-changelog/)                           | Weekly end-user release notes from Git (German output in `docs/user-changelog.md`, SHA boundaries)                                                          | `bunx skills add FixMyBerlin/fixmyskills --skill user-changelog -a claude-code -y`                                            |

### Deprecated skills

Skills under [deprecated/](deprecated/) are archived and **not** installable. After an upstream removal, run `bunx skills update -p` (interactive) to be prompted to uninstall local copies — see [deprecated/README.md](deprecated/README.md).

## Install & update

FMC projects use the [Skills CLI](https://skills.sh) (`bunx skills`) to install Claude Code skills. Project installs are tracked in `skills-lock.json` at the repo root — commit that file so everyone (and CI) gets the same skill versions.

| npm                 | Skills CLI                         |
| ------------------- | ---------------------------------- |
| `package-lock.json` | `skills-lock.json`                 |
| `node_modules/`     | `.claude/skills/`                  |
| `npm ci`            | `bunx skills experimental_install` |

### Restore skills after clone (recommended)

If your project already has a `skills-lock.json`, reinstall every locked skill in one step:

```bash
bunx skills experimental_install
```

**What it does:** reads `skills-lock.json`, fetches each skill from its pinned source (e.g. `FixMyBerlin/fixmyskills`), and installs them into `.claude/skills/`. It is idempotent — safe to run after every clone, in onboarding scripts, or in CI.

**When to use it:** fresh clone, new machine, deleted `.claude/skills/`, or any time you want the exact versions in the lockfile without re-running individual `add` commands.

### Add or change skills

List available skills in this repo:

```bash
bunx skills add FixMyBerlin/fixmyskills --list
```

Install one skill for Claude Code (project scope; updates `skills-lock.json`):

```bash
bunx skills add FixMyBerlin/fixmyskills --skill zustand-state-management -a claude-code -y
```

Install all skills from this repo:

```bash
bunx skills add FixMyBerlin/fixmyskills --all -a claude-code -y
```

Install the TanStack stack skills (shared across FMC TanStack projects):

```bash
# SPA (Router only)
bunx skills add FixMyBerlin/fixmyskills \
  --skill tanstack-router-conventions \
  -a claude-code -y

# TanStack Start (Router + Start)
bunx skills add FixMyBerlin/fixmyskills \
  --skill tanstack-router-conventions \
  --skill tanstack-start-conventions \
  --skill tanstack-start-auth \
  -a claude-code -y
```

TILDA Geo keeps the full project-specific doc in `docs/TanStack-Start-App-Structure-And-Conventions.md`; use `tanstack-router-conventions` + `tanstack-start-conventions` for the portable summary.

Local development when this repo is a sibling of your project:

```bash
bunx skills add ../skills --skill react-dev -a claude-code -y
```

After adding skills, commit the updated `skills-lock.json`.

### Remove skills

The CLI command is `remove` (alias `rm`) — there is no `uninstall` subcommand:

```bash
bunx skills remove                        # interactive picker
bunx skills remove react-dev -y             # remove one skill, skip prompts
bunx skills remove skill1 skill2 -y         # remove several
```

**What it does:** deletes the skill from `.claude/skills/` (and any other agent directories it was linked to).

**Lockfile gap:** `remove` does **not** update `skills-lock.json`. The removed skill stays in the lockfile, so `bunx skills experimental_install` will install it again. Until the CLI fixes this, manually delete the skill entry from `skills-lock.json` (or remove the whole file if empty) and commit that change alongside the removal.

### Update skills to latest versions

Pull newer skill content from the source repos and refresh the lockfile:

```bash
bunx skills update -p -y                    # all project skills
bunx skills update react-dev -p -y          # one skill
```

Commit the updated `skills-lock.json` so the team stays in sync.

**Note:** With `-a claude-code` the Skills CLI copies project skills to `.claude/skills/`. After install, run `bun run setup` inside `playwright-skill` if you use browser automation. `experimental_install` is an experimental CLI command (a stable `skills ci` alias may land later); it is the supported way to restore from `skills-lock.json` today.

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
