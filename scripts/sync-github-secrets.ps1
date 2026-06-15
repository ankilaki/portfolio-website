# Sync Firebase env vars from .env to GitHub Actions secrets.
# Usage:
#   1. Create a GitHub PAT: https://github.com/settings/tokens
#      Scopes needed: repo (classic) OR fine-grained with "Secrets" read/write on this repo.
#   2. Run:
#        $env:GH_TOKEN = "ghp_..."
#        .\scripts\sync-github-secrets.ps1
#
# Alternative to browser-based `gh auth login`, which often fails in IDE terminals.

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$envFile = Join-Path $repoRoot ".env"

if (-not (Test-Path $envFile)) {
  Write-Error ".env not found at $envFile"
}

if (-not $env:GH_TOKEN) {
  Write-Error @"
GH_TOKEN is not set.

Create a token at https://github.com/settings/tokens then run:
  `$env:GH_TOKEN = "ghp_your_token_here"
  .\scripts\sync-github-secrets.ps1
"@
}

$gh = Get-Command gh -ErrorAction SilentlyContinue
if (-not $gh) {
  Write-Error "GitHub CLI (gh) is not installed. Install from https://cli.github.com/ or use the GitHub web UI."
}

$env:GH_TOKEN | gh auth login --with-token | Out-Null

$secretKeys = @(
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID"
)

$values = @{}
Get-Content $envFile | ForEach-Object {
  $line = $_.Trim()
  if (-not $line -or $line.StartsWith("#")) { return }
  $eq = $line.IndexOf("=")
  if ($eq -lt 1) { return }
  $key = $line.Substring(0, $eq).Trim()
  $value = $line.Substring($eq + 1).Trim()
  $values[$key] = $value
}

$missing = @($secretKeys | Where-Object { -not $values[$_] })
if ($missing.Count -gt 0) {
  Write-Error "Missing keys in .env:`n  $($missing -join "`n  ")"
}

Write-Host "Setting GitHub Actions secrets for ankilaki/portfolio-website ..."

foreach ($key in $secretKeys) {
  $values[$key] | gh secret set $key --repo ankilaki/portfolio-website
  Write-Host "  OK  $key"
}

Write-Host ""
Write-Host "Done. Secrets are set. Push to main to trigger a deploy."
gh secret list --repo ankilaki/portfolio-website
