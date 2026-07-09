# Research report: AA vs AAA and German legal context

**Background research — not a workflow checklist.** For operational steps, see [SKILL.md](../SKILL.md) and [references/legal-context-germany.md](../references/legal-context-germany.md).

## Executive summary

Software used in German **Verwaltungsvorgänge** (administrative procedures) must be evaluated through multiple lenses at once: legal obligation, procurement contract, engineering standard, and delivery risk. **WCAG 2.2 AA** is the practical compliance floor. **AAA is not the default legal baseline** for entire applications. FMC's recommended model is AA everywhere plus **selected AAA-inspired enhancements** on critical administrative journeys, backed by formal evidence documentation — without claiming certification.

## 1. Why accessibility is a delivery risk topic

Public-sector and administrative software failures have outsized consequences:

- Users cannot complete legally required processes (applications, registrations, submissions).
- Support volume increases when forms, errors, or maps are unusable with keyboard or assistive technology.
- Procurement and audit cycles expose gaps between marketing claims and testable implementation.
- Remediation late in a project is expensive when routing, forms, and map flows are woven through the app.

Critical administrative flows to prioritize:

- Authentication and identification
- Multi-step forms and data entry
- Document upload and evidence attachments
- Error correction and validation recovery
- Official notices and confirmations
- Payment (where applicable)
- PDF and downloadable outputs
- Map and location selection
- Status tracking and case communication

## 2. The three questions clients conflate

Every engagement should separate:

| Question                 | What it answers                                                                         |
| ------------------------ | --------------------------------------------------------------------------------------- |
| **Legal minimum**        | What BITV 2.0, referenced EN 301 549, and WCAG 2.2 AA require for the artifact type     |
| **Contract requirement** | What the RFP, SOW, or acceptance criteria actually bind — may differ from legal minimum |
| **Risk reduction**       | What to build to minimize complaints, audit findings, and operational friction          |

Clients saying **"AAA"** often mean one of three different things:

1. **Literal procurement requirement** — WCAG 2.2 AAA conformance for the whole product (uncommon; costly; often impractical for maps, media, and complex SPAs).
2. **Informal "very high accessibility"** — AA implemented thoroughly plus stronger UX on critical paths (most common; maps to **selected AAA-inspired** criteria).
3. **Mixed framing** — AA for compliance documentation, aspirational AAA language for product goals without full AAA test coverage.

The W3C does not recommend requiring AAA for entire sites. AAA success criteria are often not achievable for all content types and may conflict with other requirements (e.g. certain map interactions, third-party embeds).

## 3. Relevant frameworks

### BGG (Barrierefreiheitsstärkungsgesetz)

Strengthens accessibility obligations for federal public bodies and digital services. Establishes _that_ accessibility is mandatory but delegates technical criteria to referenced standards. Use BGG to explain organizational obligation; map findings to BITV / EN 301 549 / WCAG — never claim "BGG compliant" as a technical shorthand.

### BITV 2.0

German ordinance anchoring federal accessibility requirements for websites and applications. References EN 301 549. Primary **legal hook** for federal-scope conformance discussions and procurement language in Germany.

- **Strength:** Legally binding for defined public bodies; harmonized with EU ICT standard.
- **Limitation:** Not a developer-friendly checklist; conformance still requires structured testing and documentation.
- **Agent use:** Frame as "aligned with BITV 2.0 expectations via EN 301 549 and WCAG 2.2 AA" — not certified.

### EN 301 549

EU harmonized accessibility standard for ICT procurement. BITV 2.0 references it. Defines functional performance requirements and maps web content requirements to WCAG.

- **Strength:** Procurement-ready traceability; VPAT-style reporting structure.
- **Limitation:** Large document; clause-to-UI mapping needs expertise; does not replace user testing.
- **Agent use:** Tag findings with EN 301 549 relevance where mapping is clear; do not produce a signed VPAT without human authority.

**EN 301 549 is the bridge between law and implementation; WCAG is the engineering language.**

### WCAG 2.2

International technical standard with testable success criteria at levels A, AA, and AAA. Referenced by EN 301 549 and BITV implementation practice.

- **AA** is the de facto legal and procurement baseline for web content.
- Covers: keyboard operability; structure and semantics; labels and instructions; error identification; contrast; focus handling; screen-reader compatibility; predictable interaction; responsive access; robust implementation.

