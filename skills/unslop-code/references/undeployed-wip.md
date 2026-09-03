# Undeployed WIP (unslop-code)

Phase 4b. Deploy gate plus migration-file hygiene. Phase 4 greps identifiers (`legacy`, `compat`, dual-path). This phase asks whether the **branch ever shipped**, then squashes or drops old-to-new work that never left the laptop.

How to squash Prisma migrations: skill `prisma`. Do not copy migrate commands here.

The Phase 4 keep-rule (“real Prisma migrations for a live DB”) applies **only after** this phase knows the branch shipped. Do not use it to keep PR-local extras.

## Gate: was this PR deployed?

If it is not obvious (no production apply, no shipped URL contract, no live data on the old path), stop and let the orchestrator **AskQuestion** before deleting or squashing.

Question shape (must stand alone):

- What we found: the new migration files on this branch and any old-format reader
- If **not** deployed: squash those files into the fewest that express the final schema; delete the old-format reader; keep only the final schema
- If **already** applied to a live DB: keep the applied migrations; only drop code dual-paths that are still unused

Do not squash or drop persistence if the answer is “deployed” or there is no reply yet. List as follow-up.

Skip this phase when the branch adds no migrations and no old-to-new paths.

## What to look for

- Dual-path “migrate old state to new” in app code for a feature that only exists on this branch
- Several migration files in the branch diff that together are one schema change (renames, add-then-change, add-then-drop)
- Data backfill scripts or dual Zod shapes whose only consumer is the in-PR old format
- Comments like “backwards compatible” / “during migration” with no production writer of the old shape

## What to do

- **Not deployed (confirmed):** squash branch-local migrations into the fewest files that express the final schema; delete old-to-new code; want the clean new state
- **Deployed / live data:** keep applied migrations and on-disk contracts
- **Unsure:** AskQuestion with the list of files; do not guess

## Search (give to `explore`)

```bash
git diff --name-status <base> -- '*prisma/migrations*' '*drizzle*' '**/migrations/**'
rg -n -i -g '*.ts' -g '*.tsx' -g '*.sql' -e 'old format' -e 'backwards compatible' -e 'during migration' -e 'migrateOld' -e 'legacy'
```

List new migration directories vs `<base>`, old-to-new / dual-format code, and any evidence of deploy/apply.
