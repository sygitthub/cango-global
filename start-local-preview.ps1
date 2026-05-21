param(
  [switch]$Check
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

$BundledNode = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$Node = $null

if (Test-Path $BundledNode) {
  $Node = $BundledNode
} else {
  $Node = (Get-Command node -ErrorAction SilentlyContinue).Source
}

if (-not $Node) {
  Write-Host "Node.js was not found."
  Write-Host "Install it with:"
  Write-Host "  winget install -e --id OpenJS.NodeJS.LTS"
  exit 1
}

Set-Location $ProjectRoot

if ($Check) {
  & $Node --check "scripts/local-preview.mjs"
  Write-Host "Local preview is ready."
  Write-Host "Start it with:"
  Write-Host "  powershell -ExecutionPolicy Bypass -File .\start-local-preview.ps1"
  exit 0
}

Write-Host "Starting local preview..."
Write-Host "Open: http://localhost:4173/"
Write-Host "Keep this terminal open. Press Ctrl+C to stop."
& $Node "scripts/local-preview.mjs"
