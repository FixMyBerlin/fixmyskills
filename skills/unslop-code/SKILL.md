---
name: unslop-code
description: >-
  Orchestrated cleanup of LLM leftovers in an FMC app: TypeScript inference
  (no extra return types or `as`), Zod 4 at runtime boundaries with GeoJSON
  types and helpers, delete pass-through re-exports, drop unneeded
  legacy/migration shims, squash undeployed WIP migrations,
  skill-aligned code-review passes (react-dev,
  react-map-gl, tanstack-router-conventions, tech-stack, zustand), component
  location, decision lift, semantic HTML, leftover process artifacts on a
  merge-ready PR, then unslop-text on comments and docs in the branch.
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

- `<base>` is `develop`, or `main` if that is the base. Always diff **`<base>...HEAD`** (merge-base), never `<base>` alone — a two-dot diff reports commits that landed on `<base>` after the branch started and workers will "clean up" code they never wrote.
- Branch diff **and** repo-wide greps for the anti-patterns in each phase.
- Repo-wide greps are for discovery. Before a worker reads a repo-wide hit list, intersect it with the branch files (`git diff --name-only <base>...HEAD`) and hand over the branch hits first. Off-branch hits are Secondary unless the phase says otherwise.
- Skip a later skill pass when tech-stack shows that stack is unused (no maps → skip `react-map-gl`; no Zustand → skip `zustand-state-management`; no TanStack Router → skip `tanstack-router-conventions`).
- **AskQuestion** when a proposed edit would change runtime behavior **or** when a clear answer would unlock a cleanup: deploy status (4b), colocate vs shared (6), a decision lift (7), or whether this PR is merge-ready (9). Workers propose questions; you ask. Do not ship a behavior change without asking.
- Every question must stand alone: name the file/route and what the code does today, the options and what each simplifies or costs, and why the answer is needed now. No vague “should we refactor X?”
- Other judgment calls (style, optional refactors, "maybe") go to **Secondary changes**. Decision-hierarchy items that need design go to **Decision-lift follow-ups**. Do not apply them. The orchestrator keeps both lists.

## Preflight

Before Phase 1, in this order:

1. Resolve `<base>` (`git remote show origin`, or the PR base) and confirm the range is non-empty: `git log --oneline <base>...HEAD`.
2. Confirm the working tree is clean. Uncommitted work is not yours to commit — **AskQuestion**: commit it first, stash it, or stop.
3. Note the current HEAD SHA in chat. It is the rollback point if a phase goes wrong.
4. Run the repo's check command once (`bun run check`) to record the **starting** state. If it is already red, say so up front so a later red is not blamed on this cleanup.

A phase whose checks stay red after one fix attempt gets reverted, not patched further: drop the phase, record it as a follow-up, and move on. Never commit a red phase to keep the sequence going.

## Checklist

```
- [ ] Preflight: base resolved, tree clean, starting check state recorded
- [ ] Phase 1: TypeScript inference, `as` / `satisfies`, exhaustive switch
- [ ] Phase 2: Zod 4 runtime validation (incl. GeoJSON types and helpers)
- [ ] Phase 3: Pass-through re-exports
- [ ] Phase 4: Legacy / migration shims
- [ ] Phase 4b: Undeployed WIP (skip if no migrations / old-to-new)
- [ ] Phase 5a: tech-stack (stack audit + which later passes apply)
- [ ] Phase 5b: react-dev
- [ ] Phase 5c: react-map-gl (skip if no maps)
- [ ] Phase 5d: tanstack-router-conventions (skip if no Router)
- [ ] Phase 5e: zustand-state-management (skip if no Zustand)
- [ ] Phase 6: Component location (skip if no components/)
- [ ] Phase 7: Decision lift (skip if no app tree)
- [ ] Phase 8: Semantic HTML (skip if no UI TSX)
- [ ] Phase 9: Leftover process artifacts (skip if not merge-ready)
- [ ] Phase 10: unslop-text on comments, docs, and copy
- [ ] Secondary changes listed
- [ ] Decision-lift follow-ups listed
- [ ] Chat summary (unslop-text)
```

---

## Phase 1: TypeScript

Remove extra annotations the model added. Load [references/typescript.md](references/typescript.md).

