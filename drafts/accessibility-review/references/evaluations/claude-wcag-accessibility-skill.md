# Evaluation: mrKanoh/claude-wcag-accessibility-skill

**Repo:** https://github.com/mrKanoh/claude-wcag-accessibility-skill  
**License:** MIT  
**Evaluated:** 2026-07-09 (shallow clone of `main`)

## What it is

A large, consultant-grade WCAG accessibility skill (~1,700 lines in `SKILL.md`) backed by **CSV databases**, a **Python search CLI**, **audit/CI templates**, **HTML component examples**, and **ready-made prompts**. Covers WCAG 2.1/2.2 AA, ARIA, keyboard, screen readers, mobile, cognitive accessibility, legal frameworks (25+ jurisdictions), KPIs, and VPAT/ACR reporting.

## Structure overview

```
claude-wcag-accessibility-skill/
├── LICENSE (MIT)
├── SKILL.md                       # monolithic knowledge base
├── RESOURCES.md
├── data/                          # 12+ CSV databases (wcag, aria, legal, tools, …)
├── scripts/search.py, mcp-server.py
├── prompts/                       # 12 copy-paste audit/remediation prompts
├── templates/                     # audit-report.md, a11y-ci.yml, VPAT, pa11y/lighthouse config
├── examples/components/           # accessible HTML reference implementations
├── tests/                         # pytest for search.py
└── .claude/skills/skill-creator/  # meta skill for evals (bundled)
```

Designed as a single skill that loads progressively via `search.py` CLI rather than multiple worker skills.

## Pros

- **Deepest WCAG reference** — full criteria CSV including WCAG 2.2 additions; searchable by level, keyword, ID.
- **Legal framework data** includes Germany (BITV 2.0 + BFSG, EN 301 549) and EU WAD/EAA — useful cross-check for our `legal-context-germany.md`.
- **Rich prompts** — `audit-component.md`, `sc-to-acceptance-criteria.md`, `generate-vpat-entry.md`, etc.
- **CI/CD templates** — GitHub Actions with axe + pa11y + Playwright + Lighthouse.
- **Component examples** — combobox, data grid, date picker, carousel, tree view as reference HTML.
- **Handoff checklist CSV** — design → dev → QA → release phases.
- **Tested tooling** — pytest CI on `search.py`; structured evals in `evals/`.
- **Multilingual note** — Spanish glossary CSV (not needed for us, but shows i18n awareness).

## Cons

- **Monolithic SKILL.md is huge** — risks context bloat if loaded whole; opposite of our chunked worker model.
- **Defaults to WCAG 2.1 AA** in overview despite 2.2 coverage — agents may under-apply 2.2 unless they hit CSV/search.
- **Claims compliance authority** — VPAT templates, “compliance questions”, legal risk framing without our “never claim conformance” guardrails.
- **No React/Tailwind/TanStack stack rules** — framework mentions are generic; examples are mostly plain HTML.
- **No map/geo, PDF output, or admin workflow risk tiers.**
- **No orchestrator/worker/verifier split** — single expert skill, not FMC `agent-orchestration` pattern.
- **Python dependency** for search/MCP — extra setup vs pure Markdown skills.
- **US-centric tone** in places (ADA, Section 508) though EU/DE rows exist in legal CSV.

## Relevance to our German public-sector draft skill

**Best as a reference library, not as our primary skill.** The Germany row in `legal-framework.csv` and WCAG 2.2 criteria data validate our legal framing. Prompts and audit templates can inform worker instructions and evidence-pack structure. The monolithic design and compliance-reporting emphasis conflict with our orchestrated, non-certification review model.

Use for: WCAG criterion lookup wording, audit prompt structure, CI template ideas, handoff checklist rows. Avoid: loading full SKILL.md in workers, VPAT/conformance claims without our residual-risk wrapper.

## Verdict: **imitate**

Mine prompts, WCAG 2.2 summary tables, and legal CSV rows into our references. Do not adopt the monolithic skill or VPAT workflow as-is.

## Content worth copying

| Asset                                        | Why                                                            |
| -------------------------------------------- | -------------------------------------------------------------- |
| `prompts/audit-component.md`                 | Structured per-issue output (SC, severity, impact, fix)        |
| WCAG 2.2 additions table in SKILL.md §2      | Compact 2.2 delta for workers                                  |
| `data/legal-framework.csv` Germany row       | Cross-reference for BITV/BFSG                                  |
| `templates/audit-report.md` (structure only) | Sections for evidence pack, adapted without conformance claims |

Copied excerpts: [`../copied/claude-wcag-accessibility-skill-audit-prompt.md`](../copied/claude-wcag-accessibility-skill-audit-prompt.md)
