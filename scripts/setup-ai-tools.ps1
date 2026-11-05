# Links Claude Code skills to the shared skills folder (.agents/skills).
# Run once per clone:  powershell -ExecutionPolicy Bypass -File scripts/setup-ai-tools.ps1
# The graphify hooks in .claude/settings.json are no-ops when the graphify CLI is
# not installed, so graphify is optional; install it only if you want graph queries.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$source = Join-Path $root '.agents\skills'
$claudeDir = Join-Path $root '.claude'
$link = Join-Path $claudeDir 'skills'

if (-not (Test-Path $source)) { throw "Missing $source" }
if (-not (Test-Path $claudeDir)) { New-Item -ItemType Directory -Path $claudeDir | Out-Null }

if (Test-Path $link) {
  $item = Get-Item $link -Force
  if ($item.LinkType) { Write-Host '.claude/skills already linked.'; exit 0 }
  throw '.claude/skills exists and is a real folder. Move its contents to .agents/skills, then delete it and re-run.'
}

# Junctions need no admin rights on Windows.
New-Item -ItemType Junction -Path $link -Target $source | Out-Null
Write-Host '.claude/skills -> .agents/skills linked.'
