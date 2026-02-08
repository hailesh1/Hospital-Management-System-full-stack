@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   ADDING PATIENT TO KEYCLOAK
echo ========================================
echo.

:: Use system Java (already confirmed working with java -version)
:: No need to set JAVA_HOME, use the Java already in PATH

:: Navigate to Keycloak bin directory
cd /d "%~dp0keycloak-23.0.3\bin"

:: Configuration
set "KC_URL=http://localhost:8180"
set "REALM=HMS"
set "ADMIN_USER=admin"
set "ADMIN_PASS=admin"

:: Patient Details
set "USERNAME=akelilu.besufekad"
set "EMAIL=akelilu@example.com"
set "FIRST_NAME=Akelilu"
set "LAST_NAME=Besufekad"
set "PASSWORD=password"

echo Patient to add:
echo   Username: %USERNAME%
echo   Email: %EMAIL%
echo   Name: %FIRST_NAME% %LAST_NAME%
echo   Password: %PASSWORD%
echo.

:: Step 1: Login to Keycloak
echo [1/3] Logging into Keycloak...
call kcadm.bat config credentials --server %KC_URL% --realm master --user %ADMIN_USER% --password %ADMIN_PASS%
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to login to Keycloak.
    echo Please make sure:
    echo   1. Keycloak is running on port 8180
    echo   2. Admin credentials are correct (admin/admin)
    echo.
    pause
    exit /b 1
)

echo [2/3] Creating user in Keycloak...
call kcadm.bat create users -r %REALM% -s username=%USERNAME% -s email=%EMAIL% -s enabled=true -s firstName=%FIRST_NAME% -s lastName=%LAST_NAME%
if %errorlevel% neq 0 (
    echo.
    echo Note: User might already exist. Continuing...
    echo.
)

echo [3/3] Setting password and role...
call kcadm.bat set-password -r %REALM% --username %USERNAME% --new-password %PASSWORD%
call kcadm.bat add-roles -r %REALM% --uusername %USERNAME% --rolename patient

echo.
echo ========================================
echo   SUCCESS!
echo ========================================
echo.
echo Login Credentials:
echo   Username: %USERNAME%
echo   Password: %PASSWORD%
echo   Email: %EMAIL%
echo.
echo You can now login at: http://localhost:3000
echo.
pause
