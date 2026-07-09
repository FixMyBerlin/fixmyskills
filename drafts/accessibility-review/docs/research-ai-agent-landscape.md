# Research report: AI-agent accessibility landscape

**Background research — not a workflow checklist.** For FMC's orchestrated review workflow, see [SKILL.md](../SKILL.md).

## Executive summary

The public ecosystem for AI-driven accessibility review follows a convergent architecture: **skills/checklists for reasoning**, **multi-agent orchestration with specialists**, **deterministic engines for detection**, **browser/MCP runtime verification**, and **audit → fix → verify → report** loops. No public repository fully combines German public-sector legal mapping (BITV 2.0, EN 301 549), React SPA + Tailwind token review, TanStack Form patterns, React Map GL non-map alternatives, and procurement-style evidence packs. That integrated stack is FMC's internal opportunity.

## 1. Dominant public patterns

### Skill-as-checklist

Single markdown or skill files encode WCAG criteria, review prompts, and fix heuristics. Agents load the skill and apply it to source files or PRs. Strong for semantics, ARIA, and form wiring; weak alone for runtime focus order and SPA navigation.

### Multi-agent orchestration

Orchestrator delegates to specialists: semantics/ARIA, forms, keyboard/focus, contrast/tokens, maps, runtime browser. Mirrors FMC's `agent-orchestration` model. Reduces context overload and allows per-chunk verification.

### Deterministic engine + AI layer

Tools like **axe-core**, **eslint-plugin-jsx-a11y**, **jest-axe**, **pa11y/pa11y-ci**, and **Lighthouse CI** detect known violations with high precision. AI adds explanation, grouping, fix diffs, prioritization by user impact, and narrative reports. Best practice: never let AI override a failing axe rule without evidence.

### Browser / MCP runtime verification

Playwright and accessibility MCP servers enable keyboard navigation tests, focus order checks, modal behavior, SPA route transitions, auth flows, and form submission error paths. Closes the gap between static review and what users experience.

### Audit → fix → verify → report

Mature workflows run detection, propose or apply fixes, re-run checks, and emit structured reports. FMC extends this with per-chunk `finish-work` commits and German procurement evidence artifacts.

## 2. Gap analysis: what public repos miss

| Capability                                     | Typical public repo | FMC need                    |
| ---------------------------------------------- | ------------------- | --------------------------- |
| WCAG checklist / PR review                     | Common              | Baseline                    |
| axe / lint integration                         | Common              | Required                    |
| Playwright runtime                             | Emerging            | Required for SPA/focus      |
| German BITV / EN 301 549 framing               | Rare                | Required for public clients |
| Verwaltungsvorgang risk model                  | Absent              | Required                    |
| TanStack Form conventions                      | Absent              | Required                    |
| React Map GL non-map alternative               | Absent              | Critical for geo apps       |
| Tailwind token/focus enforcement               | Partial             | Required                    |
| Evidence pack (coverage matrix, residual risk) | Rare                | Required for Tier 3         |

## 3. Repo shortlist

Full evaluations will land in [references/evaluations/](../references/evaluations/). One-line summaries:

### Skill baselines

