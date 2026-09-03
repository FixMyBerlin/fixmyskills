# Worker briefs (unslop-code)

Orchestrator: paste the matching brief into `/implementer`. Fill `<base>` (`develop` or `main`), repo root, and skill name. Each implementer runs [finish-work](../../finish-work/SKILL.md) for **one** commit when it changed files; skip commit when there is nothing to land.

Every brief means the **merge-base** range `<base>...HEAD`, never `<base>` alone. Repo-wide `rg` is discovery only: intersect with `git diff --name-only <base>...HEAD` and work the branch files first.

Every brief also carries the same guardrails: do not change public API or behavior silently, do not touch files outside the phase's scope, and if the phase turns up nothing, say so and skip the commit instead of inventing work.

Unclear **behavior** change, deploy status, colocate vs shared, decision lift, or merge-ready leftover cleanup: report it; do not implement (orchestrator AskQuestion — question must stand alone with context). Optional / style / "maybe" items: return as **secondary**; do not implement. Decision-hierarchy items that need design: return as **decision-lift follow-ups**.

---

## Explore: Phase 1 (Zod)

Find runtime validation and hand-rolled type checks vs `<base>`. Also repo-wide: `JSON.parse`, `as SomeType` on unknown, `typeof` / `instanceof` guards at boundaries, `from 'zod'`, `safeParse`, `tokenFromAuthJson`, `validateSearch`, `process.env`. List file:line and whether the value is untrusted. Do not edit.

## Implementer: Phase 1 (Zod)

Read skill `unslop-code` → `references/zod-audit.md` and https://zod.dev/llms.txt.

In general all type checking should be done with Zod 4. Replace boundary validation with Zod 4. Make the contract clear so we do not over-check for every possible case. Look at what the input actually is from what we know about the data.

For each site: convert **or** write a one-line why-not. Example target: `src/utils/auth.ts` `tokenFromAuthJson` if present.

Then finish-work commit this phase only. Report conversions, why-nots, and secondary items.

---

## Explore: Phase 2 (TypeScript)

Find extra return types, `as` casts, `else if` chains on a union, and `default:` in switches vs `<base>` and repo-wide. See [typescript.md](typescript.md) search. Do not edit.

```bash
rg -n -g '*.ts' -g '*.tsx' -e ' as ' -e 'satisfies ' -e 'else if' -e 'default:'
```

## Implementer: Phase 2 (TypeScript)

Read skill `unslop-code` → `references/typescript.md`.

Remove explicit return types unless the code gets too complex without them. Prefer inferred types; force types in place (const, param, `satisfies`) if needed. Remove `as` unless too complex without them; fix the issue at the root. Prefer `satisfies` over `as`. Prefer `switch` over `if` / `else if` on a union. Trust TS exhaustiveness: no `default` and no fake default.

Then finish-work commit this phase only. Report why-keeps and secondary items.

---

## Explore: Phase 3 (re-exports)

Find pass-through re-exports vs `<base>` and repo-wide. Flag likely LLM shims (old path re-exports a moved module) vs intentional barrels (`package` index, documented feature API). Do not edit.

```bash
rg -n -g '*.ts' -g '*.tsx' -e 'export \{[^}]+\} from' -e 'export \* from'
```

Also flag files that `import { foo }` from a sibling and immediately `export { foo }`.

## Implementer: Phase 3 (re-exports)

Update all imports to the real module. Delete the shim. We do not want import+export pass-throughs; we want the clean new state. Keep only intentional public barrels. AskQuestion if unsure.

Then finish-work commit this phase only.

---

## Explore: Phase 4 (legacy)

Grep comments and identifiers. Note whether the old path is backed by production data/URLs. Do not edit.

```bash
rg -n -i -g '*.ts' -g '*.tsx' -g '*.md' -e 'legacy' -e 'migration' -e 'compat' -e 'deprecated' -e 'shim' -e 'backwards' -e 'old format' -e 'old path'
```

## Implementer: Phase 4 (legacy)

Question every legacy/migration/compat path. Confirm it is required. Especially for new features: we do not need or want migrations and legacy stuff. We want a clean new state of the app instead.

Delete shims that exist only because an LLM was cautious. **Keep** on-disk session formats and URL contracts other systems still send. Deploy gate and migration-file squash are Phase 4b — do not keep PR-local extras here. AskQuestion when dropping the old path could break existing users.

Then finish-work commit this phase only.

---

## Explore: Phase 4b (undeployed WIP)

List new migration directories/files vs `<base>`; list old-to-new / dual-format code; note any evidence of deploy/apply. Do not edit.

```bash
git diff --name-status <base>...HEAD -- '*prisma/migrations*' '*drizzle*' '**/migrations/**'
rg -n -i -g '*.ts' -g '*.tsx' -g '*.sql' -e 'old format' -e 'backwards compatible' -e 'during migration' -e 'migrateOld' -e 'legacy'
```

## Implementer: Phase 4b (undeployed WIP)

Read skill `unslop-code` → `references/undeployed-wip.md`. How to squash: skill `prisma`.

If deploy status is unknown, stop and propose an AskQuestion (files found; what happens if not deployed vs already applied). Do not squash or drop persistence without a confirmed “not deployed”.

