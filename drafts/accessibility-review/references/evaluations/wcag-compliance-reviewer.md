# Evaluation: shawn-sandy/skills (wcag-compliance-reviewer)

**Repo:** https://github.com/shawn-sandy/skills/tree/main/wcag-compliance-reviewer  
**License:** Apache License 2.0 (repo uses Apache 2.0 in `skill-packager/LICENSE.txt`; wcag-compliance-reviewer README references LICENSE.txt but folder has no dedicated license file — treat as Apache 2.0 per parent repo pattern)  
**Evaluated:** 2026-07-09 (shallow clone of `main`)

## What it is

A Claude Code skill for **code-review-style WCAG 2.1 AA audits** of HTML/CSS and React/TypeScript. Provides an 8-step review process, POUR-ordered checklist, severity tiers (Errors/Warnings/Recommendations), summary output template, bundled reference docs, and a lightweight Python static checker (`check_wcag.py`).

## Structure overview

```
shawn-sandy/skills/wcag-compliance-reviewer/
├── SKILL.md                       # review process + checklist + inline examples (~310 lines)
├── README.md                      # install via gitpick, process docs
├── references/
│   ├── wcag-aa-guidelines.md      # static WCAG 2.1 AA criteria
│   ├── common-violations.md       # before/after examples (~1k lines)
│   └── testing-guide.md
└── scripts/check_wcag.py          # regex-based static scan
```

Part of a larger skills monorepo (design tokens, Vercel patterns, etc.). No orchestrator or subagents.

## Pros

- **Clear review workflow** — version source decision (static vs W3C fetch), POUR-ordered review, explicit output format.
- **Actionable fix format** — quote code → cite SC → show fix → explain AT impact (good model for PR reviews).
- **Large `common-violations.md`** — extensive before/after for HTML/CSS/React/TS.
- **Optional W3C fetch path** — agent can pull WCAG 2.2 quickref when user asks for latest.
- **Testing guide** references eslint-jsx-a11y, jest-axe, pa11y-ci, manual SR checklist.
- **Apache 2.0** — permissive for excerpting patterns.

## Cons

- **WCAG 2.1 AA default** — static `wcag-aa-guidelines.md` misses 2.2 AA criteria (2.4.11, 2.5.7, 2.5.8, 3.3.8, etc.) unless user triggers web fetch.
- **No orchestration** — single-pass code review; no inventory, chunking, verifier, or finish-work.
- **No German public-sector context** — no BITV, EN 301 549, procurement, or non-certification disclaimers.
- **No stack specificity** — generic React/TS; no TanStack Form, Tailwind, maps, PDFs.
- **`check_wcag.py` is shallow** — regex heuristics (~30% coverage per skill’s own note); not a substitute for axe/Playwright.
- **README install path points to `shawn-sandy/acss` repo** — possible doc drift from `shawn-sandy/skills` location.
- **Severity model** is lint-like (Errors/Warnings/Recommendations), not workflow-criticality based.

## Relevance to our German public-sector draft skill

**Good PR-review worker template**, weaker as full audit orchestrator. The 8-step process and summary output format align with our per-chunk reviewer worker. `common-violations.md` overlaps heavily with Neha’s skill and our `stack-rules.md` — useful for fix examples but redundant if we already imitate check-fix-accessibility.

Upgrade path for us: merge POUR-ordered review steps and summary sections into `review-output-format.md`; ensure WCAG 2.2 is mandatory, not optional fetch.

## Verdict: **skip** (as primary baseline)

Content overlaps with Neha + our draft; 2.1-default and lack of orchestration/German framing make it a lower-priority source. **Imitate** only the review output structure and POUR ordering if we want a second opinion on PR-review phrasing.

## Content worth copying

| Asset                                | Why                                                           |
| ------------------------------------ | ------------------------------------------------------------- |
| §8 Summary output format in SKILL.md | Markdown sections map to our issue register executive summary |
| POUR-ordered review steps (§4)       | Useful worker sequencing                                      |
| Form error handling inline example   | Short TanStack-adjacent pattern                               |

Copied excerpts: [`../copied/wcag-compliance-reviewer-review-output.md`](../copied/wcag-compliance-reviewer-review-output.md)

**Not copied:** `common-violations.md` in full — largely redundant with check-fix-accessibility + our stack-rules; too large to duplicate.
