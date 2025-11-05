@echo off
echo ========================================
echo   Starting FandiRent Application
echo ========================================
echo.

REM Start the backend server
echo [1/2] Starting Backend Server...
cd backend
start "FandiRent Backend" cmd /k "npm start"
cd ..

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak >nul

REM Open the admin page in default browser
echo [2/2] Opening Admin Page...
start http://127.0.0.1:5500/admin.html

echo.
echo ========================================
echo   FandiRent is ready!
echo   Backend: http://localhost:3001
echo   Frontend: http://127.0.0.1:5500
echo ========================================
echo.
echo Press any key to close this window...
pause >nul
