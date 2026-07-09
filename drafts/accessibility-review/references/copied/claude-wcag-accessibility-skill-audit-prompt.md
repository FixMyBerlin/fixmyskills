<!--
Source: https://github.com/mrKanoh/claude-wcag-accessibility-skill
Files: prompts/audit-component.md, SKILL.md §2 (excerpt)
License: MIT
Copyright (c) 2025 mrKanoh
Copied: 2026-07-09 for FMC accessibility-review skill research
-->

# Audit component prompt (excerpt)

For each issue found:

1. Identify the WCAG Success Criterion (ID + name + level)
2. Rate severity: Critical / Serious / Moderate / Minor
3. Explain the real-world impact on users with disabilities
4. Provide a corrected code snippet

Minimum checks:

- Accessible name on every interactive element (4.1.2)
- Keyboard operability (2.1.1) and no traps (2.1.2)
- Visible focus indicator (2.4.7 / 2.4.11)
- Correct ARIA roles, states, and properties
- Color not used as sole conveyor (1.4.1)
- Heading hierarchy (1.3.1)
- Alt text on images (1.1.1)
- Form labels and error messages (3.3.1 / 3.3.2)
- Target size ≥ 24×24 CSS px (2.5.8 WCAG 2.2)

---

# WCAG 2.2 additions table (from SKILL.md)

| ID     | Level | Criterion                               | What changed                                                          |
| ------ | ----- | --------------------------------------- | --------------------------------------------------------------------- |
| 2.4.11 | AA    | **Focus Not Obscured (Minimum)**        | Focused element can't be entirely hidden by sticky UI                 |
| 2.4.12 | AAA   | Focus Not Obscured (Enhanced)           | …or _partially_ hidden                                                |
| 2.4.13 | AAA   | Focus Appearance                        | ≥ 2 CSS px perimeter + 3:1 contrast                                   |
| 2.5.7  | AA    | **Dragging Movements**                  | Drag operations need a single-pointer alternative                     |
| 2.5.8  | AA    | **Target Size (Minimum)**               | Pointer targets ≥ 24×24 CSS px (exceptions apply)                     |
| 3.2.6  | A     | **Consistent Help**                     | Help mechanisms in consistent relative order                          |
| 3.3.7  | A     | **Redundant Entry**                     | Don't force re-entry of already-provided info                         |
| 3.3.8  | AA    | **Accessible Authentication (Minimum)** | No cognitive-function tests (allow paste, password manager, WebAuthn) |
| 3.3.9  | AAA   | Accessible Authentication (Enhanced)    | No cognitive-function tests at all                                    |

---

# Germany legal row (from data/legal-framework.csv)

| Jurisdiction | Law                                 | Standard   | Scope                                            | Enforcement                  | Status                   |
| ------------ | ----------------------------------- | ---------- | ------------------------------------------------ | ---------------------------- | ------------------------ |
| Germany      | BITV 2.0 + BFSG (EAA transposition) | EN 301 549 | Public (BITV) + private consumer products (BFSG) | BfIT; Federal Network Agency | Active; BFSG 28 Jun 2025 |

_Note: FMC skill must still avoid conformance/certification claims; use for context only._
