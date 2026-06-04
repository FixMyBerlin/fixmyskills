# fixmyskills

Shared [Cursor Agent Skills](https://cursor.com/docs/context/skills) for FixMyBerlin / FMC projects.

Tilda-geo–specific skills (processing, topic-docs, static datasets, etc.) live in the [tilda-geo](https://github.com/FixMyBerlin/tilda-geo) repo under `.cursor/skills/`, not here.

## Skills catalog

| Skill | Description |
|-------|-------------|
| [better-auth-best-practices](skills/better-auth-best-practices/) | Integrating Better Auth — the TypeScript authentication framework |
| [nuqs](skills/nuqs/) | Type-safe URL query state (nuqs) for Next.js and TanStack Router |
| [playwright-skill](skills/playwright-skill/) | Browser automation and E2E testing with Playwright |
| [react-dev](skills/react-dev/) | React + TypeScript patterns (React 18–19, TanStack Router, Server Components) |
| [react-useeffect](skills/react-useeffect/) | useEffect best practices, naming discipline, and alternatives |
| [tanstack-start-migration](skills/tanstack-start-migration/) | Migrate Next.js apps to TanStack Start |
| [zustand-state-management](skills/zustand-state-management/) | Type-safe Zustand state, middleware, slices, and SSR hydration |

## Install

List available skills:

```bash
npx skills add FixMyBerlin/fixmyskills --list
```

Install one skill for Cursor (project scope):

```bash
npx skills add FixMyBerlin/fixmyskills --skill zustand-state-management -a cursor -y
```

Install all skills from this repo:

```bash
npx skills add FixMyBerlin/fixmyskills --all -a cursor -y
```

Local development when this repo is a sibling of your project:

```bash
npx skills add ../skills --skill react-dev -a cursor -y
```

**Note:** The Skills CLI installs Cursor project skills to `.agents/skills/` by default. After install, run `bun run setup` inside `playwright-skill` if you use browser automation.

## License

AGPL-3.0 — see [LICENSE](LICENSE).
