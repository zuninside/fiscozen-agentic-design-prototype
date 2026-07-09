#!/usr/bin/env bash
# Enforce atomic-design entity convention on Write/Edit of `.vue` files.
#
# Rule: every Vue component lives in `<layer>/<EntityName>/<EntityName>.vue`.
# Loose `.vue` files at the layer root (e.g. `molecules/Foo.vue`) and case
# mismatches (e.g. `Foo/foo.vue`) are blocked with a hint to use `/scaffold`.
#
# PreToolUse hook for Write and Edit tools.
# Exit 0 = allow, exit 2 = block (stderr surfaced to Claude as the reason).

set -uo pipefail

# jq is required to parse the hook input JSON. If it's missing we fail open
# (atomic-structure violations will be caught later by ESLint), but warn loudly
# so the developer knows enforcement is degraded.
if ! command -v jq >/dev/null 2>&1; then
    printf '[enforce-atomic-structure] WARN: jq not found on PATH — atomic-structure write-time hook disabled. Install with `brew install jq`.\n' >&2
    exit 0
fi

INPUT_JSON=$(cat)
TOOL_NAME=$(echo "$INPUT_JSON" | jq -r '.tool_name // empty')

# Only check Write and Edit operations
[[ "$TOOL_NAME" = "Write" || "$TOOL_NAME" = "Edit" ]] || exit 0

FILE_PATH=$(echo "$INPUT_JSON" | jq -r '.tool_input.file_path // empty')
[ -n "$FILE_PATH" ] || exit 0

# Only check `.vue` files
[[ "$FILE_PATH" == *.vue ]] || exit 0

# Match `packages/<pkg>/src/<layer>/...` where layer is an atomic component layer.
# Composable layer (`composables/`) and `types/` cannot contain `.vue` files,
# so any `.vue` outside the four component layers is also wrong — but we let
# the broader ESLint rules catch that case rather than block here.
if [[ ! "$FILE_PATH" =~ packages/[^/]+/src/(molecules|organisms|templates|pages)/ ]]; then
    exit 0
fi

# App.vue at packages/<pkg>/src/App.vue is exempt — it's the app shell.
if [[ "$FILE_PATH" =~ packages/[^/]+/src/App\.vue$ ]]; then
    exit 0
fi

BASENAME="$(basename "$FILE_PATH" .vue)"
PARENT_DIR="$(basename "$(dirname "$FILE_PATH")")"

if [ "$BASENAME" != "$PARENT_DIR" ]; then
    cat >&2 <<EOF
BLOCKED: atomic-design entity convention violated.

Path:    $FILE_PATH
Found:   .../$PARENT_DIR/$BASENAME.vue
Expected: .../<EntityName>/<EntityName>.vue (parent dir matches file basename)

Every Vue component must live in its own entity directory:
  <layer>/<EntityName>/
    <EntityName>.vue
    index.ts
    types/index.ts

Use the /scaffold skill to create entities correctly, or run:
  mkdir -p "\$(dirname "$FILE_PATH")/$BASENAME"
  # then move the file inside it.
EOF
    exit 2
fi

exit 0
