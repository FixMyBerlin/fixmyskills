# Evaluation: Neha/check-fix-accessibility

**Repo:** https://github.com/Neha/check-fix-accessibility  
**License:** MIT  
**Evaluated:** 2026-07-09 (shallow clone of `main`)

## What it is

A single, self-contained Cursor/Claude/Codex skill (`check-fix-accessibility/SKILL.md` + `reference.md`) for auditing and fixing front-end accessibility on web and mobile-web projects. Targets WCAG 2.2 Level A/AA with pinned tool versions, a copy-paste checklist, corner-case guidance, and concise fix patterns for common widgets.

## Structure overview

```
check-fix-accessibility/          # repo root
├── LICENSE (MIT)
├── README.md                     # multi-platform install guide + a11y-mcp pointer
└── check-fix-accessibility/      # installable skill folder
    ├── SKILL.md                  # workflow, checklist, corner cases, fix patterns (~170 lines)
    └── reference.md              # WCAG summary, ARIA, React testing, SR/voice, native mobile
```

No orchestration layer, no subagents, no scripts. Optional external MCP (`a11y-mcp`) documented in README only.

## Pros

- **WCAG 2.2-aware checklist** — explicitly includes 2.4.11, 2.5.7, 2.5.8, 3.2.6, 3.3.7, 3.3.8 and other often-missed 2.2 AA criteria.
- **Pinned tooling** — axe, pa11y, eslint-plugin-jsx-a11y, jest-axe, `@axe-core/playwright` with version numbers and reproducibility guidance.
- **React-specific depth** in `reference.md`: focus-on-route-change, focus-trap libraries, Testing Library role queries, accessible primitives (React Aria, Radix, Headless UI).
- **Corner cases** often missed by automation: voice control labels, SPA route announcements, live-region timing, hidden-but-focusable content.
- **Compact and agent-friendly** — one SKILL.md loads quickly; reference is progressive disclosure.
- **Severity taxonomy** (Critical / Serious / Minor) aligned with impact-first triage.

## Cons

- **No orchestration** — single-agent audit/fix loop; no chunking, verifier, or evidence-pack model.
- **No German public-sector framing** — no BITV, EN 301 549, BFSG, or procurement language; no “do not claim compliance” guardrails.
- **No stack specificity** — generic React/Next/Vue; no TanStack Form, Tailwind focus utilities, or map/PDF workflow rules.
- **No structured output schema** — free-form issue reporting, not YAML issue register or coverage matrix.
- **No runtime verification workflow** — mentions manual SR test but no Playwright keyboard path or axe-in-CI recipe in SKILL.md.
- **Defaults to fix-in-place** — no explicit review-only mode or finish-work/commit discipline.

## Relevance to our German public-sector draft skill

**High overlap on technical floor.** The checklist and `reference.md` content map well to our WCAG 2.2 AA worker rules (forms, keyboard, focus, 2.2 criteria, semantic-first). Gaps are exactly where our draft differentiates: orchestrator/worker/verifier split, route risk classification, map-only critical paths, TanStack Form error summaries, BITV/EN 301 549 framing, `manual_verification_required`, and evidence-pack deliverables.

Best used as a **worker reference** for checklist items and React fix patterns, not as a replacement orchestrator.

## Verdict: **imitate**

Borrow checklist sections, WCAG 2.2 enumeration, corner cases, and React testing/focus guidance into `stack-rules.md` or a worker checklist reference. Do not adopt wholesale — our orchestration, legal boundaries, and output format are more mature for FMC admin apps.

## Content worth copying

| Asset                                                       | Why                                          |
| ----------------------------------------------------------- | -------------------------------------------- |
| WCAG 2.2 new-criteria block in `reference.md`               | Concise agent-readable summary of 2.2 deltas |
| Checklist sections (forms, focus, ARIA, motion)             | Strong copy-paste worker checklist           |
| Corner cases (SPA, voice control, SR)                       | Fills gaps in generic a11y skills            |
| React focus & routing + automated testing in `reference.md` | Actionable patterns for TanStack Start SPAs  |
| Fix patterns (modal, tabs, errors)                          | Short remediation snippets                   |

Copied excerpts: [`../copied/check-fix-accessibility-checklist-corner-cases.md`](../copied/check-fix-accessibility-checklist-corner-cases.md), [`../copied/check-fix-accessibility-react-testing.md`](../copied/check-fix-accessibility-react-testing.md)