If not deployed: squash branch-local migrations into the fewest files that express the final schema; delete old-to-new code. If deployed: keep applied migrations; only drop unused code dual-paths.

Then finish-work commit this phase only. Skip when the branch adds no migrations and no old-to-new paths.

---

## Explore: Phase 5a (tech-stack)

Read skill `tech-stack`. From `package.json` and usage, report: Router vs Start, maps, Zustand, Zod major, Query, nuqs, Redux, raw MapLibre. List stack deviations to fix. Do not edit.

## Implementer: Phase 5 (one skill per spawn)

Read the named skill fully (and its linked references that the findings touch).

Code-review changes to align them with best practices described in skill `<name>` and fix changes. Create a separate commit. Ask if things are not a clear fix or improvement. Collect secondary changes in chat.

`<name>` is one of: `tech-stack`, `react-dev`, `react-map-gl`, `tanstack-router-conventions`, `zustand-state-management`.

Stay inside that skill's scope. finish-work commit this pass only.

---

## Explore: Phase 6 (component location)

`git diff --name-status` vs `<base>` for `components/` (and `routes/`). For each moved/added TSX, list importers and whether the path matches the parent feature or `shared/`. Flag orphans, empty folders, stale barrels, and UI defined in `routes/`. Do not edit.

```bash
git diff --name-status -M <base>...HEAD -- '**/components/**' '**/routes/**'
```

## Implementer: Phase 6 (component location)

Read skill `tanstack-start-conventions` → `app-structure.md` and skill `unslop-code` → `references/component-location.md`. Placement only.

Move or delete leftovers. Update imports. No re-export shims. Colocate next to the parent or extract as shared — both are clean. AskQuestion when that choice is unclear (both folders + importer list).

Then finish-work commit this phase only. Skip when the branch touches no `components/`.

---

## Explore: Phase 7 (decision lift)

Walk the branch (and obvious call sites) for repeated decisions and wasted work. Group by “could move to route / layout / parent”. Do not edit.

## Implementer: Phase 7 (decision lift)

Read skill `unslop-code` → `references/decision-lift.md`.

Apply only obvious lifts (parent already has the value; leaf only repeats it). Record decision-lift follow-ups for items that need design. Propose AskQuestion text that already includes context (file/route, today, options, what we will do with the answer).

Then finish-work commit this phase only. Skip when the repo has no app tree.

---

## Explore: Phase 8 (semantic HTML)

List high-`div`/`span` TSX in the branch; cluster sibling families; name consuming pages. Flag `onClick` on non-`button`/`a`. Do not edit.

```bash
git diff --name-only <base>...HEAD -- '*.tsx' > /tmp/unslop-branch-tsx
xargs rg -n -e '<div' -e '<span' -e 'onClick=' < /tmp/unslop-branch-tsx
```

## Implementer: Phase 8 (semantic HTML)

Read skill `unslop-code` → `references/semantic-html.md`.

Replace generic wrappers where the meaning is clear. Change families together. Verify each consumer’s outline (one `h1`, no skipped levels, no second `main`). Keep layout-only `div`/`span`. Do not add ARIA as a substitute for a real element.

Then finish-work commit this phase only. Skip when there is no UI TSX.

---

## Explore: Phase 9 (leftover process)

Orchestrator AskQuestion first: merge-ready vs still deep in the work. Spawn this explore **only** on “merge-ready”.

`git diff --name-status` vs `<base>` for `.md`, `.sql`, `scripts/`, helpers that are not app/components. Check `package.json` and CI for callers. Do not edit.

```bash
git diff --name-status <base>...HEAD -- '*.md' '*.sql' 'scripts/' '*.http'
```

## Implementer: Phase 9 (leftover process)

Read skill `unslop-code` → `references/leftover-process.md`. Spawn **only** on “merge-ready”.

Delete confirmed leftovers that are not everyday/critical. Prove each one is unreferenced first (grep basename and path across imports, `package.json`, CI, Dockerfiles, docs). Keep `README` / `AGENTS.md` / user-changelog / legal text / scripts wired into `package.json` or CI. Never delete a file the branch did not add, and never delete untracked files. AskQuestion when a file is referenced from README but not from code/CI.

Then finish-work commit this phase only.

---

## Explore: Phase 10 (unslop-text)

Diff vs `<base>`: comments, JSDoc, new/changed markdown, user-facing strings. Flag restating comments, AI vocabulary, em dashes, emoji in headings, curly quotes, chatbot phrases. Do not edit.

```bash
rg -n -g '*.ts' -g '*.tsx' -g '*.md' -e 'TODO' -e 'NOTE:' -e 'IMPORTANT:' -e 'simply' -e 'leverage' -e 'robust'
```

## Implementer: Phase 10 (unslop-text)

Read skill `unslop-text`. Apply it to comments, JSDoc, markdown, and user-facing strings in the branch. Do not restructure code. Do not rewrite the whole docs tree.

Keep legal/attribution text, intentional German UI copy, and comments that name a MapLibre/React quirk with a link.

Then finish-work commit this phase only.

## Verifier (after any phase that committed)

Confirm the commit matches the phase, no leftover shims in that scope, and `bun run check` (or the implementer's reported check) is green. Do not edit.
