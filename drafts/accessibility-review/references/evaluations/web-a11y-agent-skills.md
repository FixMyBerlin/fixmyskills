# Evaluation: klovaaxel/web-a11y-agent-skills

**Repo:** https://github.com/klovaaxel/web-a11y-agent-skills  
**License:** MIT  
**Evaluated:** 2026-07-09 (shallow clone of `main`)

## What it is

A modular library of **10 framework-agnostic web accessibility skills** plus **5 Cursor/Claude/OpenCode subagents** and install scripts for multiple AI platforms. The `web-a11y-orchestrator` skill routes tasks to specialized skills (authoring, forms, navigation, dynamic UI, CSS, review, testing, debugging, web components).

## Structure overview

```
web-a11y-agent-skills/
├── LICENSE (MIT)
├── README.md, CONTRIBUTING.md, CHANGELOG.md
├── skills/
│   ├── web-a11y-orchestrator/     # routing map + severity + report template
│   ├── web-a11y-authoring/        # + PATTERNS.md
│   ├── web-a11y-forms/            # + EXAMPLES.md
│   ├── web-a11y-navigation/
│   ├── web-a11y-dynamic-ui/
│   ├── web-a11y-css/
│   ├── web-a11y-review/             # + FINDINGS.md
│   ├── web-a11y-testing/          # + CHECKS.md
│   ├── web-a11y-debugging/
│   └── web-a11y-web-components/
├── agents/
│   ├── cursor/                    # 5 subagent definitions
│   ├── claude/, opencode/, copilot/
└── scripts/                       # install-* for each platform
```

Skills are short (~40–80 lines each); depth lives in companion `*.md` files. Public preview (pre-1.0).

## Pros

- **Closest architectural match** to our orchestrator model — explicit routing map, severity policy, multi-agent coordination (`a11y-orchestrator` → writer/reviewer/remediator/test-driver).
- **Separation of concerns** — forms, navigation, dynamic UI, CSS, and testing are isolated skills workers can load per chunk.
- **Strong finding format** in `web-a11y-review/FINDINGS.md` — impact, fix, regression check; contrasts weak vs strong findings.
- **Testing skill** with ordered smoke path (automation → keyboard → SR → preference modes) in `CHECKS.md`.
- **Forms skill** covers error summary, multi-step progress, input preservation — relevant to admin flows.
- **Platform installers** — Cursor subagents install via `scripts/install-cursor-agents.mjs`.
- **MIT, plain Markdown** — no runtime dependency on the skills themselves.

## Cons

- **WCAG version not pinned** — skills reference W3C/MDN/axe publicly but do not enumerate WCAG 2.2 criteria or BITV.
- **No German legal context** — no EN 301 549, BITV, BFSG, or residual-risk / non-certification language.
- **No stack bindings** — no React 19, Tailwind, TanStack Form, or React Map GL specifics.
- **Thin individual skills** — many SKILL.md files are outlines; agents must follow links to EXAMPLES/FINDINGS/CHECKS.
- **No evidence-pack schema** — report template is markdown prose, not YAML issue register or route coverage matrix.
- **No map/PDF/upload/auth risk tiers** — severity is behavioral, not workflow-criticality based.
- **Pre-1.0** — API/names may still change.

## Relevance to our German public-sector draft skill

**Highest structural alignment** among evaluated repos. Our draft already goes further on legal framing, stack rules, chunk risk classification, and structured deliverables. This repo is the best source for **orchestrator routing patterns**, **review finding quality bar**, and **testing smoke order** — adapt into our worker prompts and `review-output-format.md`.

Subagent names map cleanly: `a11y-code-reviewer` ≈ readonly verifier, `a11y-test-driver` ≈ runtime verification step, `a11y-remediator` ≈ implementer worker.

## Verdict: **imitate**

Adopt orchestration routing ideas, finding format, and testing checklist structure. Do not install as a dependency — merge patterns into our skill and reference files with FMC stack and German legal overlays.

## Content worth copying

| Asset                                                 | Why                                             |
| ----------------------------------------------------- | ----------------------------------------------- |
| Orchestrator routing map + severity + report template | Template for worker routing in our orchestrator |
| `FINDINGS.md` strong/weak finding examples            | Raises review output quality                    |
| `CHECKS.md` keyboard/SR/preference smoke steps        | Fits our runtime verification phase             |
| `web-a11y-forms/EXAMPLES.md` error recovery bullets   | Aligns with TanStack Form critical rules        |

Copied excerpts: [`../copied/web-a11y-agent-skills-orchestration.md`](../copied/web-a11y-agent-skills-orchestration.md), [`../copied/web-a11y-agent-skills-findings-testing.md`](../copied/web-a11y-agent-skills-findings-testing.md)
