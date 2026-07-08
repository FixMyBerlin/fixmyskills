---
name: agent-orchestration
description: >-
  Bootstraps Fable 5 as orchestrator with cheaper Composer subagents for
  implementation and verification. Provides .cursor/agents model pins,
  @orchestrator-worker rule templates, init script, and cost traps
  (inherit). Use when configuring Cursor for Fable orchestration, initializing
  a new repo, or copying the FMC orchestrator/worker pattern.
user-invocable: true
disable-model-invocation: true
---

# Agent orchestration (Fable parent + Composer workers)

**Goal:** **Fable 5** plans and decides; **Composer 2.5** subagents execute edits and verification in isolated, cheaper contexts. Effort tier (High / Medium / Low) is a separate model-picker choice — the orchestrator/worker split works the same at any tier.

Placement details: [what-goes-where.md](references/what-goes-where.md). Personal workers: [personal-setup.md](references/personal-setup.md).

---

## New repo bootstrap (one-time)

```bash
# 1. Install skill (→ .agents/skills/, updates skills-lock.json)
bunx skills add FixMyBerlin/fixmyskills --skill agent-orchestration -a cursor -y

# 2. Copy templates into THIS repo's .cursor/ (+ docs/)
bash .agents/skills/agent-orchestration/scripts/init.sh

# 3. Commit team-shared Cursor config
git add .cursor/agents .cursor/rules docs/agent-orchestration.md skills-lock.json
git commit -m "Add Fable orchestration Cursor setup"
```

Skip human doc: `bash .agents/skills/agent-orchestration/scripts/init.sh --no-docs`. Override destination: `TARGET_REPO=/path/to/repo bash .agents/skills/agent-orchestration/scripts/init.sh`.

**Agents:** When bootstrapping a repo, run `scripts/init.sh` from the installed skill directory (or copy `assets/*` manually).

---

## Daily usage (each large task)

1. Pick **Fable 5** in the Agent model picker (any effort tier: High, Medium, or Low).
2. Start with **`@orchestrator-worker`**.
3. Use this delegation block:

```
@orchestrator-worker

Implement [feature]. You orchestrate only:
- explore for discovery
- /implementer for edits and tests
- /verifier before declaring done
Do not edit files yourself.
```

**When to skip:** trivial one-file edits — subagent startup costs more than inline work.

---

## What each file does

| File (after setup)                      | Purpose                                                 |
| --------------------------------------- | ------------------------------------------------------- |
| `.cursor/agents/implementer.md`         | Edits, shell, tests — `model: composer-2.5[fast=false]` |
| `.cursor/agents/verifier.md`            | Read-only validation — same model pin                   |
| `.cursor/rules/orchestrator-worker.mdc` | Parent delegates; `alwaysApply: false`                  |
| `docs/agent-orchestration.md`           | Human cheat sheet (optional)                            |

The fixmyskills skill holds **templates** in `assets/` and **procedure** here. Cursor only loads worker models from `.cursor/agents/` in the target repo (or `~/.cursor/agents/`).

---

## Delegation table

| Task                                       | Delegate to                             |
| ------------------------------------------ | --------------------------------------- |
| Codebase search, file discovery            | Built-in `explore`                      |
| Shell, tests, installs, state-changing git | `/implementer` or built-in `shell`      |
| Multi-file implementation                  | `/implementer`                          |
| Post-change validation                     | `/verifier` (readonly)                  |
| Browser / UI debugging                     | Built-in `browser` or agent-browser MCP |

Orchestrator exceptions: trivial fixes under ~10 lines, or user says "no subagents".

---

## Model configuration

### Parent (orchestrator)

Pick **Fable 5** in the Agent model picker. No repo file sets this. Effort tier only affects orchestrator reasoning depth/cost — worker model pins are unchanged.

### Workers (subagents)

Pin explicitly in `.cursor/agents/` frontmatter:

```yaml
model: composer-2.5[fast=false]
```

| Value                      | Use                                                               |
| -------------------------- | ----------------------------------------------------------------- |
| `composer-2.5[fast=false]` | Default — explicit non-fast Composer                              |
| `composer-2.5[]`           | Alternative base-variant pin if bracket params behave differently |
| `inherit` or omitted       | **Avoid** — workers bill at parent (Fable) rates                  |

`readonly: true` on verifier blocks file edits and state-changing shell.

### Cost traps

- **`model: inherit`** on workers = Fable pricing — defeats the pattern.
- **Parallel subagents** = parallel token spend — batch only independent work.
- **CLI quirks:** `inherit` may behave differently on Cursor CLI; explicit pins are more reliable.

---

## Customize after setup

Edit copied files in the target repo:

- **verifier.md** — set project-specific check commands (`bun run check`, `npm test`, etc.)
- **implementer.md** — reference repo `AGENTS.md` / finish-work skill paths
- **orchestrator-worker.mdc** — add project-specific delegation (MCP servers, domain subagents later)

Re-run `bash .agents/skills/agent-orchestration/scripts/init.sh` to reset from templates (overwrites copied files).

---

## References

- [Cursor Subagents](https://cursor.com/docs/subagents)
- [Claude Fable 5](https://cursor.com/docs/models/claude-fable-5)
- [Cursor models and pricing](https://cursor.com/docs/models-and-pricing)
- Reference implementation: tilda-geo commit `9572b85` (mlt-routing worktree prototype)

## Out of scope (asides)

- Cloud Agents `/in-cloud`, `/babysit`
- Cursor `/orchestrate` plugin (SDK tree orchestration)
- Domain-specific subagents (add under `.cursor/agents/` per project later)
