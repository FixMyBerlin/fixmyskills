# TypeScript (unslop-code)

Phase 1. Prefer inference. Fix the type at the value, not with a cast.

This phase runs **before** Zod (Phase 2) so it does not add code the Zod pass would rewrite. Stay inside TypeScript: no new schemas, no `z.infer` aliases, no duplicate GeoJSON interfaces. When the root fix for an `as` is a runtime parse or a GeoJSON helper, leave the `as` with a why-keep and name it for Phase 2 — see [zod-audit.md](zod-audit.md).

Lint: `'typescript/switch-exhaustiveness-check': 'error'` in skill `tech-stack` ([oxlint.config.mjs](../../tech-stack/examples/oxlint.config.mjs)).

## Return types

Remove explicit function/method return types. Let TypeScript infer.

If a type is required, put it **in place**: annotate the const or parameter so the return infers. Do not annotate the function unless the code gets too complex without it (inference is `any`, a huge unreadable union, recursion that fails, or a required call-signature that will not attach).

Record a one-line why-keep when you leave a return type.

```ts
function loadUser(id: string) {
  return db.user.find(id)
}

const spec: LayerSpec = { id, paint }
```

A type annotation is not a cast. `const foo: Foo = …` declares the shape and is fully checked; it cannot override the type the way `as` can. It is a fine end state — do **not** rewrite it to `const foo = … satisfies Foo`.

Keep `as const` on tuples when that is what inference needs (see `react-dev` hooks.md). That is not a return-type annotation.

## `as`

Remove `as` (including `as unknown as`). Prefer fixing the root: tighter producer types, a Zod parse, a narrowed union, or `satisfies`.

Keep `as` only when the code gets too complex without it (broken library types you cannot patch in this pass). Why-keep.

**Prefer `satisfies` over `as` whenever possible.** `satisfies` checks the value and keeps literals. `as` overrides the type and can hide mistakes.

This rule is about **`as` sites only** — `return foo as Foo`, `const foo = someOtherVar as Foo`:

```ts
// Not
const locale = { Zoom: 'Zoom' } as Record<string, string>
return { id, paint } as LayerSpec

// Yes
const locale = { Zoom: 'Zoom' } satisfies Record<string, string>
return { id, paint } satisfies LayerSpec
```

A type annotation is **not** an `as` site. `const locale: Record<string, string> = { Zoom: 'Zoom' }` is already checked — leave it alone.

`as const` stays when you need a literal tuple/object and `satisfies` is not enough.

**Not** a case for `as const`: a hand-written GeoJSON literal. `{ type: 'Point' as const, coordinates: [lng, lat] }` means the value should have come from a helper. Leave it for Phase 2 ([zod-audit.md](zod-audit.md) → GeoJSON).

## `switch`

Prefer `switch` over `if` / `else if` chains on the same discriminant (union, enum, string literal).

Trust exhaustiveness. Do **not** add `default`, and do **not** add a fake default (`never` assign, `throw new Error('unreachable')`) to silence the compiler. Cover every variant. If a new member appears, the oxlint exhaustiveness rule fails.

A single `if` for one check, or conditions that are not one union, can stay `if`.

```ts
switch (status) {
  case 'idle':
    return null
  case 'ready':
    return view
}
```

## Search (give to `explore`)

```bash
rg -n -g '*.ts' -g '*.tsx' -e '\)\s*:\s*' -e ' as ' -e ' as const' -e 'satisfies ' -e 'else if' -e 'switch \(' -e 'default:'
```

Flag `: ReturnType` on functions, `as Foo`, `else if` on a discriminant, and `default:` in switches on unions.
