@echo off
setlocal
echo ===================================================
echo   KEYCLOAK DATA RESET (NUCLEAR OPTION)
echo ===================================================
echo WARNING: This will delete all Keycloak users and settings!
echo The HMS realm will be re-imported from hms-realm.json on next start.
echo.
set /p confirm="Are you sure you want to reset Keycloak? (y/n): "

if /i "%confirm%" neq "y" (
    echo Reset cancelled.
    pause
    exit /b
)

echo 1. Stopping Java processes...
taskkill /F /IM java.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo 2. Deleting H2 database directory...
if exist "keycloak-23.0.3\data\h2" (
    rd /s /q "keycloak-23.0.3\data\h2"
    echo Database cleared.
) else (
    echo Database directory not found, nothing to clear.
)

echo.
echo SUCCESS: Keycloak data reset.
echo Now run START_PROJECT.bat and select Option 1 to start fresh.
pause
endlocal
