# Legal context — Germany

Actionable framing for reviews of software used in **Verwaltungsvorgänge** (German administrative procedures). Use to tag findings and structure evidence — not as legal advice or certification guidance.

## Why this matters

Accessibility for public-sector software is simultaneously a **legal**, **procurement**, **quality**, and **delivery-risk** topic. Critical flows include: authentication, identification, forms, uploads, error correction, notices, confirmations, payment, PDF outputs, map/location selection, and evidence attachments.

## Three distinct questions

Separate these before scoping work:

1. **Legal minimum** — What BITV 2.0 / EN 301 549 / WCAG 2.2 AA requires for the artifact in scope.
2. **Contract/procurement requirement** — What the client RFP or SOW actually binds (may exceed or narrow the legal floor).
3. **Risk reduction** — What to build to reduce complaints, audit findings, and support burden.

## Framework roles

| Standard             | Role in reviews                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **BGG**              | Establishes federal accessibility obligations; cite as _why_, map findings to referenced technical standards. Never claim "BGG compliant." |
| **BITV 2.0**         | Legal anchor for federal scope; references EN 301 549. Use as legal framework, not a developer checklist.                                  |
| **EN 301 549**       | Procurement/audit traceability bridge between law and implementation. Tag findings where chapter mapping is obvious.                       |
| **WCAG 2.2**         | Main engineering language and build target. Cite success criterion numbers (e.g. `1.3.1`, `2.4.7`).                                        |
| **BIK BITV test**    | German audit methodology and evidence model. Use structure for issue registers and checklists — not as a substitute for accredited audit.  |
| **Land-level rules** | May apply for state/municipal clients; confirm in client clarification.                                                                    |

**EN 301 549 is the bridge between law and code; WCAG is the engineering language.**

## AA vs AAA position

- **WCAG 2.2 AA is the compliance floor** for all reviewed content.
- **AAA is usually NOT the blanket legal default.** W3C explicitly does not recommend requiring AAA for entire sites.
- When a client says **"AAA"**, they may mean:
  1. Changed procurement requirement (full AAA everywhere — rare, expensive).
  2. Informal "very high accessibility" (AA done well + extras on critical flows — most common).
  3. Mixing legal minimums (AA for documentation) with aspirational goals (AAA-inspired on key journeys).

### Recommended tiered model

| Tier       | Scope                                                               | Purpose                                                                                                              |
| ---------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Tier 1** | WCAG 2.2 AA everywhere, mapped to EN 301 549, aligned with BITV 2.0 | Legal/procurement baseline                                                                                           |
| **Tier 2** | AAA-inspired enhancements on critical flows                         | Forms, auth, identification, uploads, review/submit, notices/downloads, help, map tasks                              |
| **Tier 3** | Formal documentation                                                | Audit trail, issue register, route/component coverage, test evidence, manual-review evidence, residual-risk register |

### What AA covers (baseline)

Keyboard operability; structure/semantics; labels/instructions; error identification; contrast; focus handling; screen-reader compatibility; predictable interaction; responsive access; robust implementation.

### Selected AAA priorities (critical flows only)

Apply as enhancements — not a claim of full AAA conformance:

- Strong focus visibility (2.4.7 / 2.4.11 / 2.4.13)
- Larger touch targets (2.5.5-inspired)
- Reduced cognitive load; plain language for instructions/errors (3.1.5-inspired)
- Error prevention before final submission (3.3.6-inspired)
- Multiple ways to complete a task (2.4.5-inspired)
- No drag-only or map-only interaction
- Readable help content
- Alternatives for visual-only information (1.1.1, 1.3.3, 1.4.1)
- Recovery paths in login/password flows
- Forgiving validation/correction UX (3.3.1, 3.3.3)
- Accessible downloadable outputs

## Standards evaluation summary

| Standard      | Use in agent reviews                                                                       |
| ------------- | ------------------------------------------------------------------------------------------ |
| BITV 2.0      | Legal anchor; frame as "aligned with BITV expectations via EN 301 549 / WCAG 2.2 AA"       |
| EN 301 549    | Procurement traceability; tag `relevance` field on findings                                |
| WCAG 2.2      | Primary build target + selected AAA on critical flows                                      |
| BIK BITV test | Evidence model inspiration; mark items `manual_verification_required` until human sign-off |

## AI-agent rules

- Map each finding to WCAG success criteria.
- Note EN 301 549 / BITV relevance in the issue `relevance` field.
- Never state legal compliance, BITV certification, or full EN 301 549 conformance.
- Generate draft checklists compatible with BIK categories; all require human verification for official reports.

Client clarification questions: [client-clarification.md](client-clarification.md)

## Sources

- [BITV 2.0](https://www.gesetze-im-internet.de/bitv_2_0/BJNR184300011.html)
- [BFIT-Bund — gesetzliche Verpflichtungen und geltende Standards](https://handreichungen.bfit-bund.de/ag02/1.1/gesetzliche_verpflichtungen_und_geltende_standards.html)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/)
- [BIK BITV test](https://bitvtest.de/)
- [BGG](https://www.gesetze-im-internet.de/bgg/)
- [EN 301 549 (PDF, ETSI)](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf)
