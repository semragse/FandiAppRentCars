# FandiRent Startup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting FandiRent Application" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start the backend server in a new window
Write-Host "[1/2] Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start" -WindowStyle Normal

# Wait for backend to start
Start-Sleep -Seconds 3

# Open admin page in default browser
Write-Host "[2/2] Opening Admin Page..." -ForegroundColor Yellow
Start-Process "http://127.0.0.1:5500/admin.html"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  FandiRent is ready!" -ForegroundColor Green
Write-Host "  Backend: http://localhost:3001" -ForegroundColor Green
Write-Host "  Frontend: http://127.0.0.1:5500" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
