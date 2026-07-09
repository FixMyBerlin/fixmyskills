<!--
Source: https://github.com/klovaaxel/web-a11y-agent-skills
Files: skills/web-a11y-orchestrator/SKILL.md (excerpt)
License: MIT
Copyright (c) 2026 Axel
Copied: 2026-07-09 for FMC accessibility-review skill research
-->

# Orchestrator routing map (excerpt)

- New pages, app shells, semantic structure → authoring, navigation, css skills
- Components, controls, overlays, custom interactions → authoring, css
- Forms, validation, search, multi-step flows → forms skill
- Navigation, landmarks, breadcrumbs, skip links, menus → navigation skill
- Filtering, sorting, pagination, live updates, tables → dynamic-ui skill
- Styling, focus, contrast, motion, zoom, forced colors → css skill
- Audits, triage, CI, DevTools → debugging, review, testing skills

## Severity policy

- **Critical**: blocks core task completion for keyboard or assistive technology users.
- **High**: creates major confusion, lost state, or unreliable operation.
- **Medium**: degrades usability but has a workable path.
- **Low**: polish, consistency, or non-blocking robustness improvement.

## Workflow checklist

```markdown
A11y workflow

- [ ] Define scope and changed user journeys
- [ ] Select relevant skill passes from routing map
- [ ] Implement semantic-first UI
- [ ] Review for accessibility defects and missing tests
- [ ] Remediate Critical/High issues
- [ ] Validate with automation, keyboard, and screen reader smoke checks
```

## Report template (excerpt)

```markdown
Accessibility report

Scope:

- <pages/components/journeys>

Passes run:

- <skills/checks>

Blocking issues:

- <severity> <issue> <status>

Verification:

- Automated: pass/fail/not run
- Keyboard: pass/fail/not run
- Screen reader smoke: pass/fail/not run

Decision:

- Ready | Needs remediation | Needs follow-up
```
