---
name: agent-orchestration
description: >-
  Fable 5 orchestrator with Composer 2.5 workers. Two separate setups: Cursor IDE
  (subagents in .cursor/agents) or Claude Code (cursor-agent CLI + .claude/skills).
  Use when configuring Fable orchestration; pick the guide for your host.
user-invocable: true
disable-model-invocation: true
---

# Agent orchestration

**Shared goal:** **Fable 5** plans; **Composer 2.5** executes bulk work cheaper.

**Pick one host** — setup, files, and daily usage differ:

| Host            | Guide                                       | Bootstrap                       |
| --------------- | ------------------------------------------- | ------------------------------- |
| **Cursor IDE**  | [cursor-ide.md](references/cursor-ide.md)   | `bash …/scripts/init-cursor.sh` |
| **Claude Code** | [claude-code.md](references/claude-code.md) | `bash …/scripts/init-claude.sh` |

Install the fixmyskills skill once (either path):

```bash
bunx skills add FixMyBerlin/fixmyskills --skill agent-orchestration -a cursor -y
```

Then run **only** the init script for your host from `.agents/skills/agent-orchestration/`.

Do not mix both inits unless you genuinely use both tools on the same repo.

---

## Cursor IDE (summary)

- Files: `.cursor/agents/`, `.cursor/rules/orchestrator-worker.mdc`
- Usage: Fable 5 + `@orchestrator-worker` + `/implementer` / `/verifier`
- Details: [cursor-ide.md](references/cursor-ide.md)
- Personal workers: [cursor-personal-setup.md](references/cursor-personal-setup.md)

## Claude Code (summary)

- Files: `.claude/skills/cursor-worker-*`, merge snippet into `CLAUDE.md`
- Usage: Fable 5 + `cursor-worker-*` skills → `cursor-agent --model composer-2.5`
- Prerequisite: `cursor-agent` on PATH (Cursor subscription)
- Details: [claude-code.md](references/claude-code.md)
