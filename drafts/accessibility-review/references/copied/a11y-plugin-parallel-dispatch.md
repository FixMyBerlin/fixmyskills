<!--
Source: https://github.com/deventually/a11y-plugin
Files: agents/a11y-agent.md, skills/a11y-audit/SKILL.md (excerpt)
License: MIT (.claude-plugin/plugin.json)
Copied: 2026-07-09 for FMC accessibility-review skill research
-->

# Parallel dispatch and cache rules (excerpt)

## Entry skill rule

> **Always dispatch the agent. Never evaluate files yourself.**

Entry skill validates arguments, then invokes orchestrator with parsed mode, level, category, browser URLs, file targets, and no-cache flag.

---

## Adaptive parallel batch sizing

| Files needing audit | Strategy                         |
| ------------------- | -------------------------------- |
| 0                   | No dispatch (all cached)         |
| 1                   | Single subagent                  |
| 2–10                | One subagent per file            |
| 11–50               | Batches of 5 files per subagent  |
| 51+                 | Batches of 10 files per subagent |

**Hard cap:** never more than 15 subagents. If file count would require more, increase batch size.

**Warning threshold:** if more than 200 files, print inform-only message (do not block).

---

## Worker prompt shape (static audit)

```
You are an a11y evaluation worker. For each file listed below, invoke the a11y-evaluate skill and collect JSON findings.

Files to evaluate:
- [file1] (categories: [relevant categories])
...

Level: [AA]
Category filter: [category or "all"]

After evaluating all files, return:
{"results": [<findings from file1>, <findings from file2>, ...]}
```

---

## Incremental cache hit criteria

Cache entry valid when **all** match:

- `content_hash` matches computed fingerprint (lightweight: first 200 chars + file length + last 100 chars)
- `checklist_hash` matches current checklist version
- Cached level is same or higher than requested (AA cache valid for A, not for AAA)

`--changed` files always bypass cache. `--no-cache` skips cache entirely.

Print at start: `Cached: [N] files (unchanged) | To audit: [N] files`

---

## Fix scope classification

| Classification | Fix behavior                                                        |
| -------------- | ------------------------------------------------------------------- |
| AUTO           | Deterministic fix applied                                           |
| PARTIAL        | Fix detectable portion only                                         |
| MANUAL         | Guidance only — contrast quality, reading order, screen reader flow |

After fix run: re-audit modified files and report resolved vs remaining.
