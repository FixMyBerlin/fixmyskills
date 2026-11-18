# Model and effort policy

The user picks the session model, normally Opus 5.5 `medium`. You pick the model and effort of each subagent; this file guides that choice and does not replace your judgment of the task.

## The ladder

Pick the cheapest step you expect to do the work right:

1. Haiku `high`: search, clear briefs, mechanical edits, running checks.
2. Sonnet `high`: implementing when the brief leaves judgment to the agent.
3. Opus `medium`: plans, API shape, UI and copy, hard debugging.
4. Fable `low`
5. Fable `medium`

Use no other model or effort; `xhigh` and `max` only when the user names them for this task.

Pass `model` and `effort` on every Agent call, except to agents that pin both. This file is the explicit instruction to set `effort`.

Work that needs your own step: do it yourself, unless a subagent keeps it parallel or out of your context.

The ladder is from November 2026. When you see a Claude model newer than these, tell the user the ladder may be stale.

## Fable

Fable is not a default. Use it for:

- A second opinion on a plan, a diagnosis or a decision you are unsure about.
- An unusually hard task that Opus `medium` got wrong or likely would.
- A code review that judges correctness and design: `general-purpose`, `model: fable`, `effort: low`.

For very long, heavily orchestrated work, suggest the user switch the session to Fable instead of spawning it.

## Agents that pin Haiku `high`

Use these agents from `~/.claude/agents/` when the work fits:

- `Explore`: search, file discovery, reading logs.
- `implementer`: a clear brief, mechanical multi-file edits.
- `verifier`: running checks, confirming a diff does what its brief says. Read-only.

A skill that sets its own models (for example `unslop-code`) wins over this file.

## Escalate one step at a time

When a subagent returns wrong or shallow work, re-run that brief one step up the ladder and say so in chat. Above Fable `medium`, stop and ask the user. Token count, tool calls and run time are no reason to escalate; give the next brief a smaller scope instead.

When a project's `AGENTS.md` or `CLAUDE.md` sets other models, efforts or escalation triggers, name the conflict once in chat so the user can settle it.
