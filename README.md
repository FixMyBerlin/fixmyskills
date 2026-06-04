# fixmyskills

Shared [Cursor Agent Skills](https://cursor.com/docs/context/skills) for FixMyBerlin / FMC projects.

Tilda-geo–specific skills (processing, topic-docs, static datasets, etc.) live in the [tilda-geo](https://github.com/FixMyBerlin/tilda-geo) repo under `.cursor/skills/`, not here.

## Skills catalog

| Skill                                                                | Description                                                                        | Command                                                                                                      |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [nuqs](skills/nuqs/)                                                 | URL query state — prefer TanStack `validateSearch`; nuqs for Next.js / shared libs | `npx skills add FixMyBerlin/fixmyskills --skill nuqs -a cursor -y`                                           |
| [playwright-skill](skills/playwright-skill/)                         | TanStack Start E2E (TILDA patterns), smoke tests, stubbed auth, ad-hoc automation  | `npx skills add FixMyBerlin/fixmyskills --skill playwright-skill -a cursor -y`<br>then `bun run setup` in the skill dir |
| [react-dev](skills/react-dev/)                                       | React 19 + TypeScript (Compiler, oxlint); FMC TanStack Start — not routing/server  | `npx skills add FixMyBerlin/fixmyskills --skill react-dev -a cursor -y`                                      |
| [react-useeffect](skills/react-useeffect/)                           | useEffect best practices, naming discipline, and alternatives                      | `npx skills add FixMyBerlin/fixmyskills --skill react-useeffect -a cursor -y`                                |
| [tanstack-start-migration](skills/tanstack-start-migration/)         | Migrate Next.js apps to TanStack Start                                             | `npx skills add FixMyBerlin/fixmyskills --skill tanstack-start-migration -a cursor -y`                       |
| [tanstack-start-conventions](skills/tanstack-start-conventions/)     | TanStack Start/Router: boundaries, Query loaders, SSR, API vs UI validation        | `npx skills add FixMyBerlin/fixmyskills --skill tanstack-start-conventions -a cursor -y`                     |
| [tanstack-start-auth](skills/tanstack-start-auth/)                   | Better Auth config + TanStack Start routes, sessions, cookies (FMC/TILDA)          | `npx skills add FixMyBerlin/fixmyskills --skill tanstack-start-auth -a cursor -y`                            |
| [tanstack-start-app-structure](skills/tanstack-start-app-structure/) | Portable `app/src` folder layout (thin routes, Layout/Page, server domains)        | `npx skills add FixMyBerlin/fixmyskills --skill tanstack-start-app-structure -a cursor -y`                 |
| [zustand-state-management](skills/zustand-state-management/)         | Zustand v5 conventions: `*-store.ts` layout, custom hooks, atomic selectors        | `npx skills add FixMyBerlin/fixmyskills --skill zustand-state-management -a cursor -y`                       |

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

Install the three TanStack Start stack skills (shared across FMC TanStack projects):

```bash
npx skills add FixMyBerlin/fixmyskills \
  --skill tanstack-start-conventions \
  --skill tanstack-start-auth \
  --skill tanstack-start-app-structure \
  -a cursor -y
```

TILDA Geo keeps the full project-specific app-structure doc in `docs/TanStack-Start-App-Structure-And-Conventions.md`; use `tanstack-start-app-structure` for the portable summary.

Local development when this repo is a sibling of your project:

```bash
npx skills add ../skills --skill react-dev -a cursor -y
```

**Note:** The Skills CLI installs Cursor project skills to `.agents/skills/` by default. After install, run `bun run setup` inside `playwright-skill` if you use browser automation.

## License

AGPL-3.0 — see [LICENSE](LICENSE).
