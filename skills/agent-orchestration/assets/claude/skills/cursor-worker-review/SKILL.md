---
name: cursor-worker-review
description: >-
  Independent read-only review via cursor-agent CLI (Composer 2.5, ask mode).
  Use for skeptical validation of diffs, plans, or claimed completion before
  Fable declares done. Requires cursor-agent on PATH.
user-invocable: true
disable-model-invocation: true
---

# Cursor worker — review

Skeptical **read-only** pass via `cursor-agent`. Parent must not trust claims without evidence.

## Prerequisite

```bash
which cursor-agent
```

## Workflow

1. Identify review target (uncommitted diff, branch, specific files, or plan doc).
2. Write a self-contained prompt: what to inspect, what “pass” means, output format.
3. Run from repo root:

```bash
REPO="$(git rev-parse --show-toplevel)"
cursor-agent -p --trust --mode ask --output-format json \
  --workspace "$REPO" \
  --model composer-2.5 \
  "Review target: [describe]. Inspect git diff and relevant files. Output: Verified (with evidence), Issues (must-fix), Gaps (unverified), Verdict (ready/not ready). Do not edit files."
```

4. **Verify important claims** yourself (spot-check files, re-run checks) before presenting to the user.
5. If review finds nothing, say so clearly and state what was inspected.

## Investigation (read-only)

For discovery without edits, prefer `--mode plan` or `--mode ask`:

```bash
cursor-agent -p --trust --mode plan --output-format json \
  --workspace "$REPO" \
  --model composer-2.5 \
  "Investigate: … Return findings only."
```

## Prompt style

- Self-contained: paths, branch/SHA, scope, expected output sections.
- Simpler than Claude prompts — `cursor-agent` does not need Claude-style system framing.

## When parent should use this

- After implementation, before merge or “done”
- Second opinion on plans or large diffs
- Parent orchestrates; does not replace this with inline skimming
