---
name: accessibility-review
description: >-
  Orchestrates accessibility reviews of React/Tailwind/TanStack Form/React Map GL
  apps used in German administrative procedures (Verwaltungsvorgänge) against
  WCAG 2.2 AA plus selected AAA on critical flows, with BITV 2.0 and EN 301 549
  framing. Use for a11y audits, WCAG/BITV/barrierefreiheit reviews, procurement
  accessibility assessments, or remediation planning on FMC geo/admin apps.
user-invocable: true
---

# Accessibility review (orchestrator)

**You are the orchestrator.** Plan and delegate; do not bulk-review the repo yourself. Follow skill `agent-orchestration` (orchestrator plans; workers implement; readonly verifier validates).

**Compliance floor:** WCAG 2.2 AA everywhere, mapped to EN 301 549 and aligned with BITV 2.0 expectations. **Selected AAA-inspired** enhancements on critical administrative journeys only — not full-site AAA unless the client contract explicitly requires it.

**Never claim legal compliance, BITV certification, or EN 301 549 conformance.** Produce evidence-backed findings, fixes, and residual-risk notes only.

References: [legal-context-germany.md](references/legal-context-germany.md) | [stack-rules.md](references/stack-rules.md) | [review-output-format.md](references/review-output-format.md) | [client-clarification.md](references/client-clarification.md)

Background research (not workflow): [docs/research-aa-vs-aaa-report.md](docs/research-aa-vs-aaa-report.md) | [docs/research-ai-agent-landscape.md](docs/research-ai-agent-landscape.md) | repo evaluations in [references/evaluations/](references/evaluations/README.md)

## Hard rules (encode in every worker prompt)

| Rule                                                                          | Severity      |
| ----------------------------------------------------------------------------- | ------------- |
| Prefer semantic HTML over ARIA                                                | —             |
| Keyboard failures (no operable path, trap, lost focus)                        | **critical**  |
| Form label/error association failures in process steps                        | **critical**  |
| Missing error summary or focus management after validation                    | flag **high** |
| Map-only workflow (no equivalent non-map path)                                | **critical**  |
| Inaccessible PDFs/outputs (no accessible alternative)                         | flag **high** |
| Classify by **user impact** and **workflow criticality**, not only WCAG level |

Every issue must set `manual_verification_required` (usually `true`). AI review is not final conformance proof.

## Before starting

If the client requirement mentions **"AAA"** or procurement conformance, run [client-clarification.md](references/client-clarification.md) first. Record answers in the review plan.

## Orchestrated workflow

```
0. Clarify (if needed)
1. Inventory        → explore subagent
2. Classify risk    → orchestrator
3. Chunk            → orchestrator
4. Per chunk:
     a. Review/fix worker
     b. Readonly code-review verifier
     c. finish-work (bun run check + commit)
5. Runtime verify   → browser / Playwright / axe where possible
6. Evidence pack    → issue register + coverage matrix + residual risks
```

### 1. Inventory the app

Delegate to an **explore** subagent. Scan routes, layouts, shared primitives, and integrations. Record:

- Routes and route families
- Forms (TanStack Form), dialogs, uploads, auth flows
- Maps (React Map GL), PDF/download outputs, emails if in scope
- Shared components: field wrappers, error summaries, modals, route shell

Output: inventory table with route path, workflow type, stack surfaces (form / map / PDF / upload / auth).

### 2. Classify routes by risk

| Workflow type         | Risk          | Examples                                  |
| --------------------- | ------------- | ----------------------------------------- |
| auth / identification | critical      | login, SSO, recovery                      |
| administrative form   | high          | multi-step applications, address          |
| upload                | high          | document upload, evidence attachments     |
| review / submit       | critical      | confirmation, legally relevant submission |
| map / location        | high–critical | pickers, region select, drawing           |
| PDF / output          | high          | notices, confirmations, exports           |
| dashboard / tracking  | medium        | status, notifications                     |

