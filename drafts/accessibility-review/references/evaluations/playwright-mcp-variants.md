# Playwright MCP variants (combined)

**URLs:**

| Repo                                                                                                    | Notes                                        |
| ------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| https://github.com/microsoft/playwright-mcp (via `Nazruden/playwright-mcp`, `lxe/playwright-mcp` forks) | Upstream Microsoft package `@playwright/mcp` |
| https://github.com/njoppi2/playwright-mcp-humanized                                                     | Fork adding humanized mouse/typing           |
| https://github.com/JustasMonkev/mcp-accessibility-scanner                                               | axe + audit tools (separate evaluation)      |

**License:** Apache-2.0 (Microsoft upstream); humanized fork inherits same LICENSE.

## What they are

MCP servers exposing Playwright browser automation to LLMs via accessibility snapshots (ARIA tree), not screenshots. Microsoft’s official `@playwright/mcp` is the baseline; community forks are mostly sync copies or thin wrappers. `playwright-mcp-humanized` patches mouse moves and `locator.fill()` with human-like timing to reduce bot detection. `mcp-accessibility-scanner` extends the same base with axe and audit tools (see dedicated evaluation).

## Architecture / workflow

```
MCP client → npx @playwright/mcp@latest (stdio)
  → Playwright browser (Chrome default, persistent profile optional)
  → tools: browser_navigate, browser_snapshot, browser_click, browser_type, ...
  → agent reads snapshot refs, acts deterministically
```

Humanized fork: `patch.js` wraps page mouse and locators after browser launch.

Microsoft README (humanized fork, 2026) explicitly contrasts **MCP vs Playwright CLI + SKILLS**: CLI is more token-efficient for coding agents; MCP suits persistent state and exploratory loops.

## Pros

- Already in FMC stack (`tech-stack`, `a11y-plugin` browser path, Cursor agent-browser MCP).
- Snapshot-based interaction avoids vision models — fits our static-first review.
- Mature, Apache-licensed, actively maintained by Microsoft.
- Humanized fork may help scans of bot-protected German portals (limited evidence).

## Cons

- **No WCAG logic** in baseline — agents must interpret snapshots or call axe separately.
- Verbose tool schemas and large snapshots → context/token pressure on big SPAs (admin dashboards, maps).
- No built-in keyboard audit, site crawl, or report templates (use `mcp-accessibility-scanner` or custom skill).
- Fork proliferation (`Nazruden`, `lxe`) appears stale vs npm `@playwright/mcp@latest` — prefer official package.
- Humanized fork adds maintenance burden vs upstream; unclear benefit for localhost FMC apps.

## Relevance to our German public-sector draft skill

**Adopt** official `@playwright/mcp` / `agent-browser` for step 5 runtime checks already referenced in SKILL.md — FMC already wires agent-browser MCP in step 5 per our draft skill. **Skip** Nazruden/lxe forks unless pinning a specific version. **Consider** humanized fork only if staging environments block default MCP user-agent.

For German public-sector audits, baseline MCP snapshots support procurement evidence capture (page state, interaction traces) but must be paired with keyboard/focus verification on Verwaltung flows — login, multi-step forms, dialog-heavy admin screens — where BITV expects demonstrable operability, not axe-only passes.

Pair baseline MCP with `mcp-accessibility-scanner` or `playwright-skill` axe scripts for WCAG-tagged scans — snapshots alone are insufficient for conformance evidence.

## Verdict

**Adopt** Microsoft `@playwright/mcp` (or FMC `agent-browser` profile) as browser transport. **Skip** duplicate forks. **Imitate** humanized interaction only if bot detection blocks audits.

## Content worth copying

- MCP vs CLI token-efficiency guidance from humanized README — encode in worker prompts (“prefer concise browser commands”).
- Standard MCP config snippet for Cursor/Claude settings.

No separate `copied/` file — Apache upstream docs suffice; WCAG tooling lives in `mcp-accessibility-scanner` evaluation.
