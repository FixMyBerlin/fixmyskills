---
name: tanstack-start-auth
description: >-
  Protect TanStack Start routes with Better Auth: session via Headers in beforeLoad
  and server functions, admin gates, optional API keys with timing-safe compare.
  Use when adding auth checks, session helpers, sign-in flows, or secured API routes.
disable-model-invocation: true
---

# TanStack Start auth (Better Auth)

Route protection and session access patterns for TanStack Start + Better Auth.

## When to apply

- Adding `beforeLoad` auth or role checks
- Reading session in server functions or API handlers
- Wiring sign-in / OAuth callback URLs
- Session + API key dual auth on export or automation endpoints

## Primary reference

Read [references/auth.md](references/auth.md) for full patterns.

## Related skills

- `tanstack-start-conventions` — `.server.ts` / `.functions.ts`, why routes call server Fns in `beforeLoad`
- `better-auth-best-practices` — Better Auth config (install: `npx skills add FixMyBerlin/fixmyskills -s better-auth-best-practices -a cursor -y`)

## Non-negotiable rules

1. Session helpers always receive `headers: Headers` from the current request.
2. Route `beforeLoad` does not call the DB/session directly — use server functions with `getRequestHeaders()`.
3. API routes: enforce auth inside each handler (no route-level `beforeLoad`).
4. Compare API secrets with timing-safe equality.

## Quick patterns

```ts
// beforeLoad (via server fn)
const session = await getSessionForRouteFn()
if (!session) throw redirect({ to: '/api/sign-in/...', search: { callbackURL: location.href } })

// API handler
const session = await getAppSession(request.headers)

// Server function
const headers = getRequestHeaders()
await requireAdmin(headers)
```
