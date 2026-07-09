# vpodorozh/Web-Accessibility-Guardian

**URL:** https://github.com/vpodorozh/Web-Accessibility-Guardian  
**License:** MIT

## What it is

A Node CLI and web UI that runs Playwright + axe-core against a URL, then uses Gemma 4 (Ollama local or Google AI API) to turn each violation into plain-language explanations, persona narratives, and before/after code fixes. Includes GitHub Actions workflow publishing HTML reports to Pages.

## Architecture / workflow

```
CLI --url
  → scanner.js (Playwright + axe)
  → analyzer.js (per-violation Gemma 4 dense model, sequential)
  → summarizer (scan-level triage + persona narrative via MoE model)
  → reporter.js (CLI / HTML / JSON)
```

Two-model strategy: 31B dense for structured per-violation JSON; 26B MoE for cross-violation reasoning with `<think>` chain-of-thought. `--no-ai` mode returns raw axe output.

## Pros

- Excellent **developer-facing explanation** prompts: affected users, first-person `userExperience`, priority P0–P3.
- Local Ollama path supports privacy-sensitive German public-sector content (URLs stay on-prem).
- Scan-level triage JSON (`headline`, `areas`, `priorityOrder`) useful for executive summary section.
- GitHub Actions + Pages pattern for shareable HTML evidence (no local setup).
- Roadmap explicitly mentions BITV 2.0 German mode (not implemented).

## Cons

- Single-page only (no crawl, no route matrix, no source review).
- Sequential LLM calls — slow on rate-limited free APIs; not suited for 50-route admin apps.
- No orchestrator, chunking, fix application, or verifier loop.
- Gemma-specific; FMC stack may prefer Claude/Cursor agents for explanations inline.
- BITV mode is aspirational; current output is generic WCAG English.
- Can over-trust LLM “fixes” without `manual_verification_required` discipline.

## Relevance to our German public-sector draft skill

**Medium** for narrative layers in evidence pack (executive summary, affected_users wording, remediation priority). **Low** as primary audit engine. Borrow prompt **structure** for optional “plain language” pass on YAML issue register — not as conformance authority.

Aligns with our rule: AI explains and suggests fixes; every issue keeps `manual_verification_required: true`.

## Verdict

**Imitate** — copy prompt patterns for violation explanation and scan-level triage; use axe + our orchestration for scanning, not this CLI as core.

## Content worth copying

- `buildExplanationPrompt` fields: summary, affectedUsers, userExperience (first-person), whyItMatters, howToFix, priority.
- `buildLogicalSummaryPrompt` triage JSON shape for executive summary.
- Limitations disclaimer pattern (rate limits, local vs hosted).

See [copied/web-accessibility-guardian-prompts.md](../copied/web-accessibility-guardian-prompts.md).
