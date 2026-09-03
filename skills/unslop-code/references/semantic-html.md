# Semantic HTML (unslop-code)

Phase 8. Fewer meaningless `div`/`span` wrappers. Not a mechanical replace-all.

Skip when the branch touches no UI TSX (scripts, Rust, docs-only repos, or a branch that only changed server code).

## Prefer native elements when the meaning is clear

- Landmarks: `main` (one per view), `nav`, `header`/`footer`, `aside`, `search`
- Grouping: `section` only with a heading; `article` for a self-contained card/item
- Text: `h1`–`h6`, `p`, lists, `dl`/`dt`/`dd`, `figure`/`figcaption`, `time`
- Controls: `button`, `a[href]`, `label` + control, `fieldset`/`legend`, `dialog`
- Inline meaning: `strong`/`em`/`code`/`kbd` instead of a styled `span`

**Keep `div`/`span`** for layout-only boxes (flex/grid/position), portals, map overlay chrome, and Headless UI / library wrappers that need a generic box.

Prefer a real element over `role=`. This is not an a11y audit: no new ARIA, focus traps, or BITV claims.

## Similar components, similar structure

Before changing one Card/ListRow/PageHeader, find its siblings. One family uses one root and the same heading/slot pattern. Do not leave `article` next to a twin that is still a `div`.

## Page outline is the gate

After a shared component change, read every consuming route/layout. Landmarks and heading rank must still make sense on that page (one `h1`, no skipped levels, no second `main`). If a shared title is used at different depths, either:

- the **page owns the heading** and the component stays headingless, or
- the component takes an explicit heading level / slot

Do not hardcode `h1`/`h2` in a reusable component that is mounted in more than one outline position.

## Scope

Diff vs `<base>` plus the component family and consuming pages needed for consistency. Repo-wide grep is for discovery, not a license to rewrite every `div`. Ambiguous or large restyles go to Secondary.

## Search (give to `explore`)

Start from the branch, not the repo — a repo-wide `<div` grep returns thousands of lines and buries the signal.

```bash
git diff --name-only <base>...HEAD -- '*.tsx' > /tmp/unslop-branch-tsx
xargs rg -n -e '<div' -e '<span' -e 'onClick=' < /tmp/unslop-branch-tsx
```

List the highest-`div`/`span` TSX among those files. Cluster sibling families (widen to the family's other files even when they are off-branch, read-only, so the structures stay consistent). Name consuming pages. Flag `onClick` on non-`button`/`a`.