- **Return types:** delete them. Prefer inferred types. If a type is needed, force it **in place** (const, param, `satisfies`) so the return infers. Keep an explicit return type only when the code gets too complex without it. Why-keep.
- **`as`:** delete it. Fix the issue at the root. Keep `as` only when the code gets too complex without it. Why-keep.
- Prefer **`satisfies`** over **`as`** whenever possible. Keep `as const` when that is what inference needs.
- Prefer **`switch`** over `if` / `else if` on a union. Trust exhaustiveness (`typescript/switch-exhaustiveness-check`). No `default` and no fake default (`never` / unreachable throw).

**Do not do Phase 2's work here.** This phase runs first so it does not add code the Zod pass would then rewrite. Add no schemas, no `z.infer` aliases, no duplicate GeoJSON interfaces, and no hand-built `{ type: 'Point' as const, … }` to make a type line up. When the root fix for an `as` is a Zod parse or a GeoJSON helper, leave it with a why-keep and let Phase 2 take it.

Commit this phase on its own.

---

## Phase 2: Zod 4

In general all type checking should be done with Zod 4.

Audit runtime type checking and validation (JSON, env, cookies, search params, request bodies, `localStorage`, `unknown` / `JSON.parse` results). Example: `src/utils/auth.ts` `tokenFromAuthJson`. Replace hand-rolled checks with Zod 4 when the value is untrusted input.

Make the contract clear so we do not over-check for every possible case. Look at what the input actually is from what we know about the data (who writes it, which fields exist today). Schema that shape. Not `z.unknown()` trees, extra `.optional()` / `.passthrough()` / `.catchall()`, or "maybe also an array" branches with no evidence.

This phase also owns **GeoJSON**: `@types/geojson` for types, a schema to parse untrusted GeoJSON, and construction helpers instead of hand-written literals. See zod-audit.md.

