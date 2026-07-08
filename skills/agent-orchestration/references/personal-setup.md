# Personal setup (`~/.cursor/agents/`)

Use personal subagents when you want the same **implementer** and **verifier** workers across all projects without copying into each repo.

## Copy workers only

```bash
mkdir -p ~/.cursor/agents
cp .agents/skills/agent-orchestration/assets/implementer.md ~/.cursor/agents/
cp .agents/skills/agent-orchestration/assets/verifier.md ~/.cursor/agents/
```

Or from fixmyskills dev checkout:

```bash
cp skills/agent-orchestration/assets/implementer.md ~/.cursor/agents/
cp skills/agent-orchestration/assets/verifier.md ~/.cursor/agents/
```

## Precedence

| Path                                    | Scope                              |
| --------------------------------------- | ---------------------------------- |
| `.cursor/agents/implementer.md` in repo | Wins over user-level for that name |
| `~/.cursor/agents/implementer.md`       | Fallback for all projects          |

Prefer **project-local** agents when the team should share identical worker config (commit to git).

## What personal workers do not replace

Personal `implementer` / `verifier` pin Composer models globally, but **Fable still needs orchestration instructions**:

- **Recommended:** run `scripts/init.sh` in each repo anyway (copies rule + optional docs), or
- Paste the delegation block from the skill / `docs/agent-orchestration.md` each task without `@orchestrator-worker`

Do **not** put orchestrator behavior in global Cursor User Rules (`alwaysApply`) — it affects every chat. Use project `.cursor/rules/orchestrator-worker.mdc` with manual `@orchestrator-worker`.

## When personal setup makes sense

- Many small repos; same worker prompts everywhere
- You already use `~/.cursor/agents/` for other workers
- Solo developer; no need to commit `.cursor/agents/` per repo

## When project setup is better

- Team repos (everyone gets same workers via git)
- Repo-specific verifier checks (customize `verifier.md` after setup)
- CI/docs reference `docs/agent-orchestration.md`
