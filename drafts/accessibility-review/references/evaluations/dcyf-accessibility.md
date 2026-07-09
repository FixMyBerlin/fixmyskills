# NotMyself/dcyf-accessibility

**URL:** https://github.com/NotMyself/dcyf-accessibility  
**License:** Not declared (no LICENSE file in repo)

## What it is

A government-adjacent proof of concept for automated WCAG 2.2 AA audits of a Washington State DCYF training portal. Claude Code orchestrates Playwright CLI to crawl pages, capture multi-modal evidence per page, and dispatch five parallel specialist agents aligned to five standards documents. Results publish to GitHub Pages.

## Architecture / workflow

```
/accessibility-audit prompt
  Phase 0: Pre-work (browser, auth, read standards)
  Phase 1: Page discovery (BFS crawl, inventory) → PAUSE for user approval
  Phase 2: Per-page audit (evidence capture → 5 parallel specialists → assemble report)
  Phase 3: Executive summary → PAUSE for user review
```

**Evidence per page:** 1920×1080 screenshot, 320px reflow screenshot, DOM snapshot (YAML), contrast JSON (`getComputedStyle` script), keyboard Tab sequence (15–20 steps).

**Specialists:** structure-semantics, links-navigation, images-visual-design, forms-dynamic-content, multimedia-motion — each reads standards section + evidence, returns findings.

**Output tree:** `docs/accessibility/{date}/page-inventory.md`, `executive-summary.md`, `{PageName}/report.md` + artifacts.

## Pros

- Strongest **evidence-pack** model in the landscape: dual visual + DOM capture, reflow at 320px, contrast extraction, keyboard sequence logging.
- Human-in-the-loop gates after inventory and executive summary — fits procurement review cadence.
- Standards docs split Required vs Best practice with explicit WCAG refs — easy to map to our YAML findings.
- Page report + executive summary templates are production-quality structures.
- Auth/session recovery, subroute scoping, parameterized route dedup, 100-page cap — pragmatic crawl rules.
- Published audit examples (`docs/accessibility/2026-03-28/`) show real output shape.

## Cons

- **No license** — cannot copy templates or prompts into our repo without clarification.
- Playwright **CLI** skill, not MCP; Cursor would need `playwright-skill` or agent-browser adaptation.
- Runtime-only (no source-code review, no TanStack Form wiring inspection).
- US government PoC framing; no BITV 2.0 / EN 301 549 / German `lang="de"` defaults.
- No fix loop, verifier, or chunked commit workflow.
- Crawl-based discovery misses auth-gated route families without credentials.

## Relevance to our German public-sector draft skill

**Very high** for steps 5–6 (runtime verification + evidence pack): per-page artifact bundle, executive summary with cross-page dedup table, limitations section listing manual verification gaps. **High** for Phase 1 inventory pause before chunk dispatch. **Medium** for specialist split (we may align to stack-rules categories + map/PDF sections).

Our orchestrator should **imitate** the evidence modality table, page report sections, and “limitations” block — re-authored under our license with German admin additions (map non-map path, PDF alternative, `manual_verification_required`).

## Verdict

**Imitate** — best reference for evidence capture workflow and report templates; do not copy files verbatim (no license).

## Content worth copying

- Evaluation modality guide (snapshot vs screenshot vs keyboard vs contrast script) — reimplement in our worker prompts.
- Page discovery dedup rules (trailing slash, fragments, parameterized routes).
- Executive summary cross-page findings table with “pages affected” column.
- Limitations / manual verification checklist in executive summary template.

No `copied/` excerpts — license not declared.
