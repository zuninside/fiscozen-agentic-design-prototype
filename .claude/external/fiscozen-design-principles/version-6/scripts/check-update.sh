#!/usr/bin/env bash
# Controllo aggiornamenti skill — chiamato da Step 0 del SKILL.md.
# Esce silenziosamente in caso di errore (offline, repo non inizializzato, etc.)
# Stampa "UPDATED" sullo stdout solo se la skill è stata effettivamente aggiornata.

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$SKILL_DIR" || exit 0

# Skip se la cartella non è un repo git (es. setup non completato)
[ -d .git ] || exit 0

# Cache: skippa se il check è stato fatto nelle ultime 24h
STAMP=".last-update-check"
if [ -f "$STAMP" ]; then
  NOW=$(date +%s)
  LAST=$(stat -f %m "$STAMP" 2>/dev/null || stat -c %Y "$STAMP" 2>/dev/null || echo 0)
  AGE=$((NOW - LAST))
  if [ "$AGE" -lt 86400 ]; then
    exit 0
  fi
fi

# Fetch con timeout — se offline o lento, esci pulito ma aggiorna lo stamp
if ! timeout 5 git fetch --quiet origin 2>/dev/null; then
  date +%s > "$STAMP"
  exit 0
fi

LOCAL=$(git rev-parse HEAD 2>/dev/null)
REMOTE=$(git rev-parse '@{u}' 2>/dev/null)

if [ -n "$LOCAL" ] && [ -n "$REMOTE" ] && [ "$LOCAL" != "$REMOTE" ]; then
  if git pull --ff-only --quiet 2>/dev/null; then
    echo "UPDATED"
  fi
fi

date +%s > "$STAMP"
