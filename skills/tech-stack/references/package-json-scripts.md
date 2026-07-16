# package.json script names

Template: [examples/package-json-scripts.md.template](../examples/package-json-scripts.md.template).

Copy to `.cursor/rules/package-json-scripts.md` on scaffold; tune per app layout.

## Policy

| Rule                   | Detail                                                                                                                      |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Standalone scripts** | kebab-case, no `:` — e.g. `type-check`, `check-pre-commit`, `migrate-check`                                                 |
| **Colon groups**       | `:` for Bun group steps — `bun run --parallel <group>:*` or `bun run --sequential <group>:*`                                |
| **Step naming**        | `<group>:<step>`; numeric prefix when order matters — `predev:2migration`                                                   |
| **Orchestrators**      | `check-pre-commit`, `check-pre-push`, `check-ci` compose other scripts; `&&` allowed in these few verify orchestrators only |
| **Lifecycle hooks**    | Avoid accidental `pre<script>` / `post<script>` names                                                                       |

Bun docs: [script filtering](https://bun.sh/docs/cli/run#filtering).

## Verify scripts (canonical)

Who runs what — agents and docs only reference these names:

| Script                 | Who runs it                                           | Role                                                                               |
| ---------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **`check`**            | Composed by orchestrators                             | **Mutating** — `type-check` + write-mode `lint` + write-mode `format` + `test-run` |
| **`check-ci`**         | CI (`bun run check-ci`)                               | **Read-only** — `check-ci:*` group; never rewrites files                           |
| **`check-pre-commit`** | [finish-work](../../finish-work/SKILL.md) skill       | Mutating `check` + advisory knip (`knip-warn \|\| true`)                           |
| **`check-pre-push`**   | husky [pre-push](../examples/husky/pre-push.template) | Mutating `check` + strict `knip`                                                   |
| **`check-full`**       | Optional (e.g. trassenscout)                          | `check-pre-push` then `e2e`                                                        |

Without Knip: `check-pre-commit` and `check-pre-push` collapse to `bun run check`.

**Monorepos / repo tails:** extend `check-pre-push` in `package.json` (topic-docs regen, `processing/` check, `migrate-check-test`) — not in husky prose.

### Scaffold (with Knip)

Oxlint/oxfmt leaves: [oxc-config.md](oxc-config.md). Knip config: [knip.md](knip.md).

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "lint": "oxlint --fix --fix-dangerously --deny-warnings -c oxlint.config.mjs .",
    "format": "oxfmt --write -c oxfmt.config.mjs .",
    "test-run": "vitest run --passWithNoTests",

    "check": "bun run --parallel type-check lint format test-run",

    "check-ci": "bun run --parallel check-ci:*",
    "check-ci:type-check": "tsc --noEmit",
    "check-ci:lint-check": "oxlint --deny-warnings -c oxlint.config.mjs .",
    "check-ci:format-check": "oxfmt --check -c oxfmt.config.mjs .",
    "check-ci:test-run": "vitest run --passWithNoTests",

    "knip": "KNIP_STRICT=1 knip --config knip.config.mjs",
    "knip-warn": "knip --config knip.config.mjs",
    "check-pre-commit": "bun run check && (bun run knip-warn || true)",
    "check-pre-push": "bun run check && bun run knip"
  }
}
```

Multi-path lint/format (tilda-geo style): nest under `check-ci:lint-check:*` / `check-ci:format-check:*` instead of top-level `check-lint:*`.

## Scaffold setup

```bash
mkdir -p .cursor/rules
cp path/to/package-json-scripts.md.template .cursor/rules/package-json-scripts.md
```
