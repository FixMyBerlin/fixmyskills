# Worker briefs (cleanup-llm-changes)

Orchestrator: paste the matching brief into `/implementer`. Fill `<base>` (`develop` or `main`), repo root, and skill name. Each implementer runs [finish-work](../../finish-work/SKILL.md) for **one** commit when it changed files; skip commit when there is nothing to land.

Unclear **behavior** change: report it; do not implement (orchestrator AskQuestion). Optional / style / "maybe" items: return as **secondary**; do not implement.

---

## Explore: Phase 1 (Zod)

Find runtime validation and hand-rolled type checks vs `<base>`. Also repo-wide: `JSON.parse`, `as SomeType` on unknown, `typeof` / `instanceof` guards at boundaries, `from 'zod'`, `safeParse`, `tokenFromAuthJson`, `validateSearch`, `process.env`. List file:line and whether the value is untrusted. Do not edit.

## Implementer: Phase 1 (Zod)

Read skill `cleanup-llm-changes` → `references/zod-audit.md` and https://zod.dev/llms.txt.

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

Read skill `cleanup-llm-changes` → `references/typescript.md`.

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

Delete shims that exist only because an LLM was cautious. **Keep** live Prisma migrations, on-disk session formats, and URL contracts other systems still send. AskQuestion when dropping the old path could break existing users.

Then finish-work commit this phase only.

---

## Explore: Phase 5a (tech-stack)

Read skill `tech-stack`. From `package.json` and usage, report: Router vs Start, maps, Zustand, Zod major, Query, nuqs, Redux, raw MapLibre. List stack deviations to fix. Do not edit.

## Implementer: Phase 5 (one skill per spawn)

Read the named skill fully (and its linked references that the findings touch).

Code-review changes to align them with best practices described in skill `<name>` and fix changes. Create a separate commit. Ask if things are not a clear fix or improvement. Collect secondary changes in chat.

`<name>` is one of: `tech-stack`, `react-dev`, `react-map-gl`, `tanstack-router-conventions`, `zustand-state-management`.

Stay inside that skill's scope. finish-work commit this pass only.

---

## Explore: Phase 6 (unslop)

Diff vs `<base>`: comments, JSDoc, new/changed markdown, user-facing strings. Flag restating comments, AI vocabulary, em dashes, emoji in headings, curly quotes, chatbot phrases. Do not edit.

```bash
rg -n -g '*.ts' -g '*.tsx' -g '*.md' -e 'TODO' -e 'NOTE:' -e 'IMPORTANT:' -e 'simply' -e 'leverage' -e 'robust'
```

## Implementer: Phase 6 (unslop)

Read skill `cleanup-llm-changes` → `references/unslop.md`. If pstack `unslop` is installed, read that too.

Cut AI tells from comments, JSDoc, markdown, and user-facing strings in the branch. Preserve meaning. FMC tone: dry and specific. Do not add soul. Do not restructure code.

Then finish-work commit this phase only.

## Verifier (after any phase that committed)

Confirm the commit matches the phase, no leftover shims in that scope, and `bun run check` (or the implementer's reported check) is green. Do not edit.