Administrative form, auth, upload, review-submit, map, and output = **high risk** minimum.

### 3. Split into meaningful chunks

Group by route family or feature area (e.g. `auth`, `antrag/wohngeld`, `map-picker`). One chunk = one worker session (~5–15 routes or one complex flow). Prioritize critical/high risk first. Parallelize independent chunks; serialize when shared primitives change.

### 4. Per chunk: review → verify → finish-work

For **each** chunk:

1. **Review/fix worker** — spawn implementer or dedicated a11y worker. Load [stack-rules.md](references/stack-rules.md) and [review-output-format.md](references/review-output-format.md). Apply fixes in scope; emit YAML findings per route.
2. **Readonly verifier** — spawn code-review subagent (`readonly: true`). Skeptic-check: evidence present, fixes correct, map-only paths flagged critical, no certification claims, every issue has `manual_verification_required`.
3. **finish-work** — run skill `finish-work` on that chunk: `bun run check`, fix failures, commit with user-facing message. One commit per completed chunk.

Workers must not skip verifier or finish-work unless the user explicitly asked for review-only.

### 5. Runtime verification

Where possible, verify with browser automation (skill `playwright-skill`, agent-browser MCP, axe-core):

- Keyboard-only path through the flow
- Focus order after navigation, dialog open/close, submit errors
- SPA route title and focus reset
- Map flow via **non-map equivalent** path
- Error summary announcement

When AI or automation cannot confirm behavior (screen reader, PDF readability, contrast in all themes), set `manual_verification_required: true` and add items to the manual test checklist in [review-output-format.md](references/review-output-format.md).

### 6. Evidence pack (final deliverables)

Produce:

1. **Issue register** — YAML per route using schema in [review-output-format.md](references/review-output-format.md)
2. **Route coverage matrix** — every inventoried route: reviewed (yes/no), risk level, issue count by severity, runtime-tested (yes/no/manual)
3. **Residual-risk notes** — what remains unverified, map/PDF risks, client clarification gaps, recommended human audit (BIK/BITV-style, usability tests)

Include executive summary: quick wins, design-system fixes, manual test checklist. **Do not** state legal compliance.

## Tiered delivery model

| Tier  | Scope                                                                                              |
| ----- | -------------------------------------------------------------------------------------------------- |
| **1** | WCAG 2.2 AA everywhere → EN 301 549 / BITV 2.0 alignment                                           |
| **2** | AAA-inspired on critical flows: auth, forms, uploads, review/submit, notices/downloads, help, maps |
| **3** | Documentation: audit trail, issue register, coverage matrix, test evidence, residual-risk register |

## AI usage boundaries

**Good for:** route/component inventory, static JSX/ARIA review, Tailwind contrast/focus review, form wiring inspection, checklist reviews, fix suggestions, Playwright/axe test generation, audit drafts.

**Not for:** final conformance authority, sole proof, screen-reader sign-off, user testing, or legal interpretation.

## Related skills

| Skill                 | Use                                         |
| --------------------- | ------------------------------------------- |
| `agent-orchestration` | Orchestrator/worker/verifier split          |
| `finish-work`         | `bun run check` + commit per chunk          |
| `playwright-skill`    | Runtime a11y scans, E2E keyboard paths      |
| `touch-ipad-review`   | Touch targets; overlaps AAA-inspired checks |
| `tech-stack`          | Stack defaults, agent-browser MCP           |
| `react-dev`           | React 19 patterns, focus discipline         |

## Sources

- [BITV 2.0](https://www.gesetze-im-internet.de/bitv_2_0/BJNR184300011.html)
- [BFIT — gesetzliche Verpflichtungen](https://handreichungen.bfit-bund.de/ag02/1.1/gesetzliche_verpflichtungen_und_geltende_standards.html)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/)
- [BIK BITV test](https://bitvtest.de/)
