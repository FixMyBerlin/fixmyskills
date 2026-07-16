# Deprecated skills

Skills moved here are **not** published for install or update. The [Skills CLI](https://skills.sh) only discovers skills under the repo root (one level), `skills/`, `skills/.curated/`, `skills/.experimental/`, and `skills/.system/` — not this `deprecated/` folder.

## Uninstall in consuming repos

After this repo removes or relocates a skill, run:

```bash
bunx skills update -p
```

On an interactive terminal, the CLI warns that the skill was deleted upstream and offers to remove local copies. Confirm the prompt to uninstall from `.agents/skills/` and agent symlinks.

**Note:** `bunx skills update -p -y` skips the removal prompt (non-interactive). Run without `-y` once to accept deletion, or remove manually:

```bash
bunx skills remove tanstack-start-migration -y
```

Then delete the skill entry from `skills-lock.json` and commit (the CLI does not prune the lockfile on remove).

## Contents

| Skill                      | Deprecated                                           | Replacement                               |
| -------------------------- | ---------------------------------------------------- | ----------------------------------------- |
| `tanstack-start-migration` | FMC Next.js → TanStack Start migrations are complete | `tanstack-start-conventions`, `react-dev` |
