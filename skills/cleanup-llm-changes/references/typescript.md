# TypeScript (cleanup-llm-changes)

Phase 2. Prefer inference. Fix the type at the value, not with a cast.

Lint: `'typescript/switch-exhaustiveness-check': 'error'` in skill `tech-stack` ([oxlint.config.mjs](../../tech-stack/examples/oxlint.config.mjs)).

## Return types

Remove explicit function/method return types. Let TypeScript infer.

If a type is required, put it **in place**: annotate the const, parameter, or `satisfies` on the value so the return infers. Do not annotate the function unless the code gets too complex without it (inference is `any`, a huge unreadable union, recursion that fails, or a required call-signature that will not attach).

Record a one-line why-keep when you leave a return type.

```ts
function loadUser(id: string) {
  return db.user.find(id)
}

const spec = { id, paint } satisfies LayerSpec
```

Keep `as const` on tuples when that is what inference needs (see `react-dev` hooks.md). That is not a return-type annotation.

## `as`

Remove `as` (including `as unknown as`). Prefer fixing the root: tighter producer types, a Zod parse, a narrowed union, or `satisfies`.

Keep `as` only when the code gets too complex without it (broken library types you cannot patch in this pass). Why-keep.

**Prefer `satisfies` over `as` whenever possible.** `satisfies` checks the value and keeps literals. `as` widens and can hide mistakes.

```ts
const locale = { Zoom: 'Zoom' } satisfies Record<string, string>
```

Not:

```ts
const locale = { Zoom: 'Zoom' } as Record<string, string>
```

`as const` stays when you need a literal tuple/object and `satisfies` is not enough.

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
