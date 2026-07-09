<!--
Source: https://github.com/Neha/check-fix-accessibility
File: check-fix-accessibility/reference.md (excerpt)
License: MIT
Copyright (c) 2025
Copied: 2026-07-09 for FMC accessibility-review skill research
-->

# WCAG 2.2 new success criteria (excerpt)

Don't overlook these when you claim 2.2 conformance — they're the most common gap in checklists carried over from 2.1.

- **2.4.11 Focus Not Obscured (Minimum)** — _AA_: A focused element is not entirely hidden by author-created overlays (sticky headers/footers, cookie banners). Use `scroll-margin`/offsets so it stays visible.
- **2.4.12 Focus Not Obscured (Enhanced)** — _AAA_: No part of the focused element is hidden.
- **2.4.13 Focus Appearance** — _AAA_: Focus indicator has a minimum area and contrast.
- **2.5.7 Dragging Movements** — _AA_: Any dragging action has a single-pointer (non-drag) alternative, unless dragging is essential.
- **2.5.8 Target Size (Minimum)** — _AA_: Pointer targets ≥ 24×24 CSS px or adequately spaced (see target-size notes).
- **3.2.6 Consistent Help** — _AA_: Help mechanisms appear in a consistent relative order across pages.
- **3.3.7 Redundant Entry** — _AA_: Don't require re-entering info already provided in the same process (auto-populate or offer selection).
- **3.3.8 Accessible Authentication (Minimum)** — _AA_: No cognitive-function test (memorization, puzzles, transcription) required to authenticate; allow paste/password managers or provide an alternative.
- **3.3.9 Accessible Authentication (Enhanced)** — _AAA_: As 3.3.8 but without the object-recognition/personal-content exceptions.

## Target size (touch/pointer)

- **WCAG 2.2 AA — 2.5.8 Target Size (Minimum)**: pointer targets are at least **24×24 CSS px**, or have sufficient spacing so a 24 px circle centered on the target doesn't overlap neighbors.
- **WCAG 2.2 AAA — 2.5.5 Target Size (Enhanced)**: at least **44×44 CSS px**.
- **Platform best practice**: Apple HIG recommends **44×44 pt**; Android Material recommends **48×48 dp**.

So: **24×24 is the AA bar; 44×44 is best practice / AAA**, not the AA requirement.

---

# Corner cases (from SKILL.md checklist, excerpt)

### Voice control / Voice View

- **Distinct, speakable labels**: Users of voice input say element names. Avoid many elements with the same label (e.g. multiple "Submit"). Use unique, short labels (e.g. "Submit registration", "Cancel").
- **Numbering**: If labels can't be unique, voice software may fall back to "first button", "second link". Prefer unique labels over relying on order.

### Single-page apps (SPA) and dynamic content

- **Route / view changes**: On navigation, update `<title>` and move focus to main content or announce the change (`aria-live="polite"` region or focus to `<main>`/heading).
- **Loading states**: Use `aria-busy="true"` on the loading container and set to `false` when done.
- **Hidden but focusable**: Content that is hidden (`display: none`, `hidden`, inactive tab panel) must not contain focusable elements, or those elements must be removed from the accessibility tree (`aria-hidden="true"` on container, or `inert` where supported).

### Forms (WCAG 2.2 highlights)

- **Input purpose** (1.3.5 AA): Set `autocomplete` on fields collecting user info.
- **Accessible authentication** (3.3.8 AA): Allow paste and password managers; offer alternatives (OTP, passkeys).
- **Redundant entry** (3.3.7 AA): Within a single process, don't ask users to re-enter info they already provided.

### Fix patterns (concise)

- **Modal**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` (title), focus move to dialog on open, trap focus, Escape closes, focus return on close.
- **Error message**: `aria-describedby="id-of-error"` on control, `aria-invalid="true"` when invalid; ensure error element has `id` and is in DOM when invalid.
