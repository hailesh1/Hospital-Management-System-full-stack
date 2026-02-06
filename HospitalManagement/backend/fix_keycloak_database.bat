@echo off
echo ========================================
echo Keycloak Database Cleanup Script
echo ========================================
echo.
echo This will delete Keycloak's database and start fresh.
echo You will need to recreate users after this.
echo.
pause

cd /d "e:\haile j\BACKEND Haile\BACKEND Hailye\BACKEND NEW LAST\keycloak-23.0.3"

echo Stopping any running Keycloak processes...
taskkill /F /IM java.exe /FI "WINDOWTITLE eq Keycloak*" 2>nul

echo Deleting corrupted database...
if exist "data" (
    rmdir /s /q data
    echo Database deleted successfully.
) else (
    echo No data directory found.
)

echo.
echo ========================================
echo Cleanup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Run: start_keycloak.bat
echo 2. Wait for Keycloak to start
echo 3. Run: keycloak-23.0.3\bin\create_users.bat
echo.
pause
