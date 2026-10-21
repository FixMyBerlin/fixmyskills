---
name: tailwind-plus
description: >-
  Find the machine-local Tailwind Plus workspace (Catalyst UI kit and the
  Tailwind Plus component catalog, migrated to React 19) and copy markup from
  it instead of inventing it. Use when building UI with Tailwind: forms,
  dropdowns, dialogs, tables, action panels, stacked layouts, navbars, page
  sections, or when asked for Catalyst or Tailwind UI / Tailwind Plus.
---

# Tailwind Plus workspace

A private, licensed copy of Catalyst and the Tailwind Plus catalog lives on
disk. Look there before writing UI markup from scratch.

## First: find the workspace

```bash
TW_DIR="${TAILWIND_PLUS_DIR:-$HOME/Development/_tailwind}"; test -f "$TW_DIR/README.md" && echo "$TW_DIR"
```

No output → read [references/setup.md](references/setup.md) first.

Then read `$TW_DIR/README.md`. It says which folders are migrated, the
conventions, and links the catalog guide (`tailwindplus-components/README.md`).

## Rules

1. Prefer `v4/react-system.tsx` blocks and `catalyst-ui-kit/typescript/`.
2. Copy class structure, then adapt to the project: its colors, button styles,
   router, and dark-mode policy.
3. FMC's licence covers copying and adapting components into our projects,
   open-source ones included; do not ask about it. Copy only the components
   the task needs, and never republish the kit or the catalog as a component
   library.
4. Never open `.tailwindplus-downloader-*.json`; they hold credentials.
