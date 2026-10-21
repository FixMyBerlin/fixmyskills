# TanStack Router — TypeScript

Docs: [TanStack Router](https://tanstack.com/router/latest/docs/framework/react/overview) · [llms.txt](https://tanstack.com/llms.txt)

## Typed hooks outside the route file

Shared hooks use `from` with the route id (FMC convention), not `strict: false` casts:

```typescript
import { useParams, useSearch } from '@tanstack/react-router'
import { Route as userRoute } from '@/routes/users/$userId'

const { userId } = useParams({ from: userRoute.id })
const { tab } = useSearch({ from: userRoute.id })
```

Inside the route file use `Route.useParams()` / `Route.useSearch()`. Catch-all splat routes (`routes/posts/$.tsx`) expose the remainder as `_splat`.

## Typed `Link`

Never string-interpolate path segments into `to`: use `to="/posts/$slug" params={{ slug }}`.

## Router type registration

Register the router for global link/search inference (app `router.tsx`):

```typescript
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
```

Search schemas: [params-search-ui-routes.md](params-search-ui-routes.md). Serialization: [router-search-serialization.md](router-search-serialization.md). Loaders and Query: [router-and-query.md](router-and-query.md).
