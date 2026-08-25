---
name: unslop-code
description: >-
  Orchestrated cleanup of LLM leftovers in an FMC app: Zod 4 at runtime
  boundaries, delete pass-through re-exports, drop unneeded legacy/migration
  shims, TypeScript inference (no extra return types or `as`), skill-aligned
  code-review passes (react-dev, react-map-gl, tanstack-router-conventions,
  tech-stack, zustand), then unslop-text on comments and docs in the branch.
  Use when the user asks to cleanup LLM changes, post-agent cleanup, unslop
  code, or to tidy a branch after agent/refactor work. Formerly
  cleanup-llm-changes.
user-invocable: true
disable-model-invocation: true
---

# Unslop code

Orchestrate only. Follow [agent-orchestration](../agent-orchestration/SKILL.md) / `@orchestrator-worker`. Do not implement, grep the tree yourself, or commit. Spawn workers.

**Goal:** a **clean new state** of the app, not compatibility layers left behind by refactors.

## Models

| Role               | Model                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------------- |
| You (orchestrator) | **Grok 4.6 High**, standard / not Fast (`cursor-grok-4.6-high[fast=false]`)                   |
| Grunt work         | `/implementer` → `cursor-grok-4.6-low[fast=false]` (omit Task `model` so frontmatter applies) |
| Search             | Built-in `explore`                                                                            |
| Proof              | `/verifier` after each phase that changed files                                               |

Composer 2.5 (`composer-2.5`, not Fast) is an acceptable grunt worker only when Low is unavailable or the user asks for Composer. Never `inherit`, never High, never Fast on workers.

Each phase below is its **own** orchestrated unit: explore → implementer → verifier → **separate** [finish-work](../finish-work/SKILL.md) commit. Do not batch phases into one worker.

Copy worker prompts from [references/worker-briefs.md](references/worker-briefs.md).

## Scope

Current workspace git repo.

- Diff vs `develop` (or `main` if that is the base) **and** repo-wide greps for the anti-patterns in each phase.
- Skip a later skill pass when tech-stack shows that stack is unused (no maps → skip `react-map-gl`; no Zustand → skip `zustand-state-management`; no TanStack Router → skip `tanstack-router-conventions`).
- **AskQuestion** only when a proposed edit would change runtime behavior and needs a yes/no before committing. Workers report these; you ask.
- Other judgment calls (style, optional refactors, "maybe") go to **Secondary changes**. Do not apply them. The orchestrator keeps the list.

## Checklist

```
- [ ] Phase 1: Zod 4 runtime validation
- [ ] Phase 2: TypeScript inference, `as` / `satisfies`, exhaustive switch
- [ ] Phase 3: Pass-through re-exports
- [ ] Phase 4: Legacy / migration shims
- [ ] Phase 5a: tech-stack (stack audit + which later passes apply)
- [ ] Phase 5b: react-dev
- [ ] Phase 5c: react-map-gl (skip if no maps)
- [ ] Phase 5d: tanstack-router-conventions (skip if no Router)
- [ ] Phase 5e: zustand-state-management (skip if no Zustand)
- [ ] Phase 6: unslop-text on comments, docs, and copy
- [ ] Secondary changes listed
- [ ] Chat summary (unslop-text)
```

---

## Phase 1: Zod 4

In general all type checking should be done with Zod 4.

Audit runtime type checking and validation (JSON, env, cookies, search params, request bodies, `localStorage`, `unknown` / `JSON.parse` results). Example: `src/utils/auth.ts` `tokenFromAuthJson`. Replace hand-rolled checks with Zod 4 when the value is untrusted input.

Make the contract clear so we do not over-check for every possible case. Look at what the input actually is from what we know about the data (who writes it, which fields exist today). Schema that shape. Not `z.unknown()` trees, extra `.optional()` / `.passthrough()` / `.catchall()`, or "maybe also an array" branches with no evidence.

