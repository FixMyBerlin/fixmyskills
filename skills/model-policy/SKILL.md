---
name: model-policy
description: >-
  Set up the FMC model and effort policy for Claude Code in ~/.claude: the
  session (normally Opus 5.5 medium) picks each subagent's model and effort
  from the cost-vs-coding-score Pareto line, Haiku high to Fable medium, with
  Fable for second opinions, hard tasks and reviews. Use when
  setting up Claude Code on a new machine, or to update the policy after this
  skill changed.
user-invocable: true
disable-model-invocation: true
---

# Model policy

A skill only loads when called, so the policy itself must not live in a skill. This skill copies it into your user-level Claude Code config, where it applies to every session in every project:

| File                                             | What it does                                                                       |
| ------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `~/.claude/rules/model-policy.md`                | The Pareto ladder, when to use Fable, escalation. Loaded every session.            |
| `~/.claude/agents/Explore.md`                    | Replaces the built-in `Explore`, which otherwise runs on the session model (Opus). |
| `~/.claude/agents/implementer.md`, `verifier.md` | Haiku `high` workers for edits and for read-only checks.                           |

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
5. In `~/.claude/settings.json`, remove `env.CLAUDE_CODE_SUBAGENT_MODEL` if it is set (and `env` if it is then empty); keep every other key.
6. Report what changed. The rule and agents apply from the next session on.

## Updating the ladder

Maintainers refresh the ladder in the repo, following [README.md](README.md). Then everyone re-runs `bunx skills update -g -y` and `/model-policy`.

## Why each piece

- **Rule, not CLAUDE.md:** a rule file without `paths` loads at the start of every session like `CLAUDE.md`, but stays one file this skill can replace on update.
- **No `CLAUDE_CODE_SUBAGENT_MODEL`:** it would also apply to subagents that skills and workflows start without a model, such as `/code-review` reviewers, and run them on that model instead of the session model. A subagent with no `model` runs on the session model.
- **Explore agent:** a user-level agent with the same name replaces the built-in `Explore`, so search runs on Haiku; `Plan` stays on the session model. Built-in `Explore` starts without CLAUDE.md files; custom agents load them all, so the replacement sets `omitClaudeMd: true` to stay close to it.
- **Effort:** there is no setting for a default subagent effort. Agent files pin it (`effort:` frontmatter); for `general-purpose` the rule tells the orchestrator to pass `effort` on each call.

Docs: [Subagents](https://code.claude.com/docs/en/sub-agents), [Memory and rules](https://code.claude.com/docs/en/memory), [Settings](https://code.claude.com/docs/en/settings).
