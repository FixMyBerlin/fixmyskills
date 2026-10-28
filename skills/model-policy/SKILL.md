---
name: model-policy
description: >-
  Set up the FMC model and effort policy for Claude Code in ~/.claude: Opus 5.5
  orchestrates, subagents default to Haiku, each kind of agent gets a fixed
  effort, escalation follows the cost-vs-intelligence Pareto line. Use when
  setting up Claude Code on a new machine, or to update the policy after this
  skill changed.
user-invocable: true
disable-model-invocation: true
---

# Model policy

A skill only loads when called, so the policy itself must not live in a skill. This skill copies it into your user-level Claude Code config, where it applies to every session in every project:

| File                                             | What it does                                                                                     |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `~/.claude/rules/model-policy.md`                | The Pareto ladder, which agent gets which model and effort, the 100k rule. Loaded every session. |
| `~/.claude/agents/Explore.md`                    | Replaces the built-in `Explore`, which otherwise runs on the session model (Opus).               |
| `~/.claude/agents/implementer.md`, `verifier.md` | Haiku `high` workers for edits and for read-only checks.                                         |
| `~/.claude/settings.json` `env`                  | `CLAUDE_CODE_SUBAGENT_MODEL=haiku`: subagents with no `model` run on Haiku.                      |

Install globally, then run `/model-policy`:

```bash
bunx skills add FixMyBerlin/fixmyskills --skill model-policy -g -a claude-code -y
```

Needs Claude Code 2.1.271 or newer: older versions ignore `omitClaudeMd` silently and `Explore` loads every CLAUDE.md.

## Steps

1. Run `claude --version`; stop and say so when it is below 2.1.271.
2. Read [assets/model-policy.md](assets/model-policy.md) and every file in [assets/agents/](assets/agents/).
3. For each target file that exists and differs from its asset, show the diff and AskUserQuestion: overwrite, or keep theirs. The skill cannot tell a hand edit from an older version of the asset, so it asks on every difference.
4. Copy `assets/model-policy.md` to `~/.claude/rules/model-policy.md` and each `assets/agents/*.md` to `~/.claude/agents/`.
5. In `~/.claude/settings.json`, set `env.CLAUDE_CODE_SUBAGENT_MODEL` to `"haiku"`. Keep every other key; create the file with `{ "env": { … } }` if it is missing. Do not set `CLAUDE_CODE_SUBAGENT_MODEL_FORCE` — it would also override the per-call `model` that escalation needs.
6. Report what changed. The rule and agents apply from the next session on.

## Updating the ladder

The ladder in [assets/model-policy.md](assets/model-policy.md) comes from the slopalytics chart linked in its "Last checked" line. To refresh it in this repo: open that link (add new Claude models to `models=`), list the Claude model/effort points on the frontier from cheapest to smartest, update the ladder and the "off the line" list, set "Last checked" to today, and commit. Then everyone re-runs `bunx skills update -g -y` and `/model-policy`.

## Why each piece

- **Rule, not CLAUDE.md:** a rule file without `paths` loads at the start of every session like `CLAUDE.md`, but stays one file this skill can replace on update.
- **Env var:** model resolution is the Agent call's `model`, then the agent file's `model`, then `CLAUDE_CODE_SUBAGENT_MODEL`, then the session model. The env var catches every spawn that names no model.
- **Explore agent:** built-in `Explore` and `Plan` ignore the env var. A user-level agent with the same name replaces `Explore`; `Plan` stays on the session model on purpose. Built-in `Explore` starts without CLAUDE.md files; custom agents load them all, so the replacement sets `omitClaudeMd: true` to stay close to it.
- **Effort:** there is no setting for a default subagent effort. Agent files pin it (`effort:` frontmatter); for `general-purpose` the rule tells the orchestrator to pass `effort` on each call.
- **Haiku `high`, not `medium`:** Haiku `medium` is also on the Pareto line, but `high` is a lot smarter for little extra cost, so the agents pin `high` and the ladder starts there.
- **100K budget:** Haiku 5.5 has two prices, chosen per request by prompt length: $0.10 / $0.50 per million input / output tokens up to 100K, $0.50 / $2.50 above — for the whole request, with cache reads and writes counted toward the 100K. A subagent resends its context every turn, so once it passes 100K every later turn pays more. Even over 100K, Haiku stays cheaper than switching: on cache reads, which dominate agent turns, it is $0.05 against Sonnet's $0.10 and Opus's $0.20 per million; on fresh input and output 4× and 8× cheaper. On Pro / Max plans usage is not billed per token; the docs do not say whether the price step affects plan limits.
- **No escalation on length:** a project rule once moved Haiku work to Sonnet `medium` because two Haiku runs passed 150k tokens. Both had finished with their tests; the Sonnet run cost about five times as much (Haiku 166k ≈ $0.45, Sonnet 218k ≈ $2.40, estimated from the totals). Length says the brief was too big, not that the model was too small.

Docs: [Subagents](https://code.claude.com/docs/en/sub-agents), [Memory and rules](https://code.claude.com/docs/en/memory), [Settings](https://code.claude.com/docs/en/settings), [Haiku long-context pricing](https://platform.claude.com/docs/en/about-claude/pricing#long-context-pricing).
