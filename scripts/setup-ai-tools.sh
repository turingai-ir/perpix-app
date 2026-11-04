#!/usr/bin/env sh
# Links Claude Code skills to the shared skills folder (.agents/skills).
# Run once per clone: sh scripts/setup-ai-tools.sh
# The graphify hooks in .claude/settings.json are no-ops when the graphify CLI is
# not installed, so graphify is optional; install it only if you want graph queries.
set -eu
root="$(cd "$(dirname "$0")/.." && pwd)"
[ -d "$root/.agents/skills" ] || { echo "Missing .agents/skills" >&2; exit 1; }
mkdir -p "$root/.claude"
if [ -L "$root/.claude/skills" ]; then echo ".claude/skills already linked."; exit 0; fi
if [ -e "$root/.claude/skills" ]; then
  echo ".claude/skills is a real folder; move its contents to .agents/skills first." >&2
  exit 1
fi
ln -s ../.agents/skills "$root/.claude/skills"
echo ".claude/skills -> .agents/skills linked."
