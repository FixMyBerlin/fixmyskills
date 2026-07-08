# Agent orchestration — Claude Code

**Fable 5** orchestrates in Claude Code (desktop or CLI). **Composer 2.5** runs bulk work via **`cursor-agent` CLI** (Cursor subscription). Claude Code cannot pin Composer on subagent `model:` — shell out instead.

Install fixmyskills skill once: `bunx skills add FixMyBerlin/fixmyskills --skill agent-orchestration -a cursor -y`

---

## What goes where

| Piece                 | Location                          | How it gets there                                       |
| --------------------- | --------------------------------- | ------------------------------------------------------- |
| Procedure + templates | fixmyskills `agent-orchestration` | Skills CLI → `.agents/skills/`                          |
| Worker skills         | `.claude/skills/cursor-worker-*`  | `init-claude.sh`                                        |
| Orchestration rules   | `CLAUDE.md`                       | Merge `docs/claude-orchestration-snippet.md` after init |
| Parent model          | Claude Code model picker          | You pick Fable 5 each session                           |
| Composer execution    | `cursor-agent` on PATH            | Cursor subscription auth                                |

```mermaid
flowchart LR
  Fable["Fable 5"]
  CMd["CLAUDE.md"]
  Skills["cursor-worker-* skills"]
  CLI["cursor-agent composer-2.5"]
  Fable --> CMd --> Skills --> CLI
```

---

## Bootstrap (one-time per repo)

```bash
bunx skills add FixMyBerlin/fixmyskills --skill agent-orchestration -a cursor -y
bash .agents/skills/agent-orchestration/scripts/init-claude.sh
# Merge docs/claude-orchestration-snippet.md into CLAUDE.md
git add .claude/skills docs/claude-orchestration-snippet.md skills-lock.json CLAUDE.md
git commit -m "Add Claude Code Fable orchestration setup"
```

`--no-docs` skips copying the snippet file. `TARGET_REPO=/path` overrides destination.

Reset templates: re-run `init-claude.sh` (overwrites copied skills and snippet).

---

## Prerequisites

```bash
which cursor-agent
cursor-agent --list-models   # must list composer-2.5
```

Auth uses your **Cursor** subscription — not a separate OpenAI/Codex stack.

---

## Daily usage

1. Pick **Fable 5** (effort Low–High; avoid over-reasoning tiers unless needed).
2. Large tasks:

```
Orchestrate only. Use cursor-worker-implement for edits, cursor-worker-review before done.
Do not bulk-edit inline unless trivial (<10 lines).
```

---

## cursor-agent commands

| Task                   | Command shape                                                     |
| ---------------------- | ----------------------------------------------------------------- |
| Review / Q&A           | `-p --trust --mode ask --output-format json --model composer-2.5` |
| Investigation          | `--mode plan` (read-only)                                         |
| Implementation         | `-p --trust --output-format json --model composer-2.5` (no `ask`) |
| Isolated parallel work | `--worktree <slug>`                                               |
| Repo root              | `--workspace "$(git rev-parse --show-toplevel)"`                  |

Example:

```bash
cursor-agent -p --trust --mode ask --output-format json \
  --workspace "$(git rev-parse --show-toplevel)" \
  --model composer-2.5 \
  "Review uncommitted changes. Report Verified, Issues, Gaps, Verdict."
```

Prompts must be **self-contained** (paths, scope, done criteria) — not Claude-style system messages.

---

## Workflows + wrapper pattern

Workflow stages only accept **Claude** models. To run Composer inside a workflow:

1. Stage uses Sonnet + low effort (cheap wrapper).
2. Wrapper writes `cursor-agent` prompt, runs via Bash, returns report.
3. Label stage `composer:task-name` — UI shows Claude; prefix shows real worker.

---

## Delegation

| Task                  | Delegate to                                        |
| --------------------- | -------------------------------------------------- |
| Bulk implementation   | `cursor-worker-implement` → `cursor-agent`         |
| Review / verification | `cursor-worker-review` → `cursor-agent --mode ask` |
| Discovery             | Claude subagents or `cursor-agent --mode plan`     |
| User-facing design    | Fable or Opus (taste ≥ 7)                          |

---

## Cost traps

- Bulk edits on Fable when `cursor-agent` was available.
- `composer-2.5-fast` unless intentional.
- Parallel `cursor-agent` runs = parallel Cursor usage.
- Wrapper stages still cost Claude tokens — keep wrapper on Sonnet low.

---

## Customize

- Edit `.claude/skills/cursor-worker-*` after init (project check commands, etc.).
- Global skills: copy to `~/.claude/skills/`; project wins on same name.

---

## Verification

1. `which cursor-agent` succeeds.
2. Claude Code lists `cursor-worker-implement` and `cursor-worker-review`.
3. Fable delegates to Bash `cursor-agent` instead of inline multi-file edits.