| Repo                                                                                                                      | What / why                                                                        |
| ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [Neha/check-fix-accessibility](https://github.com/Neha/check-fix-accessibility)                                           | Check-and-fix accessibility skill pattern; good starting fork for review+fix loop |
| [klovaaxel/web-a11y-agent-skills](https://github.com/klovaaxel/web-a11y-agent-skills)                                     | Modular web a11y agent skills; specialist decomposition reference                 |
| [mrKanoh/claude-wcag-accessibility-skill](https://github.com/mrKanoh/claude-wcag-accessibility-skill)                     | WCAG-focused Claude skill; criterion-oriented prompts                             |
| [shawn-sandy/skills — wcag-compliance-reviewer](https://github.com/shawn-sandy/skills/tree/main/wcag-compliance-reviewer) | WCAG compliance reviewer skill in a skills monorepo                               |

### Workflow references

| Repo                                                                            | What / why                                        |
| ------------------------------------------------------------------------------- | ------------------------------------------------- |
| [deventually/a11y-plugin](https://github.com/deventually/a11y-plugin)           | Plugin-style a11y workflow integration            |
| [dar-kow/sdet-wcag-toolkit](https://github.com/dar-kow/sdet-wcag-toolkit)       | SDET-oriented WCAG toolkit; test automation angle |
| [NotMyself/dcyf-accessibility](https://github.com/NotMyself/dcyf-accessibility) | Government/agency accessibility project patterns  |

### Runtime tools

| Repo                                                                                                | What / why                                               |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| [JustasMonkev/mcp-accessibility-scanner](https://github.com/JustasMonkev/mcp-accessibility-scanner) | MCP accessibility scanner; runtime integration reference |
| [njoppi2/playwright-mcp-humanized](https://github.com/njoppi2/playwright-mcp-humanized)             | Humanized Playwright MCP workflows                       |
| [Nazruden/playwright-mcp](https://github.com/Nazruden/playwright-mcp)                               | Playwright MCP server                                    |
| [lxe/playwright-mcp](https://github.com/lxe/playwright-mcp)                                         | Alternative Playwright MCP implementation                |

### Explainer / report inspiration

| Repo                                                                                            | What / why                             |
| ----------------------------------------------------------------------------------------------- | -------------------------------------- |
| [vpodorozh/Web-Accessibility-Guardian](https://github.com/vpodorozh/Web-Accessibility-Guardian) | Guardian-style reporting and narrative |
| [annarose14/accesslens](https://github.com/annarose14/accesslens)                               | Access lens reporting UX               |
| [Upanshi-Mittal/Accesslens](https://github.com/Upanshi-Mittal/Accesslens)                       | Alternate Accesslens implementation    |

## 4. Recommended tool stack layers

```
┌─────────────────────────────────────────────────────────┐
│ 5. Evidence / reporting                                 │
│    issue register, coverage matrix, residual risk,      │
│    executive summary, remediation backlog               │
├─────────────────────────────────────────────────────────┤
│ 4. German compliance mapping                            │
│    BITV 2.0, EN 301 549, contract rules,                │
│    Verwaltungsvorgang criticality model                 │
├─────────────────────────────────────────────────────────┤
│ 3. Runtime browser agent                              │
│    Playwright + accessibility MCP — keyboard, focus,    │
│    modals, SPA routes, auth/forms, map alt paths        │
├─────────────────────────────────────────────────────────┤
│ 2. Deterministic checks                               │
│    eslint-plugin-jsx-a11y, axe-core, jest-axe,          │
│    pa11y/pa11y-ci, Lighthouse CI                        │
├─────────────────────────────────────────────────────────┤
│ 1. Agent skill layer                                  │
│    source review, PR review, fix generation, orchestration│
└─────────────────────────────────────────────────────────┘
```

Layer 1 is what most public repos provide. FMC differentiation is layers 3–5 combined with stack-specific rules (TanStack Form, React Map GL, Tailwind tokens).

## 5. Recommended future skill suite

Brief specialist skills to extract from this orchestrator over time:

| Skill                    | Responsibility                      |
| ------------------------ | ----------------------------------- |
| `a11y-legal-mapper`      | BITV / EN 301 549 relevance tagging |
| `a11y-repo-inventory`    | Route and component discovery       |
| `a11y-react-reviewer`    | Semantics, focus, SPA shell         |
| `a11y-tailwind-reviewer` | Contrast, focus-visible, tokens     |
| `a11y-form-reviewer`     | TanStack Form wiring                |
| `a11y-map-reviewer`      | React Map GL non-map alternatives   |
| `a11y-browser-verifier`  | Playwright/MCP runtime checks       |
| `a11y-remediator`        | Fix application worker              |
| `a11y-report-writer`     | Evidence pack assembly              |

Phase 1 consolidates these into `accessibility-review`; later phases split for reuse in CI and PR review.

## 6. Phased rollout

| Phase | Deliverable                                                                |
| ----- | -------------------------------------------------------------------------- |
| **1** | Fork/adapt a skill baseline + German legal docs + stack rules (this draft) |
| **2** | Playwright/MCP runtime verification + route inventory commands             |
| **3** | Specialist subagents per stack surface                                     |
| **4** | CI integration: lint, axe, Playwright a11y smoke, AI PR review             |
| **5** | Evidence generation for public-sector clients (Tier 3 pack)                |

## 7. Integration with FMC skills today

| Existing skill        | Role in a11y stack                            |
| --------------------- | --------------------------------------------- |
| `agent-orchestration` | Orchestrator/worker/verifier pattern          |
| `finish-work`         | Per-chunk check + commit                      |
| `playwright-skill`    | E2E and runtime verification                  |
| `touch-ipad-review`   | Touch target overlap with AAA-inspired checks |
| `tech-stack`          | agent-browser MCP, stack defaults             |
| `react-dev`           | React 19 focus and effect discipline          |

## Sources

Public repos linked in section 3. Legal framing sources: [research-aa-vs-aaa-report.md](research-aa-vs-aaa-report.md).