### BIK BITV test

Established German methodology and reporting format for BITV-oriented assessments, used by accredited testers.

- **Strength:** Structured evidence model familiar to German public clients; combines automatic and manual procedures.
- **Limitation:** Official reports require trained testers; not fully automatable.
- **Agent use:** Inspire issue registers and checklists; mark all generated audit items as requiring human verification for official sign-off.

### Land-level rules

German states (Länder) and municipalities may impose additional requirements. Confirm applicability during client clarification — do not assume federal BITV scope covers all clients.

## 4. Recommended three-tier delivery model

### Tier 1 — Baseline (all routes)

**WCAG 2.2 AA** applied everywhere, mapped to **EN 301 549**, aligned with **BITV 2.0** expectations.

This is the non-negotiable engineering floor for FMC administrative apps unless contract explicitly states otherwise.

### Tier 2 — AAA-inspired (critical flows only)

Apply enhanced criteria on defined critical journeys — **not** a claim of full AAA site conformance:

| Enhancement area        | WCAG inspiration      | Application                                                    |
| ----------------------- | --------------------- | -------------------------------------------------------------- |
| Focus visibility        | 2.4.7, 2.4.11, 2.4.13 | Strong, consistent focus indicators across themes              |
| Target size             | 2.5.5                 | Larger touch targets on primary actions                        |
| Plain language          | 3.1.5                 | Instructions, errors, help in clear German                     |
| Error prevention        | 3.3.6                 | Review-before-submit; confirm destructive actions              |
| Multiple ways           | 2.4.5                 | Non-map paths for location tasks; alternatives to drag-only    |
| Non-visual alternatives | 1.1.1, 1.3.3, 1.4.1   | Text/table alternatives to map-only or color-only information  |
| Auth recovery           | 3.3.x cluster         | Forgiving validation; clear recovery in login/password flows   |
| Accessible outputs      | 1.3.1, 1.4.5          | Tagged PDFs or HTML alternatives for notices and confirmations |

### Tier 3 — Documentation and evidence

Formal audit trail for clients and procurement:

- Issue register (YAML schema)
- Route and component coverage matrix
- Automated and manual test evidence
- Residual-risk register (what AI and smoke tests did not prove)
- Executive summary and remediation backlog
- Explicit disclaimer: technical findings only; not legal certification

## 5. What AA covers vs what selected AAA adds

**AA baseline** ensures the majority of users with disabilities can perceive, operate, understand, and robustly interact with the application. It is the correct target for blanket coverage.

**Selected AAA** adds margin on journeys where failure has the highest consequence: incorrect submission, inability to authenticate, lost legal deadline, or map-only exclusion. These enhancements often exceed minimum legal requirements but reduce audit and complaint risk.

## 6. AI agent role and limits

AI agents are effective for:

- Route and component inventory
- Static JSX, ARIA, and semantic HTML review
- Tailwind contrast and focus-style analysis
- TanStack Form label/error wiring inspection
- Checklist-driven reviews against WCAG criteria
- Fix suggestions and diff generation
- Playwright/axe test scaffolding
- Draft audit reports and issue registers

AI agents are **not**:

- A final conformance authority
- Sole proof for procurement acceptance
- A substitute for screen-reader testing with real assistive technology
- A substitute for usability testing with disabled users
- A source of legal interpretation or BITV certification claims

Every AI-generated finding should default to `manual_verification_required: true` unless a deterministic tool (axe, lint) confirmed the issue or fix with high confidence.

## 7. Client clarification (summary)

Full question list: [references/client-clarification.md](../references/client-clarification.md)

Minimum topics: binding standard/version; AAA scope if claimed; journeys in scope; artifacts (frontend, PDFs, emails, mobile, backoffice); expected evidence type (self-assessment, BIK/BITV audit, VPAT-like mapping, usability tests).

## Sources

- [BITV 2.0](https://www.gesetze-im-internet.de/bitv_2_0/BJNR184300011.html)
- [BFIT-Bund — gesetzliche Verpflichtungen und geltende Standards](https://handreichungen.bfit-bund.de/ag02/1.1/gesetzliche_verpflichtungen_und_geltende_standards.html)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/)
- [BIK BITV test](https://bitvtest.de/)
