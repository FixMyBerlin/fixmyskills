# Model and effort policy

Last checked: 2026-10-21 against [slopalytics (smart vs. cost, frontier)](https://slopalytics.com/?frontier=true&models=claude-opus-5-5,claude-haiku-5-5,gemini-4-argon,grok-4-7,muse-wonder-full,muse-wonder,claude-sonnet-5-5&hide-reasoning=none,max). When this date is more than a month old or a new Claude model ships, tell the user the ladder may be stale.

Opus 5.5 runs the session. Subagents start on Haiku `high` and only move up this ladder, the steps on the cost-vs-intelligence Pareto line:

1. Haiku `high`
2. Sonnet `high`
3. Opus `medium`
4. Opus `high`

Never pick these yourself:

- `xhigh` on any model — only when the user names it for this task.
- `low` on any model — never.
- `max` — never, not even when asked; say why and use `high`.
- Sonnet `medium` — not on the line.
- Any Fable model.

## Which agent gets which step

Use the agents in `~/.claude/agents/`; they pin model and effort. For anything else, pass `model` and `effort` on the Agent call — this file is an explicit instruction to set `effort`.

| Work                                                     | Agent                                                      |
| -------------------------------------------------------- | ---------------------------------------------------------- |
| Search, file discovery, reading logs                     | `Explore` (Haiku `high`)                                   |
| Implementing a clear brief, mechanical multi-file edits  | `implementer` (Haiku `high`)                               |
| Verifying or reviewing a diff, running checks            | `verifier` (Haiku `high`)                                  |
| Implementing when the brief leaves judgment to the agent | `general-purpose`, `model: sonnet`, `effort: high`         |
| Plans, API shape, UI and copy, hard debugging            | `general-purpose`, `model: opus`, `effort: medium`, or you |

A skill that sets its own steps (for example `unslop-code`) wins over this table.

## Escalate one step at a time

When a subagent returns wrong or shallow work, re-run that brief one step up the list and say so in chat. Do not jump to Opus `high`. Above Opus `high`, stop and ask the user. Token count, tool calls or run time are no reason to escalate: a long run that did the work right means the next brief should be smaller, not the next model bigger.

When a project's `AGENTS.md` or `CLAUDE.md` sets other models, efforts or escalation triggers, name the conflict once in chat so the user can settle it.

## Keep Haiku under 100k tokens, but finish

Haiku 5.5 costs 5× more on every request whose prompt is over 100K tokens; cached tokens count. Keep each Haiku run under 100k, but finishing beats restarting: a run that goes over is still about 5× cheaper than Sonnet and 10× cheaper than Opus, and a re-run on another model starts with no cache. Escalate only when the work is wrong. Give each Haiku subagent a scoped brief (paths, what done looks like) and split work by folder or phase before one run needs more. Do not set `CLAUDE_CODE_AUTO_COMPACT_WINDOW`; it would also shrink the Opus session.