For each site, either convert to Zod 4 **or** record a **why-not** (compile-time TS only, already parsed by a parent schema, React props, trusted in-process value). Fetch [zod.dev/llms.txt](https://zod.dev/llms.txt). Pin/API: skill `tech-stack` (Zod 4) and `tanstack-router-conventions` (`validateSearch`, no `zodValidator()`).

Load [references/zod-audit.md](references/zod-audit.md) before the implementer brief.

Commit this phase on its own.

---

## Phase 2: TypeScript

Remove extra annotations the model added. Load [references/typescript.md](references/typescript.md).

- **Return types:** delete them. Prefer inferred types. If a type is needed, force it **in place** (const, param, `satisfies`) so the return infers. Keep an explicit return type only when the code gets too complex without it. Why-keep.
- **`as`:** delete it. Fix the issue at the root. Keep `as` only when the code gets too complex without it. Why-keep.
- Prefer **`satisfies`** over **`as`** whenever possible. Keep `as const` when that is what inference needs.
- Prefer **`switch`** over `if` / `else if` on a union. Trust exhaustiveness (`typescript/switch-exhaustiveness-check`). No `default` and no fake default (`never` / unreachable throw).

Commit this phase on its own.

---

## Phase 3: Re-exports

Remove pass-through re-exports left when an LLM moved a symbol and did not update imports:

```ts
import { foo } from './new-home'
export { foo }

export { foo } from './new-home'
export * from './new-home'
```

We do not want this. We want the **clean new state**: every call site imports from the new module; delete the shim file.

**Keep** only intentional public barrels (`package` `index.ts`, a designed feature facade documented as the API). If unsure, AskQuestion, then Secondary.

Commit this phase on its own.

---

## Phase 4: Legacy / migration

Question every `legacy`, `migration`, `compat`, `deprecated`, `shim`, `backwards compatible`, dual-path, or "old format" branch. Confirm it is **required**.

Especially with a **new** feature we do not need or want migrations and legacy stuff. We want a **clean new state** of the app instead.

**Do keep** (do not "clean up") real persistence that already exists in production: Prisma migrations for a live DB, auth/session formats still on disk, committed URL/search contracts other systems still send. If a dual path exists only because the LLM was cautious, delete the old path.

AskQuestion when dropping the old path could break existing data or URLs. If it is not a clear yes, list it as Secondary.

Commit this phase on its own.

---

## Phase 5: Skill-aligned code review

1. Load skill `tech-stack` and confirm this app's stack. Flag alternative tools (nuqs on a TanStack app, raw `useEffect` fetch, MapLibre without `react-map-gl/maplibre`, Zod 3, Redux, etc.). Fix clear violations. This pass also decides which of 5b-5e apply.
2. For **each remaining skill**, one implementer: code-review and **fix** to match that skill; **one commit** per skill. AskQuestion only for behavior-changing calls; collect other non-clear items as secondary in chat.

Default passes (skip via 5a):

| Pass | Skill                         | Focus                                       |
| ---- | ----------------------------- | ------------------------------------------- |
| 5a   | `tech-stack`                  | Stack choice; no alternate tools            |
| 5b   | `react-dev`                   | useEffect discipline, Compiler, typing      |
| 5c   | `react-map-gl`                | Map events, not `useEffect` + `map.on()`    |
| 5d   | `tanstack-router-conventions` | Search, loaders, URL state                  |
| 5e   | `zustand-state-management`    | Store shape, selectors, no Query-in-Zustand |

Worker brief shape (substitute the skill name):

> Code-review changes to align them with best practices described in skill `<name>` and fix changes. Create a separate commit. Ask if things are not a clear fix or improvement. Collect secondary changes in chat.

---

## Phase 6: unslop-text

After the code phases, apply [unslop-text](../unslop-text/SKILL.md) to **comments, JSDoc, markdown, and user-facing strings** in the branch (diff vs `<base>` plus leftover LLM comments in touched files). Do not rewrite the whole docs tree. Do not restructure code in this phase.

**Keep:** legal/attribution text; intentional German UI copy; a comment that names a MapLibre/React quirk with a link.

Commit this phase on its own. The orchestrator chat summary follows unslop-text too.

---

## Secondary changes

Running list (orchestrator owns it). Include: location, what the worker wanted, why it was not a clear fix. Do not implement in this run.

## End summary (chat)

1. **Phase 1 Zod:** converted / why-not / skipped
2. **Phase 2 TypeScript:** return types and `as` removed; `satisfies`; exhaustive `switch`
3. **Phase 3 Re-exports:** removed shims; kept barrels (why)
4. **Phase 4 Legacy:** removed vs kept (why required)
5. **Phase 5 Skill reviews:** per skill: committed / skipped / asked
6. **Phase 6 unslop-text:** comments/docs rewritten or deleted
7. **Commits:** SHAs + subjects
8. **Secondary changes:** the full list (or "none")
9. **Follow-ups:** checks still red, open AskQuestion items

Write this summary following [unslop-text](../unslop-text/SKILL.md).

## Related

[unslop-text](../unslop-text/SKILL.md) · [agent-orchestration](../agent-orchestration/SKILL.md) · [finish-work](../finish-work/SKILL.md) · [tech-stack](../tech-stack/SKILL.md) · [react-dev](../react-dev/SKILL.md) · [react-map-gl](../react-map-gl/SKILL.md) · [tanstack-router-conventions](../tanstack-router-conventions/SKILL.md) · [zustand-state-management](../zustand-state-management/SKILL.md) · [typescript.md](references/typescript.md)
