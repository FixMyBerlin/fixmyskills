# Component location (unslop-code)

Phase 6. Folder rules live in skill `tanstack-start-conventions` → [app-structure.md](../../tanstack-start-conventions/references/app-structure.md). Load that file (and the repo’s local `docs/` path map if present). Do not copy those tables here.

This pass is the **residue** after a refactor: something still sits where nobody would look.

Skip when the branch touches no `components/` (or equivalent).

## Both are clean

- **Colocate** a subcomponent next to the parent that owns it (same feature folder / hierarchy)
- **Shared** when it is a real abstraction (`components/shared/` or the domain’s shared UI)

Do not invent a third dumping ground. Do not leave the old file behind after a copy. Do not keep a temporary import from the old path (Phase 3 deletes pass-through re-exports; this phase moves or deletes the file itself).

## What to look for

- Files added or edited on the branch that live outside the feature folder they belong to
- Private helpers still under `components/shared/` (or a sibling feature) after they became single-use
- Shared-looking names that have only one importer — move next to that parent unless a second consumer is coming (AskQuestion)
- Feature-local components that two or more features now import — extract to shared, or AskQuestion
- Empty folders, stale barrels, and the previous path still imported after a rename
- Page/layout components defined in `routes/` (thin-route rule from `app-structure.md`)

## What to do

- **Obvious leftover** (old path, one importer, empty folder): move or delete in this phase; update imports; no shim
- **Colocate vs shared is a product/API choice:** AskQuestion with both folders and the importer list
- **Unclear or large move:** follow-up plan item; do not guess

## Search (give to `explore`)

```bash
git diff --name-status -M <base>...HEAD -- '**/components/**' '**/routes/**'
```

For each moved/added TSX, list importers and whether the path matches the parent feature or `shared/`. Flag orphans.
