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

## Steps

1. Read [assets/model-policy.md](assets/model-policy.md) and every file in [assets/agents/](assets/agents/).
2. For each target file that already exists, show the user the diff against the asset. When the user changed the file by hand, AskUserQuestion: overwrite, merge their lines in, or keep theirs.
3. Copy `assets/model-policy.md` to `~/.claude/rules/model-policy.md` and each `assets/agents/*.md` to `~/.claude/agents/`.
4. In `~/.claude/settings.json`, set `env.CLAUDE_CODE_SUBAGENT_MODEL` to `"haiku"`. Keep every other key; create the file with `{ "env": { … } }` if it is missing. Do not set `CLAUDE_CODE_SUBAGENT_MODEL_FORCE` — it would also override the per-call `model` that escalation needs.
5. Report what changed. The rule and agents apply from the next session on.

## Updating the ladder

The ladder in [assets/model-policy.md](assets/model-policy.md) comes from the slopalytics chart linked in its "Last checked" line. To refresh it in this repo: open that link (add new Claude models to `models=`), list the Claude model/effort points on the frontier from cheapest to smartest, update the ladder and the "off the line" list, set "Last checked" to today, and commit. Then everyone re-runs `bunx skills update -g -y` and `/model-policy`.

## Why each piece

- **Rule, not CLAUDE.md:** a rule file without `paths` loads at the start of every session like `CLAUDE.md`, but stays one file this skill can replace on update.
- **Env var:** model resolution is the Agent call's `model`, then the agent file's `model`, then `CLAUDE_CODE_SUBAGENT_MODEL`, then the session model. The env var catches every spawn that names no model.
- **Explore agent:** built-in `Explore` and `Plan` ignore the env var. A user-level agent with the same name replaces `Explore`; `Plan` stays on the session model on purpose.
- **Effort:** there is no setting for a default subagent effort. Agent files pin it (`effort:` frontmatter); for `general-purpose` the rule tells the orchestrator to pass `effort` on each call.
- **100K window:** `autoCompactWindow` in an agent's frontmatter only affects that agent, so Haiku compacts near its price step while the Opus session keeps its full window. 100000 is the lowest value Claude Code accepts. On Pro / Max plans usage is not billed per token; the docs do not say whether the price step affects plan limits.

Docs: [Subagents](https://code.claude.com/docs/en/sub-agents), [Auto-compact window](https://code.claude.com/docs/en/model-config#set-the-auto-compact-window), [Memory and rules](https://code.claude.com/docs/en/memory), [Settings](https://code.claude.com/docs/en/settings), [Haiku long-context pricing](https://platform.claude.com/docs/en/about-claude/pricing#long-context-pricing).
