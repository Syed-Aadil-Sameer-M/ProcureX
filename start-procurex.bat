@echo off

echo ════════════════════════════════════════════════════════════════
echo PROCUREX - Starting All Services
echo ════════════════════════════════════════════════════════════════

REM Check if PostgreSQL is running
echo [1/4] Checking PostgreSQL...
sc query postgresql-x64-18 | find "RUNNING" >nul
if errorlevel 1 (
    echo PostgreSQL is NOT running. Starting it...
    net start postgresql-x64-18
    timeout /t 3 /nobreak >nul
) else (
    echo PostgreSQL is already running ✓
)

REM Start Backend in a new window
echo [2/4] Starting Spring Boot Backend...
start "ProcureX Backend" cmd /k "cd /d %~dp0Backend && mvn spring-boot:run"
timeout /t 5 /nobreak >nul

REM Start Frontend in a new window
echo [3/4] Starting React Frontend...
start "ProcureX Frontend" cmd /k "cd /d %~dp0Frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo [4/4] All services started!
echo ════════════════════════════════════════════════════════════════
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo Database: localhost:5432
echo ════════════════════════════════════════════════════════════════
echo.
echo Press any key to open frontend in browser...
pause >nul
start http://localhost:5173

REM Keep this window open
echo.
echo This window can be closed. Backend and Frontend are running in separate windows.
pause