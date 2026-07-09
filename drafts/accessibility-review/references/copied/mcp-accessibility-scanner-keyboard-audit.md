<!--
Source: https://github.com/JustasMonkev/mcp-accessibility-scanner
File: src/tools/auditKeyboard.ts
License: MIT
Copied: 2026-07-09 for FMC accessibility-review skill research
Paraphrased summary, not verbatim excerpt
-->

# audit_keyboard heuristics (summary)

## Tool purpose

Programmatic keyboard audit: press Tab / Shift+Tab, record focus stops, flag practical accessibility issues axe does not cover.

---

## Default options (configurable)

| Option                 | Default        | Purpose                                             |
| ---------------------- | -------------- | --------------------------------------------------- |
| `maxTabs`              | 30+            | Stop after N tab presses                            |
| `includeShiftTab`      | optional       | Reverse tab order check                             |
| `stopOnCycle`          | true           | Detect focus cycle completion                       |
| `checkSkipLink`        | true           | First focusables should include skip link           |
| `skipLinkMaxTabs`      | first few tabs | How early skip link must appear                     |
| `activateSkipLink`     | optional       | Enter on skip link; verify hash/focus/scroll change |
| `checkFocusTrap`       | true           | Repeated fingerprint cycle → trap                   |
| `checkFocusVisibility` | true           | `hasVisibleIndicator` per stop                      |
| `checkFocusJumps`      | true           | Large scroll delta between stops                    |
| `screenshotOnIssue`    | optional       | Capture evidence per issue                          |

---

## Per focus stop, record

- Role, accessible name, tag, id, href, text snippet
- Bounding box, inViewport
- `hasVisibleIndicator`
- Scroll position and scroll delta from prior stop
- Fingerprint (for cycle/trap detection)
- `issues[]` strings accumulated for this stop

---

## Result aggregate fields

- `stops[]` — full tab sequence
- `uniqueFingerprints` — count of distinct focus targets
- `skipLink` — found step, activation outcome (hash/focus/scroll/navigation)
- `focusVisibilityIssues[]`
- `focusJumpIssues[]`
- `focusTrap` — detected, step, cycle fingerprint
- JSON report path (always written)

---

## FMC mapping

Run on critical flows after chunk fixes:

1. Auth login and recovery
2. Multi-step administrative form (submit errors → focus to summary)
3. Dialog open/close (map picker, upload modal)
4. Map flow keyboard path (if non-map equivalent exists, verify both)

Always set `manual_verification_required: true` — heuristics are not screen-reader sign-off.
