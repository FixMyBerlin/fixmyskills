# Review output format

Workers and verifiers use this schema for findings. One YAML document per route (or per chunk with nested routes).

## Issue register schema

```yaml
route: '/antrag/wohngeld/adresse'
workflow_type: 'administrative form'
risk_level: 'high'
issues:
  - severity: 'high'
    title: 'Field errors not associated programmatically'
    affected_users:
      - 'screen reader users'
      - 'users with cognitive disabilities'
    wcag: ['1.3.1', '3.3.1']
    relevance:
      - 'WCAG 2.2 AA'
      - 'EN 301 549 form requirements'
      - 'public administrative process risk'
    evidence:
      - 'error text rendered visually but not referenced by aria-describedby'
    fix:
      - 'connect error id to input via aria-describedby'
      - 'set aria-invalid=true when validation fails'
      - 'move focus to error summary after submit'
    manual_verification_required: true
```

### Field definitions

| Field                                   | Required | Notes                                                             |
| --------------------------------------- | -------- | ----------------------------------------------------------------- |
| `route`                                 | yes      | Route path or component scope                                     |
| `workflow_type`                         | yes      | e.g. `administrative form`, `auth`, `map`, `upload`, `PDF output` |
| `risk_level`                            | yes      | `critical`, `high`, `medium`, `low` — from workflow criticality   |
| `issues[].severity`                     | yes      | `critical`, `high`, `medium`, `low` — from user impact            |
| `issues[].title`                        | yes      | Short, actionable                                                 |
| `issues[].affected_users`               | yes      | e.g. keyboard users, screen reader users, low vision, cognitive   |
| `issues[].wcag`                         | yes      | Success criterion numbers                                         |
| `issues[].relevance`                    | yes      | WCAG level, EN 301 549, BITV, public administrative process risk  |
| `issues[].evidence`                     | yes      | Code refs, DOM observation, tool output                           |
| `issues[].fix`                          | yes      | Ordered code-level steps                                          |
| `issues[].manual_verification_required` | yes      | `true` when AI/automation cannot confirm                          |

**Severity guidance:** `critical` = blocks task completion, legal/process risk, map-only path, keyboard failure. `high` = serious barrier but workaround may exist.

## Route coverage matrix

Emit as markdown table or YAML list at end of review:

| Route | Risk | Reviewed | Issues (C/H/M/L) | Runtime tested | Notes |
| ----- | ---- | -------- | ---------------- | -------------- | ----- |

## Residual-risk register

List items that remain unverified or out of scope:

- Clarification gaps from [client-clarification.md](client-clarification.md)
- PDF/email outputs not tested
- Screen-reader behavior not validated
- Third-party widgets or map tiles
- Recommended human audit type (BIK/BITV, usability study)

## Review prompt skeleton

Pass to chunk review workers:

```text
You are an accessibility review agent for software used in German
administrative procedures.
Review this route/component against:
1. WCAG 2.2 AA as mandatory baseline
2. selected AAA-style enhancement expectations for critical administrative workflows
3. German public-sector context using BITV 2.0 and EN 301 549 as legal and procurement framing
Rules:
- prefer semantic HTML over ARIA
- do not make legal certification claims
- identify issues, severity, affected users, evidence, and code-level fixes
- prioritize forms, login, uploads, review/submit, PDFs, and maps
- treat map-only workflows as unacceptable
- mark every issue with manual verification required true/false
Output: short summary, issues by severity, quick wins, design-system fixes, manual test checklist
```

## Manual test checklist (per chunk)

After automated review, document tests still required:

- Keyboard-only path through the flow
- Screen reader (VoiceOver/NVDA) on error summary and dynamic updates
- Zoom 200% layout integrity
- Map flow via non-map equivalent path
- PDF/output readability if in scope
- Focus restore after dialog close
- High-contrast / forced-colors if client requires

## Executive summary template

```text
## Summary
- Routes reviewed: N / M inventoried
- Issues: X critical, Y high, Z medium, W low
- Quick wins: ...
- Design-system fixes: ...
- Manual verification still required: ...
- Residual risks: ...
- Legal disclaimer: findings are technical evidence only; not certification.
```
