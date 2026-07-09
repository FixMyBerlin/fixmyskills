# Client clarification questions

Ask **before** scoping AAA work, producing compliance documentation, or committing to procurement evidence. Record answers in the review plan.

## Binding standard

- Which standard/version is **contractually binding**?
  - BITV 2.0?
  - EN 301 549 (which version)?
  - WCAG 2.1 or 2.2?
  - BIK BITV test method as the assessment framework?
- If the client says **"AAA"**: is **full-app AAA conformance** required, or **selected criteria on defined critical journeys**?

## Journeys in scope

Which user journeys are in scope for review and remediation?

- Login and account recovery
- Application / administrative form submission
- Document upload and evidence attachments
- Status tracking and notifications
- Official notices and confirmations
- Map / location selection
- Payment (if applicable)

## Artifacts in scope

What deliverables beyond the web frontend are included?

- Embedded or linked PDFs
- Exported documents (Word, CSV, etc.)
- Transactional emails
- Mobile layouts / responsive breakpoints
- Backoffice or admin views
- APIs or services with user-facing error messages

## Evidence expected

What does the client need at the end of the engagement?

- Self-assessment / internal checklist
- External accessibility audit
- BIK/BITV-style audit report
- VPAT-like EN 301 549 mapping
- Usability tests with disabled users
- Issue register only (no formal audit)

## Risk and timeline

- Is there a procurement deadline or audit date?
- Are there known complaints or prior audit findings to prioritize?
- Who signs off on residual risks (client product owner, legal, external tester)?

## Default FMC position when unanswered

Proceed with **Tier 1** (WCAG 2.2 AA everywhere) + **Tier 2** (AAA-inspired on critical flows listed above) + **Tier 3** (issue register, coverage matrix, residual-risk notes). Flag all unanswered clarification items in the residual-risk register.
