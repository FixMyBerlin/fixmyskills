---
name: new-project-setup
description: >-
  Orchestrate greenfield FixMyBerlin/FMC repo bootstrap: git init, AGPL license,
  dev tooling, two finish-work commits. Use when scaffolding a new project or
  onboarding a new repo. Delegates to finish-work and tech-stack — do not
  duplicate their steps.
disable-model-invocation: true
---

# New FMC project setup

Orchestration only. Read sibling skills for how-to; this skill defines **order**, **plan defaults**, and **two commits**. fixmyskills are installed globally (see the repo README), not per project — do not install skills into the new repo.

## Plan

Ask: project name, copyright holder, app type (**TanStack Start** default, or **TanStack Router SPA**), **maps?**

Present the checklist below; confirm all **ask** items before executing.

| Action    | Meaning                                 |
| --------- | --------------------------------------- |
| `default` | Do unless the user overrides            |
| `ask`     | Confirm with the user first             |
| `skip`    | Omit unless the user asks               |
| `report`  | Summary only — do not install or commit |

**Repo & license**

- `git init` — **default** when no `.git`; **skip** when repo exists
- AGPL-3.0 `LICENSE.md` — **default**; **ask** copyright holder if unknown (README only)

**Dev tooling — default:** skill `tech-stack` (**skip** empty meta-repo). **Ask/report:** CI now or later; MCP → **report** user-scope `claude mcp add --scope user` only; `touch-ipad-review` / `unslop-code` → **report** on-demand.

## Run order

```
- [ ] Plan confirmed
- [ ] git init (if needed)
- [ ] License → finish-work commit 1
- [ ] Dev tooling → finish-work commit 2
- [ ] Summary
```

| Step        | Do                                                                                                                             | Skill                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| Git         | `test -d .git \|\| git init`                                                                                                   | —                              |
| License     | Verbatim AGPL-3.0 as [tilda-geo LICENSE.md](https://github.com/FixMyBerlin/tilda-geo/blob/develop/LICENSE.md); README links it | **finish-work** → commit **1** |
| Dev tooling | bunfig, oxc, dependabot, tsconfig, vscode when `package.json` exists                                                           | **tech-stack** → commit **2**  |
| Each commit | Separate commit; never batch                                                                                                   | **finish-work**                |

Commit 1 happens before `package.json` exists, so there is no `check` script yet: use finish-work's commit message format only and skip the check.

End with summary: skipped items, follow-ups, two commit SHAs.
