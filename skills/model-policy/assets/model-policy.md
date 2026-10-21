# Model and effort policy

Last checked: 2026-10-21 against [slopalytics (smart vs. cost, frontier)](https://slopalytics.com/?frontier=true&models=claude-opus-5-5,claude-haiku-5-5,gemini-4-argon,grok-4-7,muse-wonder-full,muse-wonder,claude-sonnet-5-5&hide-reasoning=none,max). When this date is more than a month old or a new Claude model ships, tell the user the ladder may be stale.

Opus 5.5 runs the session. Subagents run on the cheapest model and effort that can do the job. Only use steps on the cost-vs-intelligence Pareto line, from cheapest to smartest:

1. Haiku `medium`
2. Haiku `high`
3. Sonnet `high`
4. Opus `medium`
5. Opus `high`

Never pick these yourself:

- `xhigh` on any model — only when the user names it for this task.
- `low` on any model — never.
- `max` — never, not even when asked; say why and use `high`.
- Sonnet `medium` — not on the line.
- Any Fable model.

## Which agent gets which step

Use the agents in `~/.claude/agents/`; they pin model, effort and the 100k compaction window. For anything else, pass `model` and `effort` on the Agent call — this file is an explicit instruction to set `effort`.

| Work                                                     | Agent                                                      |
| -------------------------------------------------------- | ---------------------------------------------------------- |
| Search, file discovery, reading logs                     | `Explore` (Haiku `high`)                                   |
| Implementing a clear brief, mechanical multi-file edits  | `implementer` (Haiku `high`)                               |
| Verifying or reviewing a diff, running checks            | `verifier` (Haiku `high`)                                  |
| Implementing when the brief leaves judgment to the agent | `general-purpose`, `model: sonnet`, `effort: high`         |
| Plans, API shape, UI and copy, hard debugging            | `general-purpose`, `model: opus`, `effort: medium`, or you |

A skill that sets its own steps (for example `unslop-code`) wins over this table.

## Escalate one step at a time

When a subagent returns wrong or shallow work, re-run that brief one step up the list and say so in chat. Do not jump to Opus `high`. Above Opus `high`, stop and ask the user.

## Keep Haiku under 100k tokens

Haiku 5.5 has two prices, chosen per request by prompt length: up to 100K tokens it costs $0.10 / $0.50 per million input / output tokens, above that $0.50 / $2.50 — five times as much, for the whole request. A subagent resends its full context on every turn, so once it passes 100K every later turn pays the higher price. Cached tokens count toward the 100K.

- The `Explore`, `implementer` and `verifier` agents set `autoCompactWindow: 100000`, the lowest window Claude Code allows, so they compact around the limit instead of running past it.
- Give each Haiku subagent a scoped brief (paths, what done looks like) and split work by folder or phase so a single run does not need more.
- When a Haiku run goes over anyway, let it finish. Haiku above 100K is still about 4× cheaper than Sonnet 5.5 ($2 / $10) and 8× cheaper than Opus 5.5 ($4 / $20), and a re-run on another model starts from zero with no cache. Escalate only when the work is wrong, never because of the price tier.
- Do not set `CLAUDE_CODE_AUTO_COMPACT_WINDOW`: it would also shrink the Opus session, which has no 100K price step.
