# Deprecated skills

Skills moved here are **not** published for install or update. The [Skills CLI](https://skills.sh) only discovers skills under the repo root (one level), `skills/`, `skills/.curated/`, `skills/.experimental/`, and `skills/.system/` — not this `deprecated/` folder.

## Uninstall from your machine

After this repo removes or relocates a skill, run:

```bash
bunx skills update -g
```

On an interactive terminal, the CLI warns that the skill was deleted upstream and offers to remove local copies. Confirm the prompt to uninstall from `~/.agents/skills/` and agent symlinks.

**Note:** `bunx skills update -g -y` skips the removal prompt (non-interactive). Run without `-y` once to accept deletion, or remove manually:

```bash
bunx skills remove tanstack-start-migration -g -y
```

## Contents

| Skill                      | Deprecated                                                                     | Replacement                                            |
| -------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------ |
| `tanstack-start-migration` | FMC Next.js → TanStack Start migrations are complete                           | `tanstack-start-conventions`, `react-dev`              |
| `agent-orchestration`      | FMC moved from Cursor to Claude Code; Grok workers and `cursor-agent` are gone | `model-policy` (user-level subagent models and effort) |
| `unslop-text`              | Folded into `unslop-code` (text pass in phase 10), deprecated 2026-10-21       | `unslop-code`                                          |
