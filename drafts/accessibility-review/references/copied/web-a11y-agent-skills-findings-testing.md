<!--
Source: https://github.com/klovaaxel/web-a11y-agent-skills
Files: skills/web-a11y-review/FINDINGS.md, skills/web-a11y-testing/CHECKS.md, skills/web-a11y-forms/EXAMPLES.md (excerpts)
License: MIT
Copyright (c) 2026 Axel
Copied: 2026-07-09 for FMC accessibility-review skill research
-->

# Strong finding format (from web-a11y-review)

```markdown
High - account settings dialog
Impact: keyboard users cannot close the dialog because the close control is not focusable.
Fix: replace the clickable div with a button and ensure Escape closes the dialog.
Regression check: keyboard-only flow - open dialog, tab to close button, activate with Enter/Space, verify focus returns to trigger.
```

**Weak finding (avoid):** "Medium - dialog / Impact: not very accessible / Fix: improve accessibility."

Strong findings are specific, actionable, and testable.

## Review rules

- Prioritize behavioral blockers over stylistic preferences.
- Treat click-only behavior, focus traps, missing labels, and unsynchronized ARIA state as high risk.
- If no issues are found, state that clearly and list residual testing gaps.

---

# Testing smoke checks (from web-a11y-testing)

## Keyboard smoke

1. Reach every interactive control with Tab/Shift+Tab.
2. Activate controls with Enter/Space where expected.
3. Confirm visible focus is always present.

## Screen reader smoke

1. Verify page title and heading map.
2. Check role, name, and state for critical controls.
3. Trigger dynamic updates and confirm meaningful announcements.

## Preference modes

1. Zoom/reflow at 200 percent for key flows.
2. Reduced motion mode for animated interactions.
3. Forced colors/high contrast for form controls and focus rings.

## Test order

1. Automated scan for changed surfaces.
2. Keyboard-only journey.
3. Screen reader smoke pass.
4. Zoom, reflow, reduced motion, and forced-colors checks where relevant.

---

# Forms error recovery (from web-a11y-forms)

- Keep the user input after validation fails.
- Move focus to the first error summary item or invalid field.
- Provide clear next steps to fix each error.

## Validation feedback pattern

```html
<label for="zip">ZIP code</label>
<input id="zip" name="zip" aria-invalid="true" aria-describedby="zip-error" />
<p id="zip-error">Enter a 5-digit ZIP code.</p>
```

Placeholder-only labels and unlinked red error text are anti-patterns.