For each site, either convert to Zod 4 **or** record a **why-not** (compile-time TS only, already parsed by a parent schema, React props, trusted in-process value). Fetch [zod.dev/llms.txt](https://zod.dev/llms.txt). Pin/API: skill `tech-stack` (Zod 4) and `tanstack-router-conventions` (`validateSearch`, no `zodValidator()`).

Load [references/zod-audit.md](references/zod-audit.md) before the implementer brief. It also carries the Phase 1 why-keeps whose root fix is a parse.

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

If a dual path exists only because the LLM was cautious, delete the old path.

**Deploy gate and migration-file squash** are Phase 4b. Do not treat “keep live Prisma migrations” here as a reason to keep PR-local extras — that keep-rule applies only after 4b knows the branch shipped.

AskQuestion when dropping the old path could break existing data or URLs. If it is not a clear yes, list it as Secondary.

Commit this phase on its own.

---

## Phase 4b: Undeployed WIP

LLMs on a long-lived PR often add **old → new** compatibility and **one Prisma (or similar) migration per intermediate commit**, even though the branch was never deployed. The clean new state is one schema step and no reader for a format that never left the laptop.

Load [references/undeployed-wip.md](references/undeployed-wip.md). How to squash: skill `prisma`.

If deploy status is not obvious, **AskQuestion** before deleting or squashing. Skip when the branch adds no migrations and no old-to-new paths.

- **Not deployed (confirmed):** squash branch-local migrations into the fewest files that express the final schema; delete old-to-new code.
- **Deployed / live data:** keep applied migrations and on-disk contracts.
- **Unsure / no reply:** do not guess; list as follow-up.

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

## Phase 6: Component location

After refactors, files are sometimes left where nobody would look. Folder rules: skill `tanstack-start-conventions` → `app-structure.md`. Load [references/component-location.md](references/component-location.md). Placement only — not a full Start skill review.

Both are clean: **colocate** a subcomponent next to its parent, or extract it as **shared** when it is a real abstraction. Do not leave the old file behind. No re-export shims (Phase 3).

Skip when the branch touches no `components/` (or equivalent). AskQuestion when colocate vs shared is a real choice (include both folders and the importer list).

Commit this phase on its own.

---

## Phase 7: Decision lift

Where are we doing unnecessary work, and which decisions can we take higher up so the code below gets simpler?

This is not a second Zod or legacy pass. Load [references/decision-lift.md](references/decision-lift.md). Look at the remaining tree: a parent already knows the answer, but children still branch, re-narrow, re-fetch, or re-decide.

- Very obvious: fix in this phase.
- Needs design: **Decision-lift follow-up** (location, what is duplicated, what would get simpler, why not now). Do not guess.
- User/product choice: AskQuestion.

Skip when the repo has no app tree. Commit this phase on its own.

---

## Phase 8: Semantic HTML

Replace generic `div`/`span` wrappers with native elements where the meaning is clear. Similar components keep a similar structure. After a shared change, consuming pages must still have a logical outline (one `h1`, no skipped levels, no second `main`).

Load [references/semantic-html.md](references/semantic-html.md). Skip when the branch touches no UI TSX.

Not an a11y audit. Keep layout-only `div`/`span`. Ambiguous restyles go to Secondary.

Commit this phase on its own.

---

## Phase 9: Leftover process artifacts

Scratch docs, one-off SQL, and helper scripts pile up mid-PR. **Do not clean those mid-stream.**

**AskQuestion first** (must stand alone): make this PR **production-ready to merge** (list candidates, then delete unused), or **still deep in the work** (skip entirely). Different from Phase 4b (schema/compat). Load [references/leftover-process.md](references/leftover-process.md).

Spawn workers only on “merge-ready”. Keep everyday/critical tooling (`package.json` / CI / `bun run`), README / AGENTS.md / user-changelog, and migrations 4b already kept. If skipped, record “Phase 9 skipped — not merge-ready”.

Commit this phase on its own when it ran.

---

## Phase 10: unslop-text

After the code phases (and Phase 9 deletes), apply [unslop-text](../unslop-text/SKILL.md) to **comments, JSDoc, markdown, and user-facing strings** in the branch (diff vs `<base>` plus leftover LLM comments in touched files). Do not rewrite the whole docs tree. Do not restructure code in this phase.

**Keep:** legal/attribution text; intentional German UI copy; a comment that names a MapLibre/React quirk with a link.

Commit this phase on its own. The orchestrator chat summary follows unslop-text too.

---

## Secondary changes

Running list (orchestrator owns it). Include: location, what the worker wanted, why it was not a clear fix. Do not implement in this run.

## Decision-lift follow-ups

Running list (orchestrator owns it). Items from Phase 7 that need a real plan: location, what is duplicated or decided too low, what would get simpler above/below, why it is not a clear fix now. Do not implement in this run.

## End summary (chat)

1. **Phase 1 TypeScript:** return types and `as` removed; `satisfies`; exhaustive `switch`; why-keeps handed to Phase 2
2. **Phase 2 Zod:** converted / why-not / skipped; GeoJSON types and helpers
3. **Phase 3 Re-exports:** removed shims; kept barrels (why)
4. **Phase 4 Legacy:** removed vs kept (why required)
5. **Phase 4b Undeployed WIP:** squashed / kept (deployed) / skipped / asked
6. **Phase 5 Skill reviews:** per skill: committed / skipped / asked
7. **Phase 6 Location:** moved / deleted leftovers / skipped / asked
8. **Phase 7 Decision lift:** obvious lifts; follow-ups; asked
9. **Phase 8 Semantic HTML:** families changed / skipped
10. **Phase 9 Leftover process:** cleaned / skipped — not merge-ready
11. **Phase 10 unslop-text:** comments/docs rewritten or deleted
12. **Commits:** SHAs + subjects
13. **Secondary changes:** the full list (or "none")
14. **Decision-lift follow-ups:** the full list (or "none")
15. **Follow-ups:** phases reverted and why, checks still red, open AskQuestion items

Write this summary following [unslop-text](../unslop-text/SKILL.md).

## Related

[unslop-text](../unslop-text/SKILL.md) · [agent-orchestration](../agent-orchestration/SKILL.md) · [finish-work](../finish-work/SKILL.md) · [tech-stack](../tech-stack/SKILL.md) · [react-dev](../react-dev/SKILL.md) · [react-map-gl](../react-map-gl/SKILL.md) · [tanstack-router-conventions](../tanstack-router-conventions/SKILL.md) · [tanstack-start-conventions](../tanstack-start-conventions/SKILL.md) · [zustand-state-management](../zustand-state-management/SKILL.md) · [prisma](../prisma/SKILL.md) · [worker-briefs.md](references/worker-briefs.md) · [typescript.md](references/typescript.md) · [zod-audit.md](references/zod-audit.md) · [undeployed-wip.md](references/undeployed-wip.md) · [component-location.md](references/component-location.md) · [decision-lift.md](references/decision-lift.md) · [semantic-html.md](references/semantic-html.md) · [leftover-process.md](references/leftover-process.md)
