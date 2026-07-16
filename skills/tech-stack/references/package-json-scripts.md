# package.json script names

Template: [examples/package-json-scripts.mdc.template](../examples/package-json-scripts.mdc.template).

Derived from [tilda-geo](https://github.com/FixMyBerlin/tilda-geo/blob/develop/.cursor/rules/package-json-scripts.mdc). Copy to `.cursor/rules/package-json-scripts.mdc` on scaffold; tune only if the app has unusual script layout.

## Policy

| Rule                   | Detail                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Standalone scripts** | kebab-case, no `:` — e.g. `type-check`, `lint-check`, `migrate-check`, `knip-warn`                                        |
| **Colon groups**       | `:` only for step scripts in a Bun group — parent runs `bun run --parallel <group>:*` or `bun run --sequential <group>:*` |
| **Step naming**        | `<group>:<step>` with numeric prefix when order matters — e.g. `predev:2migration`, `migrate-create:1write`               |
| **No `&&` chains**     | Split multi-step flows into `<group>:<step>` + orchestrator; use `&&` only inside a single step when rare                 |
| **Lifecycle hooks**    | Avoid accidental `pre<script>` / `post<script>` names — e.g. `preseed` runs before `seed`                                 |

Bun docs: [script filtering](https://bun.sh/docs/cli/run#filtering).

## Scaffold setup

```bash
mkdir -p .cursor/rules
cp path/to/package-json-scripts.mdc.template .cursor/rules/package-json-scripts.mdc
```

Oxlint/oxfmt script block (`lint`, `lint-check`, `format`, `format-check`): [oxc-config.md](oxc-config.md). Knip script names: [knip.md](knip.md).

## Reference apps

- [tilda-geo `app/package.json`](https://github.com/FixMyBerlin/tilda-geo/blob/develop/app/package.json) — `dev:*`, `predev:*`, `db-pull:*`
- [trassenscout `package.json`](https://github.com/FixMyBerlin/trassenscout/blob/develop/package.json) — `predev:*`, `migrate-create:*`, `env-check:*`
