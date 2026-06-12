@echo off
setlocal enabledelayedexpansion

echo ════════════════════════════════════════════════════════════════
echo PROCUREX - Starting All Services (Local Mode - No Docker)
echo ════════════════════════════════════════════════════════════════

REM Check if PostgreSQL service is running (local Windows service)
echo [1/5] Checking PostgreSQL service...
sc query postgresql-x64-18 | find "RUNNING" >nul
if errorlevel 1 (
    echo PostgreSQL is NOT running. Attempting to start local PostgreSQL service...
    net start postgresql-x64-18 >nul 2>&1
    if errorlevel 1 (
        echo Could not start PostgreSQL service automatically. Please ensure PostgreSQL is installed and the service name is correct.
        echo You can still continue; backend will attempt to connect to localhost:5432.
    ) else (
        echo PostgreSQL service started ✓
        timeout /t 2 /nobreak >nul
    )
) else (
    echo PostgreSQL is already running ✓
)

REM Kill any existing Java processes on port 8080 to avoid "Address already in use" errors
echo [2/5] Cleaning up any existing Java processes...
taskkill /F /IM java.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Start Backend in a new window
echo [3/5] Starting Spring Boot Backend...
echo Backend will run on http://localhost:8080
start "ProcureX Backend" cmd /k "cd /d %~dp0Backend && set DB_URL=jdbc:postgresql://localhost:5432/ProcureX_DB && set DB_USERNAME=postgres && set DB_PASSWORD=aadil@123 && mvn spring-boot:run"
timeout /t 10 /nobreak >nul

REM Start Frontend in a new window
echo [4/5] Starting React Frontend...
echo Frontend will run on http://localhost:5173
start "ProcureX Frontend" cmd /k "cd /d %~dp0Frontend && npm run dev"
timeout /t 5 /nobreak >nul

echo [5/5] All services starting...
echo ════════════════════════════════════════════════════════════════
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo Database: localhost:5432 (postgres / aadil@123)
echo ════════════════════════════════════════════════════════════════
echo.
echo Waiting for services to fully initialize (30 seconds)...
timeout /t 30 /nobreak >nul

echo.
echo Opening frontend in browser...
start http://localhost:5173

echo.
echo This window can be closed. Backend and Frontend are running in separate windows.
echo ════════════════════════════════════════════════════════════════
pause