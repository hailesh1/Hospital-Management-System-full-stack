@echo off
cd /d "%~dp0"

echo ==========================================
echo   FIXING KEYCLOAK ROLES ^& PERMISSIONS
echo ==========================================

if not exist "frontend" (
    echo [ERROR] Could not find 'frontend' directory.
    echo Current dir: %CD%
    pause
    exit /b 1
)

cd frontend

if not exist "setup_keycloak_roles.js" (
    echo [ERROR] Could not find setup_keycloak_roles.js
    pause
    exit /b 1
)

echo Running setup script...
node setup_keycloak_roles.js

echo.
echo ==========================================
echo   DONE! Please try logging in now.
echo ==========================================
pause
