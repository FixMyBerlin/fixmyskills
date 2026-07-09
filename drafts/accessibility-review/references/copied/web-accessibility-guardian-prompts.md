<!--
Source: https://github.com/vpodorozh/Web-Accessibility-Guardian
File: src/prompts.js
License: MIT
Copied: 2026-07-09 for FMC accessibility-review skill research
Paraphrased summary, not verbatim excerpt
-->

# LLM explanation prompt patterns (summary)

## Per-violation explanation prompt (structure)

System role: accessibility expert and disability advocate.

Chain-of-thought inside `<think>` before JSON:

1. Which disability groups are blocked and why
2. First-person experience for most affected user (assistive tech, what breaks)
3. Legal and practical risk
4. Draft all fields

**Output JSON fields:**

```json
{
  "summary": "1-2 sentence plain-language description",
  "affectedUsers": "groups and AT impacted",
  "userExperience": "2-3 sentences, first person, concrete to this violation",
  "whyItMatters": "practical and legal, reference WCAG criterion",
  "howToFix": "step-by-step plain English",
  "priority": "P0 - Fix immediately | P1 - Fix this sprint | P2 - Fix soon | P3 - Fix when possible"
}
```

Separate **code fix** prompt (non-JSON):

```
BEFORE:
<problematic code>
AFTER:
<corrected code with short inline comment>
```

---

## Scan-level triage prompt (structure)

Input: URL + numbered violation list with impact counts.

Chain-of-thought: functional areas affected → risk (severity × count × legal exposure) → fix order → headline.

**Output JSON:**

```json
{
  "headline": "single most critical finding",
  "areas": [
    { "area": "short name", "issueCount": 0, "topImpact": "critical|serious|moderate|minor", "note": "what breaks" }
  ],
  "priorityOrder": ["area names highest urgency first"],
  "verdict": "2-3 sentences overall risk, no fix instructions"
}
```

---

## Persona narrative prompt (structure)

Role-play disabled user visiting the site; synthesize cross-violation experience (separate MoE model in original — can use single model in our stack).

---

## FMC notes

- Map `priority` P0–P3 to our `critical`/`high`/`medium`/`low` but keep workflow criticality override (auth/submit/map = critical floor).
- Add German public-sector framing in `whyItMatters` when client is Verwaltung — reference EN 301 549 / BITV 2.0 alignment language without claiming certification.
- Use triage JSON for executive summary section only, not issue register source of truth.
