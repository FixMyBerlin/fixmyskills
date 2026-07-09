# accesslens (annarose14 + Upanshi-Mittal)

**URLs:**

- https://github.com/annarose14/accesslens (Anna Rose — live demo, Groq/Llama)
- https://github.com/Upanshi-Mittal/Accesslens (Upanshi Mittal — Docker, LLaVA/Mistral, MIT)

**Licenses:** Upanshi repo MIT (`LICENSE.md`); Anna Rose repo has **no LICENSE file**.

## What they are

Two independent hackathon-style prototypes with the same name: paste a URL, Playwright renders the page, axe-core finds violations, an LLM generates plain-English impact text and code fixes, results shown in a React/Next dashboard. Anna Rose’s version is a lean FastAPI + Groq (Llama 3.3 70B) stack on Railway/Vercel. Upanshi’s version is a heavier Docker monolith with seven parallel “engines,” local vision (LLaVA), and Mistral 7B code patches — marketed with HUD visualization and 85% test coverage.

## Architecture / workflow

**Anna Rose (simpler):**

```
URL → FastAPI → Playwright Chromium → inject axe-core → per-violation Groq prompt → JSON to React UI
```

**Upanshi (complex):**

```
URL → FastAPI orchestrator → Playwright (DOM + screenshot)
  → 7 parallel engines (axe, structural heuristics, contrast, keyboard sim, UX NLP, LLaVA vision, Mistral fixes)
  → Redis/SQLite → Next.js HUD
```

Neither repo implements multi-page orchestration, source-code review, or agent chunking.

## Pros

- Demonstrates **axe + LLM explanation** UX that developers actually read.
- Anna Rose: fast to understand, minimal moving parts, real public demo results.
- Upanshi: keyboard navigation engine and contrast-correlation ideas; local-only AI option (no API leakage).
- Both validate the “URL in, prioritized report out” product shape for stakeholder demos.

## Cons

- **Not agent workflows** — no inventory, specialists, verifier, or commit loop.
- WCAG 2.1 focus (Anna Rose README); not 2.2 / BITV / EN 301 549 aligned.
- No German admin semantics, maps, PDFs, TanStack Form.
- Upanshi’s vision/NLP claims are hard to verify; 38k LOC prototype weight.
- Anna Rose: no license; cloud demos blocked on some government domains (bot detection).
- LLM-generated fixes risk false confidence without manual verification gates.

## Relevance to our German public-sector draft skill

**Low** for orchestrated FMC audits. **Low–medium** as UX reference if we ever ship a stakeholder-facing scan dashboard. Some engine ideas (keyboard sim, contrast across states) overlap with `mcp-accessibility-scanner` and `sdet-wcag-toolkit` dynamic runners — prefer those mature implementations.

## Verdict

**Skip** as architecture basis — prototypes only. **Imitate** at most the violation card UX (severity, WCAG link, before/after fix) for optional reporting polish.

## Content worth copying

- Violation card field set (severity, human impact, before/after code, WCAG doc link) — re-author, do not copy Anna Rose repo (no license).
- Upanshi engine registry pattern (parallel specialized analyzers) — concept only; MIT code is large and overlaps sdet-wcag-toolkit.

No `copied/` files — insufficient license clarity on primary demo repo; overlap with other evaluations.
