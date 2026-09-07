#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${1:-.}"

if [[ ! -d "$TARGET_DIR" ]]; then
  echo "Target directory does not exist: $TARGET_DIR" >&2
  exit 1
fi

cp "$SOURCE_DIR/AGENTS.md" "$TARGET_DIR/AGENTS.md"
mkdir -p "$TARGET_DIR/agent"
cp "$SOURCE_DIR"/agent/*.md "$TARGET_DIR/agent/"

echo "Installed agentic POC instructions into: $(cd "$TARGET_DIR" && pwd)"
echo "Next: run Codex from that repository and ask it to read AGENTS.md and inspect the codebase."
