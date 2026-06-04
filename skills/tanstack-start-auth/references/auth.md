# Auth in TanStack Start (Better Auth)

Short reference for Better Auth setup and route protection in TanStack Start.

---

## 1. Better Auth setup

- **Server:** `src/lib/auth.server.ts` (or `src/server/auth/`) — `betterAuth()` with your adapter and plugins.
- **Client:** `src/lib/auth-client.ts` — `createAuthClient()` with plugins matching server (e.g. OAuth, `customSessionClient`).
- **Session helpers (server):** `src/server/auth/session.server.ts` — `getSession`, `getAppSession`, `requireAuth`, `requireAdmin`. All take `headers: Headers`; pass `getRequestHeaders()` or `request.headers`.

**Why not `tanstackStartCookies`:** Better Auth’s TanStack Start cookie helper can pull `@tanstack/react-start/server` into the client bundle. Many projects set cookies manually in the auth API route handler instead.

**Auth API:** Mount Better Auth under `/api/auth/*`. Forward the request to `auth.handler()` and copy `Set-Cookie` from the auth response into your response.

**Sign-in entry:** e.g. `/api/sign-in/<provider>` with `callbackURL` search param; redirect users there with `redirect({ to: '...', search: { callbackURL } })`.

---

## 2. Approach in TanStack Start — where we put checks

- **Route-level gates:** Use **`beforeLoad`** on route definitions, not global middleware. Keeps auth logic next to the route tree.
- **Server-side only:** Session via `auth.api.getSession({ headers })`. Never rely on client-only session for access control.
- **Two patterns:**
  - **Redirect when unauthorized:** `beforeLoad` calls a server function; if not allowed, `throw redirect({ to: signInUrl })`.
  - **Allow but flag:** `beforeLoad` returns e.g. `isAuthorized`; loader/component branch UI.

---

## 3. Design: beforeLoad, no middleware

- **Why beforeLoad:** Same server context as loaders; access to `params`, request. Protected routes declare checks in route files.
- **Why not middleware:** Route-tree knowledge stays visible per route.
- **Important:** Session helpers need `headers: Headers`. In `beforeLoad`, call **server functions** that use `getRequestHeaders()` and pass them to session helpers. For server/client file layout, see `tanstack-start-conventions` → client-server-boundaries.

---

## 4. Typical route protection patterns

| Area              | Protection        | Pattern                                                                                                                      |
| ----------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Public home**   | Optional redirect | `beforeLoad` reads post–sign-in redirect cookie; no auth required                                                            |
| **Admin layout**  | Admin only        | Parent `beforeLoad` calls `getIsAdminFn()`; redirect to sign-in with `callbackURL`                                           |
| **Resource page** | Public + member   | `beforeLoad`: URL normalization + authorization server fn → `isAuthorized` in context; page shows content or “access denied” |
| **API routes**    | Per-handler       | No `beforeLoad`; each handler calls `getAppSession(request.headers)` or API key check                                        |

---

## 5. API keys and timing-safe check

Some endpoints allow **either** session **or** a shared API key (scripts, automation).

- **Check:** Compare with `crypto.timingSafeEqual` (or equivalent) so comparison time does not leak the key.
- **Flow:** Valid API key → allow. Else fall back to session/role rules.

---

## 6. Gaps to watch

1. **Headers everywhere:** Server functions and API handlers must pass current request headers into session helpers.
2. **No machine auth beyond your design:** Document any per-client tokens you add; keep secret comparison timing-safe.
3. **Redirect cookies:** If you use a post–sign-in redirect cookie, keep cookie names in sync with auth config.

---

## 7. Quick “what to do” reference

- **New admin-only page under `/admin`:** Rely on parent admin layout `beforeLoad` if present.
- **New nested route under a protected layout:** Inherit parent `beforeLoad`; use `context` / loader data.
- **New API route (session):** `getAppSession(request.headers)` or `requireAuth` / `requireAdmin` in the handler.
- **New API route (scripts):** Validate API key with timing-safe compare; skip session if valid.
- **New server function (current user):** Pass `getRequestHeaders()` into session helpers; pass `headers` into any `.server.ts` module that needs session.

For Better Auth configuration details, use skill `better-auth-best-practices` and [better-auth.com/docs](https://better-auth.com/docs).
