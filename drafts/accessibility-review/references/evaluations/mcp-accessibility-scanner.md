# JustasMonkev/mcp-accessibility-scanner

**URL:** https://github.com/JustasMonkev/mcp-accessibility-scanner  
**License:** MIT

## What it is

An MCP server forked from Microsoft Playwright MCP with added axe-core scanning and dedicated audit tools. Agents get browser automation (accessibility snapshots, click/type/navigate) plus `scan_page`, `audit_site`, `scan_page_matrix`, and `audit_keyboard` for WCAG-oriented runtime checks without writing custom Playwright scripts.

## Architecture / workflow

```
MCP client (Cursor, Claude Code, VS Code)
  → stdio MCP server (or Docker / HTTP transport)
  → Playwright browser context (persistent or isolated)
  → tools: browser_* (snapshots, interaction) + scan_page (axe) + audit_* (site crawl, matrix, keyboard)
  → JSON reports written to output dir
```

**`scan_page`:** axe-core with WCAG 2.0/2.1/2.2 tag filters and category tags (`cat.keyboard`, `cat.forms`, etc.).

**`audit_site`:** BFS/link/nav/sitemap/provided URL strategies; aggregates violations across pages.

**`scan_page_matrix`:** same page across viewport variants (mobile, forced-colors, reduced-motion, zoom-200).

**`audit_keyboard`:** programmatic Tab/Shift+Tab with heuristics for skip links, focus visibility, focus jumps, focus traps; optional issue screenshots.

Includes bundled `SKILL.md` recommending interactive REPL mode for agents (`npx mcp-accessibility-scanner interactive`).

## Pros

- Drop-in runtime layer for our step 5 — pairs with existing `agent-browser` / Playwright MCP profile in FMC stack.
- `audit_keyboard` fills a gap axe alone misses (focus order, traps, skip-link activation).
- `scan_page_matrix` supports reflow/contrast/theme variants aligned with WCAG 1.4.x checks.
- MIT license; Docker image for reproducible CI scans.
- `audit_site` complements our route inventory when sitemap or link crawl is enough.

## Cons

- DOM/axe-only — no React source review, TanStack Form label wiring, or map “non-map equivalent” logic.
- No orchestration, chunking, grading, or evidence-pack templates — tool server only.
- Large tool surface → token cost vs Playwright CLI + skill (acknowledged in upstream humanized fork README).
- No German BITV framing; reports are JSON, not procurement-ready markdown.
- Keyboard audit heuristics are practical but not screen-reader authoritative.

## Relevance to our German public-sector draft skill

**High** as runtime verification backend for chunk workers and final evidence pass. **Medium** for `audit_site` during inventory. Map to our `playwright-skill` / agent-browser MCP step: keyboard path, focus after dialog, SPA title/focus reset.

Use **`scan_page` with `wcag22aa`** + **`audit_keyboard`** on critical flows (auth, form submit, map picker) after static review.

## Verdict

**Adopt** (as MCP runtime tool, not as full audit workflow) — wire into step 5 alongside static chunk review; keep orchestration in our skill.

## Content worth copying

- `audit_keyboard` heuristic checklist (skip link, focus visibility, jumps, traps).
- `scan_page_matrix` default variant set for theme/reflow smoke.
- SKILL.md pattern: interactive REPL for token-efficient agent loops.

See [copied/mcp-accessibility-scanner-keyboard-audit.md](../copied/mcp-accessibility-scanner-keyboard-audit.md).
