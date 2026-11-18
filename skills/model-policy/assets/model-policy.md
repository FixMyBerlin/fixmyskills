# Model and effort policy

The user picks the session model, normally Opus 5.5 `medium`. You decide which model and effort each subagent gets; this file helps with that decision and does not replace your judgment about the task.

## The ladder

Pick the cheapest step you expect to do the work right:

1. Haiku `high`
2. Sonnet `high`
3. Opus `medium`
4. Fable `low`
5. Fable `medium`

Do not use any other model and effort. `xhigh` and `max` only when the user names them for this task.

Pass `model` and `effort` on every Agent call (this file is an explicit instruction to set `effort`), except for agents that pin both.

This ladder is from November 2026. When a new Claude model ships, tell the user the ladder may be stale.

## Fable

Fable is not a default. Use it for:

- A second opinion on a plan, a diagnosis or a decision you are unsure about.
- An unusually hard task where Opus `medium` fell short.
- A code review: `general-purpose`, `model: fable`, `effort: low`.

For very long, heavily orchestrated work, suggest the user switch the session to Fable instead of spawning it yourself.

## Agents that pin a step

The agents in `~/.claude/agents/` run on Haiku `high`. Use them when the work fits:

- `Explore`: search, file discovery, reading logs.
- `implementer`: implementing a clear brief, mechanical multi-file edits.
- `verifier`: checking a diff, running checks.

A skill that sets its own steps (for example `unslop-code`) wins over this file.

## Escalate one step at a time

When a subagent returns wrong or shallow work, re-run that brief one step up the ladder and say so in chat. Above Fable `medium`, stop and ask the user. Token count, tool calls or run time are no reason to escalate; give the next brief a smaller scope instead.

When a project's `AGENTS.md` or `CLAUDE.md` sets other models, efforts or escalation triggers, name the conflict once in chat so the user can settle it.
