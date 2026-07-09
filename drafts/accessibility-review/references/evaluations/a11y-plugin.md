# deventually/a11y-plugin

**URL:** https://github.com/deventually/a11y-plugin  
**License:** MIT (`.claude-plugin/plugin.json`; no root LICENSE file)

## What it is

A Claude Code plugin that audits, fixes, and self-tests WCAG 2.2 conformance directly in the editor. It embeds 71 deterministic checks across nine categories, exposes `/a11y-audit`, `/a11y-fix`, and `/a11y-test` commands, and optionally layers Playwright MCP browser verification for 20 additional runtime checks (contrast, focus traps, reflow).

## Architecture / workflow

```
/a11y-audit | /a11y-fix | /a11y-test (entry skills)
        → a11y-agent (orchestrator)
        → parallel workers per file batch
        → internal skills: a11y-evaluate | a11y-apply | a11y-browser
        → JSON + Markdown reports + incremental cache + audit-history deltas
```

1. Entry skill validates args (level, category, URLs, paths) and dispatches `a11y-agent` — never evaluates inline.
2. Agent scopes files (`--changed`, directory glob, or explicit paths), loads incremental cache (`docs/a11y-reports/.a11y-cache.json`), classifies content categories per file.
3. Adaptive parallel dispatch: 1 file → 1 worker; 2–10 → one per file; 11–50 → batches of 5; 51+ → batches of 10; hard cap 15 subagents.
4. Each worker invokes `a11y-evaluate` skill (embedded checklist) per file; optional `a11y-browser` subagent when `--browser` URLs provided.
5. Aggregates pass/fail/manual counts, writes inline summary + `YYYY-MM-DD-audit.json` + `.md`, appends `audit-history.json` with delta vs prior run.
6. `/a11y-fix` reads latest audit JSON, applies `[AUTO]`/`[PARTIAL]` via `a11y-apply`, re-audits changed files.

Classification per finding: `AUTO` (11 static, 29 with browser), `PARTIAL` (44 static), `MANUAL` (16 static). Content-aware category activation skips irrelevant checks (e.g. no `<form>` → skip form checks).

## Pros

- Closest match to our orchestrator/worker split: entry skill validates, agent orchestrates, workers evaluate.
- Incremental cache + audit deltas reduce repeat cost on large repos.
- Content classification avoids running all 71 checks on every file.
- Golden-file + regression self-test suite (`/a11y-test`, 71 fixtures) — unusual rigor for an agent skill.
- React/TSX in supported file types; browser path covers contrast, reflow, focus traps.
- Read-only audit mode by default; fix is explicit second step.

## Cons

- Checklist lives in skill markdown plus `checklist/wcag22-checklist.json` and xlsx exports — structured but still hard to map to BITV/EN 301 549 framing without re-authoring.
- No route discovery, chunking by workflow risk, or evidence-pack schema (coverage matrix, residual risks).
- No German public-sector legal guardrails (no “never claim compliance” encoding).
- Map/PDF/administrative-flow semantics absent; generic WCAG categories only.
- Cache fingerprint is lightweight (first 200 chars + file length + last 100 chars), not a cryptographic hash.
- Browser verification depends on generic `@playwright/mcp`, not axe keyboard/site audit tools.

## Relevance to our German public-sector draft skill

**High** for orchestration patterns (validate → dispatch agent → parallel file batches → aggregate → verify → report). **Medium** for WCAG coverage (2.2 AA aligned, some AAA checks available via `--level AAA`). **Low** for German Verwaltungsvorgänge framing, TanStack Form/map-specific rules, and tiered evidence deliverables.

Maps cleanly to our steps 4 (per-chunk review) and 5 (runtime verify via `--browser`), but we still need inventory/classify/chunk orchestration, readonly verifier, `finish-work`, and YAML issue register ourselves.

## Verdict

**Imitate** — adopt orchestration, caching, audit/fix/test command split, and parallel batch sizing; do not adopt as a dependency (Claude Code–specific plugin, no BITV/residual-risk layer).

## Content worth copying

- Entry-skill “always dispatch agent, never evaluate yourself” rule (`skills/a11y-audit/SKILL.md`).
- Adaptive parallel batch table and 15-subagent cap (`agents/a11y-agent.md`).
- Incremental cache hit/miss rules and audit-history delta line.
- AUTO / PARTIAL / MANUAL classification for fix scope control.
- Audit → fix → re-audit workflow example in README.

See [copied/a11y-plugin-parallel-dispatch.md](../copied/a11y-plugin-parallel-dispatch.md).
