# Stack-specific accessibility review rules

Detailed rules for FMC React/Tailwind/TanStack Form/React Map GL apps. Workers load this during chunk review.

## React

### SPA navigation and focus

- **Route change announcements:** update `document.title`; move focus to `h1` or main landmark on navigation (TanStack Router: route shell primitive or `useEffect` on pathname — prefer router-level pattern).
- **Focus management:** after navigation, error summary display, dialog open, and dialog close — focus must land predictably; restore focus on modal close.
- **Page shell:** one `main` landmark; skip link to main; logical heading hierarchy (`h1` per view).

### Semantics over ARIA

- Prefer native `<button>`, `<a href>`, `<input>`, `<label>`, `<fieldset>`/`<legend>`.
- Flag `div`/`span` with `onClick`, `role="button"` without keyboard support, missing `type` on buttons.

### Common defects to detect

| Pattern                    | Issue                                                                                   |
| -------------------------- | --------------------------------------------------------------------------------------- |
| Fake buttons/links         | `onClick` on non-interactive elements; `href="#"` without action                        |
| Missing headings/landmarks | No `h1`; multiple `main`; content outside landmarks                                     |
| Improper modals            | No focus trap; no Escape close; no `aria-modal`; background still tabbable              |
| Missing focus restore      | Dialog closes but focus lost                                                            |
| ARIA misuse                | `aria-label` duplicating visible text; `role` overriding native semantics unnecessarily |
| Live regions               | Dynamic errors/status without `aria-live` where visual-only update                      |

### Accessible route shell primitives

Recommend a shared layout component that: sets title, resets focus, exposes `main` + `h1`, and provides skip link. Grep for routes missing the shell.

---

## Tailwind

### Failures to flag

- **Contrast:** text/background pairs below WCAG AA (4.5:1 normal, 3:1 large); icon-only controls with insufficient contrast.
- **Focus:** `outline-none` without `focus-visible:` replacement; invisible or 1px focus rings.
- **Touch targets:** icon buttons below 44×44 CSS px (AAA-inspired target; align with `touch-ipad-review` skill).
- **Interactive states:** missing `disabled:` styles; hover-only affordances without `focus-visible` equivalent.

### Design tokens to build/enforce

```text
a11y color pairs (text/bg, error/success)
focus ring utilities (ring-2 ring-offset-2 focus-visible:ring-*)
min touch target utilities (min-h-11 min-w-11)
motion-reduced variants (motion-reduce:transition-none)
error/success semantic tokens (not color-only)
```

### Enforcement

- Ban bare `outline-none` — require paired `focus-visible:outline-*` or `focus-visible:ring-*`.
- Grep: `outline-none`, `sr-only` misuse (hiding visible content), `text-gray-400` on white (contrast risk).

---

## TanStack Form

### Required wiring per field

- `<label htmlFor>` associated with control id.
- Hints and errors linked via `aria-describedby` (hint id + error id).
- `aria-invalid={!!error}` when validation fails.
- `autocomplete` attributes on personal/address fields.
- Required vs optional communicated (`required` attribute + visible text; not placeholder-only).

### Form-level patterns

- **Error summary** at top on submit failure: `role="alert"` or `aria-live="assertive"`; lists all errors with links to fields.
- **First-error focus:** move focus to summary or first invalid field after submit.
- **Server-side validation:** server errors merged into field state with same aria wiring.
- **Save/continue and review-before-submit:** multi-step flows preserve error state; review step shows all sections accessibly.

### Recommended abstractions

| Component     | Responsibility                                               |
| ------------- | ------------------------------------------------------------ |
| Field wrapper | label + hint + error + aria wiring + `aria-invalid`          |
| Error summary | top-of-form alert, anchor links, focus on mount              |
| Submit state  | `aria-busy`, disabled submit during pending, retry messaging |

Flag ad-hoc form markup duplicating these patterns inconsistently.

---

## React Map GL

**Treat the map as optional enhancement.** Required pattern:

> Every map workflow has an equivalent **non-map path** to complete the same task.

### Non-map equivalent must include

- Address/postcode search (text input, autocomplete with keyboard)
- Accessible list or table of results
- Selectable items **outside** the map canvas
- Textual location details (street, district, coordinates as text)
- Keyboard-operable selection (arrow keys, Enter, Tab)

### Flag as critical

- Map-only location pick (no search/list fallback)
- Drag-only polygon drawing without coordinate/table alternative
- Click-on-map as sole submission path
- Map controls without labels or keyboard access

### Acceptable map role

- Visual confirmation alongside already-selected address
- Supplementary preview when list/search path exists and is primary

---

## AI review boundaries

**Good for:** static JSX/ARIA review, Tailwind contrast/focus grep, TanStack Form wiring inspection, checklist passes, fix suggestions.

**Not sufficient alone for:** screen-reader sign-off, PDF accessibility proof, legal interpretation, final conformance claims.

Findings format: [review-output-format.md](review-output-format.md)
