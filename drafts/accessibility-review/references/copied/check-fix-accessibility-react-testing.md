<!--
Source: https://github.com/Neha/check-fix-accessibility
File: check-fix-accessibility/reference.md (excerpt)
License: MIT
Copyright (c) 2025
Copied: 2026-07-09 for FMC accessibility-review skill research
-->

# Automated testing in React (excerpt)

Static linting (`eslint-plugin-jsx-a11y`) only catches a subset of issues; add runtime checks against the rendered DOM. Pin versions for reproducibility.

- **Query by accessibility, not by test id**: Testing Library's role/name queries double as a11y assertions — if `getByRole('button', { name: 'Save' })` can't find it, neither can assistive tech. Prefer `getByRole` / `getByLabelText` over `getByTestId`.

```tsx
import { render, screen } from '@testing-library/react'

test('save button has an accessible name', () => {
  render(<Toolbar />)
  expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
})
```

- **Component-level axe (Vitest)**: use `vitest-axe` (same API as `jest-axe`).
- **End-to-end axe**: `@axe-core/playwright` → `new AxeBuilder({ page }).analyze()` and assert `results.violations` is empty.
- **Scope caveat**: axe finds ~30–50% of issues. Keep manual keyboard + screen-reader checks for focus order, live-region timing, and semantics that automation can't judge.

# React focus & routing (excerpt)

- **Focus on mount / step change**: use a `ref` + `useEffect` to move focus (e.g. to a heading or first field). Give the target `tabIndex={-1}` so it's programmatically focusable without joining the tab order.

```tsx
const headingRef = useRef<HTMLHeadingElement>(null)
useEffect(() => {
  headingRef.current?.focus()
}, [routeKey])
return (
  <h1 ref={headingRef} tabIndex={-1}>
    {title}
  </h1>
)
```

- **Route changes**: client navigation doesn't reset focus or update the title like a full page load. On each navigation, update `document.title` and move focus to `<main>`/the page `<h1>` (or announce via a persistent `aria-live="polite"` region). Trigger off pathname changes.
- **Focus trapping (modals/dialogs/menus)**: prefer `react-focus-lock` or `focus-trap-react` over hand-rolling; restore focus to trigger on close; handle Escape.
- **Accessible primitives**: prefer React Aria, Radix UI, or Headless UI over building widgets from `div`s. Avoid re-adding `role`/`tabindex`/`aria-*` they already manage.
