---
name: new-project-setup
description: >-
  Orchestrate greenfield FixMyBerlin/FMC repo bootstrap: plan which fixmyskills
  to install, git init, AGPL license, three finish-work commits. Use when
  scaffolding a new project or onboarding a new repo. Delegates to finish-work,
  tech-stack, and agent-orchestration — do not duplicate their steps.
disable-model-invocation: true
---

# New FMC project setup

Orchestration only. Read sibling skills for how-to; this skill defines **order**, **plan defaults**, and **three commits**.

## Plan

Ask: project name, copyright holder, app type (TanStack Start default), **maps?**

Present the checklist below; confirm all **ask** items before executing.

| Action    | Meaning                                 |
| --------- | --------------------------------------- |
| `default` | Do/install unless the user overrides    |
| `ask`     | Confirm with the user first             |
| `skip`    | Omit unless the user asks               |
| `report`  | Summary only — do not install or commit |

**Repo & license**

- `git init` — **default** when no `.git`; **skip** when repo exists
- AGPL-3.0 `LICENSE.md` — **default**; **ask** copyright holder if unknown (README only)

**Skills — default** (`bunx skills add FixMyBerlin/fixmyskills … -a cursor -y`)

- `finish-work`, `tech-stack`, `agent-orchestration`
- `react-dev` — TanStack/React; **skip** non-UI
- `tanstack-start-conventions` — TanStack Start; **skip** other frameworks
- `review-dependabot` — GitHub FMC; **skip** non-GitHub

**Skills — ask**

- `react-map-gl` — maps? (**skip** when no maps)
- `tanstack-start-auth` — auth? · `playwright-skill` — E2E? · `prisma` — DB?
- `zustand-state-management` — client global state? · `user-changelog` — public releases?
- `rust-wasm-geo` — WASM geo? · `tanstack-better-upload` — S3 uploads?

**Dev tooling — default:** skill `tech-stack` (**skip** empty meta-repo). **Ask/report:** CI now or later; MCP → **report** `~/.cursor/mcp.json` only; `touch-ipad-review` → **report** on-demand.

## Run order

```
- [ ] Plan confirmed
- [ ] git init (if needed)
- [ ] License → finish-work commit 1
- [ ] Skills + orchestration → finish-work commit 2
- [ ] Dev tooling → finish-work commit 3
- [ ] Summary
```

| Step        | Do                                                                                                                             | Skill                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| Git         | `test -d .git \|\| git init`                                                                                                   | —                                      |
| License     | Verbatim AGPL-3.0 as [tilda-geo LICENSE.md](https://github.com/FixMyBerlin/tilda-geo/blob/develop/LICENSE.md); README links it | **finish-work** → commit **1**         |
| Skills      | `bunx skills add …` per plan; then `init-cursor.sh`                                                                            | **agent-orchestration** → commit **2** |
| Dev tooling | bunfig, oxc, dependabot, tsconfig, vscode when `package.json` exists                                                           | **tech-stack** → commit **3**          |
| Each commit | Separate commit; never batch                                                                                                   | **finish-work**                        |

End with summary: installed skills, skipped items, follow-ups, three commit SHAs.
