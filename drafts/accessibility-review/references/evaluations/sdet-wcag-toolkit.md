# darco81/sdet-wcag-toolkit

**URL:** https://github.com/darco81/sdet-wcag-toolkit  
**License:** AGPL-3.0-or-later

## What it is

A TypeScript monorepo toolkit for WCAG 2.2 AA audits combining three paths into a unified `WcagFinding` shape: deterministic static analysis (zero LLM), five parallel AI source-reading specialists (Claude Code Task tool), and dynamic Playwright + axe-core runners (keyboard flow, focus visibility). v0.4 adds multi-page audits with four route-discovery strategies and cross-page deduplication.

## Architecture / workflow

```
CLI /wcag:audit
  → Lead orchestrator (5 specialists in parallel via RuntimeAdapter)
  → optional static-analyzer (TS rules, CI-friendly)
  → optional dynamic-tester (axe, keyboard-flow, focus-visibility)
  → optional multi-page orchestrator (discover routes → audit each → dedupe)
  → score (100-pt) + grade (A–F) + dev/exec markdown reports
```

**Route discovery (v0.4):** dispatcher tries `sitemap → router-scan → json-config`; `ai` strategy opt-in. Router-scan detects Next.js, Vue, Astro file-based routes including dynamic segments.

**Specialists (static AI):** semantic-structure, aria-patterns, keyboard-interaction, color-contrast-static, forms-accessibility — each gets `Read`/`Grep`/`Glob` only, returns JSON findings.

**Cross-page dedup:** group by `ruleId + file + line` (source), `ruleId + selector` (DOM), or `ruleId + message` (fallback); emit `affectedPages[]` and heat-map report sorted by reach.

**Grading:** critical −15, serious −10, moderate −5, minor −2 on 100-point scale.

## Pros

- Most complete “engine room” in the landscape: static + AI + dynamic + multi-page in one pipeline.
- TanStack-adjacent: router-scan can walk React/Next-style `src/pages` and app router layouts.
- Deterministic path is CI-gate friendly (`--use-ai` opt-in preserves v0.2 behavior).
- Cross-page dedup and “single fix → many pages green” heat map directly address SPA shared-layout noise.
- Specialist prompts are focused, WCAG-SC–mapped, framework-aware (JSX `htmlFor`, Vue, Angular reactive forms).
- Honest WCAG coverage matrix docs; manual-only SC list.

## Cons

- **AGPL-3.0** — copying code/prompts into our skill repo triggers copyleft obligations; commercial Pro tier holds auth, parallel browsers, auto-fix, modal/ecommerce specialists.
- Claude Code–centric runtime adapter; not Cursor-native without porting.
- No German BITV/EN 301 549 framing, procurement language, or “never certify” guardrails.
- Grading/score can imply false precision for legal conformance.
- Map-only workflows, PDF outputs, TanStack Form error-summary patterns not first-class.
- Dynamic route warnings and sequential multi-page scans can be slow at scale (parallel is Pro).

## Relevance to our German public-sector draft skill

**High** for route inventory (router-scan + json-config), cross-page dedup in evidence pack, specialist-by-domain parallel review, and runtime verification stack. **Medium** for forms specialist rules (overlap with our critical form-label/error rules). **Low** as a drop-in dependency due to license and CC coupling.

Our orchestrator could **imitate** the Lead + 5 specialists model per chunk, use deterministic static rules in CI, and adopt cross-page grouping keys for the coverage matrix — without vendoring AGPL prompts.

## Verdict

**Imitate** — study architecture, dedupe strategy, specialist boundaries, and report shapes; do not copy AGPL source into our repo. Consider `json-config` route list for hand-curated German admin flows.

## Content worth copying

- Cross-page grouping key design (`ruleId + file + line` vs selector fallback) — **concept only** (AGPL; see evaluation, do not paste source).
- Specialist prompt structure: SC table, numbered rules, framework notes, JSON output fence (`packages/runtime-core/src/prompts/*.md`).
- Multi-page report sections: heat map → top cross-page findings → per-page collapse threshold.
- Route-discovery strategy decision tree (sitemap for staging, router-scan for local dev).

No files in `copied/` — AGPL license blocks permissive excerpting into our MIT skill drafts.
