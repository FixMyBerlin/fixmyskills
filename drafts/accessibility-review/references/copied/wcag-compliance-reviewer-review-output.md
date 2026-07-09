<!--
Source: https://github.com/shawn-sandy/skills/tree/main/wcag-compliance-reviewer
File: wcag-compliance-reviewer/SKILL.md (excerpt)
License: Apache License 2.0
Copied: 2026-07-09 for FMC accessibility-review skill research
-->

# POUR-ordered review steps (excerpt)

**A. Perceivable (Priority: High)**

1. Check all images for alt text (1.1.1)
2. Verify color contrast ratios (1.4.3, 1.4.11)
3. Confirm no information conveyed by color alone (1.4.1)
4. Check semantic HTML structure (1.3.1)
5. Verify proper heading hierarchy (1.3.1)
6. Check responsive reflow at 320px (1.4.10)
7. Verify text spacing compatibility (1.4.12)

**B. Operable (Priority: High)**

1. Test keyboard accessibility — all interactive elements keyboard operable (2.1.1)
2. Verify focus indicators visible with 3:1 contrast (2.4.7)
3. Check focus order is logical (2.4.3)
4. Verify no keyboard traps (2.1.2)
5. Check skip links or landmarks (2.4.1)
6. Verify descriptive link text (2.4.4)

**C. Understandable (Priority: Medium)**

1. Check `lang` attribute on html (3.1.1)
2. Verify form labels present and associated (3.3.2)
3. Check error identification and suggestions (3.3.1, 3.3.3)
4. Verify consistent navigation (3.2.3)
5. Check no context changes on focus/input (3.2.1, 3.2.2)

**D. Robust (Priority: Medium)**

1. Verify semantic HTML or proper ARIA (4.1.2)
2. Check ARIA attributes are valid (4.1.2)
3. Verify status messages use live regions (4.1.3)
4. Check all interactive elements have accessible names (4.1.2)

---

# Summary output format (excerpt)

```markdown
# Accessibility Review Summary

## Issues Found: X errors, Y warnings

### Critical Issues (Errors)

[List each error with line number, rule, and fix]

### Warnings

[List each warning with line number, rule, and fix]

### Recommendations

[List best practice improvements]

## Testing Recommendations

[Specific tools and approaches for this codebase]

## Quick Wins

[Easy fixes that provide significant accessibility improvements]
```

---

# Per-issue fix format (excerpt)

```
❌ Issue: Missing alt text (WCAG 1.1.1 - Level A)

Line 23:
<img src="logo.png">

✅ Fix:
<img src="logo.png" alt="Company Name Logo">

Why: Screen readers announce "logo.png" without alt text, which is not meaningful.
```

---

# Form with error handling (React/TS example)

```tsx
<label htmlFor="email">Email:</label>
<input
  type="email"
  id="email"
  aria-invalid={!!error}
  aria-describedby={error ? "email-error" : undefined}
/>
{error && (
  <div id="email-error" role="alert">
    {error}
  </div>
)}
```
