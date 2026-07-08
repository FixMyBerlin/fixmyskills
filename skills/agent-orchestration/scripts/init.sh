#!/usr/bin/env bash
# Copy agent-orchestration templates into the target repo's .cursor/ (and optional docs/).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ASSETS="$SKILL_DIR/assets"

find_repo_root() {
  local dir="$SKILL_DIR"
  while [[ "$dir" != "/" ]]; do
    if [[ -d "$dir/.git" ]] || [[ -f "$dir/skills-lock.json" ]]; then
      echo "$dir"
      return 0
    fi
    dir="$(cd "$dir/.." && pwd)"
  done
  echo "$(cd "$SKILL_DIR/../.." && pwd)"
}

REPO_ROOT="$(cd "${TARGET_REPO:-$(find_repo_root)}" && pwd)"

AGENTS_DIR="$REPO_ROOT/.cursor/agents"
RULES_DIR="$REPO_ROOT/.cursor/rules"
DOCS_FILE="$REPO_ROOT/docs/agent-orchestration.md"

SKIP_DOCS=false
for arg in "$@"; do
  case "$arg" in
    --no-docs) SKIP_DOCS=true ;;
    -h | --help)
      echo "Usage: bash scripts/init.sh [--no-docs]"
      echo "Copies orchestration templates into the repo that contains .agents/skills/."
      echo "Set TARGET_REPO=/path/to/repo to override destination."
      exit 0
      ;;
  esac
done

mkdir -p "$AGENTS_DIR" "$RULES_DIR"

cp "$ASSETS/implementer.md" "$AGENTS_DIR/implementer.md"
cp "$ASSETS/verifier.md" "$AGENTS_DIR/verifier.md"
cp "$ASSETS/orchestrator-worker.mdc" "$RULES_DIR/orchestrator-worker.mdc"

if [[ "$SKIP_DOCS" == false ]]; then
  mkdir -p "$(dirname "$DOCS_FILE")"
  cp "$ASSETS/agent-orchestration.md" "$DOCS_FILE"
fi

echo "Agent orchestration setup complete in: $REPO_ROOT"
echo "  $AGENTS_DIR/implementer.md"
echo "  $AGENTS_DIR/verifier.md"
echo "  $RULES_DIR/orchestrator-worker.mdc"
if [[ "$SKIP_DOCS" == false ]]; then
  echo "  $DOCS_FILE"
fi
echo ""
echo "Next: commit .cursor/ (and docs/ if copied), pick Fable 5, start tasks with @orchestrator-worker"
