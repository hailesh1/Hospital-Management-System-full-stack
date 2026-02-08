@echo off
setlocal enabledelayedexpansion

:: Configuration
set "KEYCLOAK_DIR=C:\Users\zyegeni\.gemini\antigravity\keycloak"
set "JAVA_HOME=E:\Java21"
set "PATH=%JAVA_HOME%\bin;%PATH%"

:: User Details
set "USERNAME=akelilu"
set "PASSWORD=password123"
set "FIRST_NAME=Akelilu"
set "LAST_NAME=Besufekad"
set "EMAIL=akelilu@example.com"
set "REALM=HMS"

echo ========================================================
echo Creating Keycloak User: %USERNAME%
echo ========================================================

:: Check if Keycloak is running
curl -s http://localhost:8180/health >nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Keycloak is NOT running on port 8180.
    echo Please start Keycloak first.
    exit /b 1
)

:: Get Admin Token
echo [1/4] Authenticating as admin...
for /f "tokens=*" %%a in ('curl -s -d "client_id=admin-cli" -d "username=admin" -d "password=admin" -d "grant_type=password" "http://localhost:8180/realms/master/protocol/openid-connect/token" ^| jq -r ".access_token"') do set "ADMIN_TOKEN=%%a"

if "%ADMIN_TOKEN%"=="null" (
    echo [ERROR] Failed to get admin token. Check Keycloak admin credentials.
    exit /b 1
)

:: Create User
echo [2/4] Creating user...
curl -s -X POST "http://localhost:8180/admin/realms/%REALM%/users" ^
    -H "Authorization: Bearer %ADMIN_TOKEN%" ^
    -H "Content-Type: application/json" ^
    -d "{\"username\": \"%USERNAME%\", \"firstName\": \"%FIRST_NAME%\", \"lastName\": \"%LAST_NAME%\", \"email\": \"%EMAIL%\", \"enabled\": true, \"emailVerified\": true}"

:: Get User ID
echo [3/4] Fetching User ID...
for /f "tokens=*" %%i in ('curl -s -X GET "http://localhost:8180/admin/realms/%REALM%/users?username=%USERNAME%" -H "Authorization: Bearer %ADMIN_TOKEN%" ^| jq -r ".[0].id"') do set "USER_ID=%%i"

if "%USER_ID%"=="null" (
    echo [ERROR] Failed to retrieve User ID.
    exit /b 1
)
echo    User ID: %USER_ID%

:: Set Password
echo [4/4] Setting password...
curl -s -X PUT "http://localhost:8180/admin/realms/%REALM%/users/%USER_ID%/reset-password" ^
    -H "Authorization: Bearer %ADMIN_TOKEN%" ^
    -H "Content-Type: application/json" ^
    -d "{\"type\": \"password\", \"value\": \"%PASSWORD%\", \"temporary\": false}"

echo.
echo ========================================================
echo ✅ SUCCESS! User '%USERNAME%' created.
echo 🆔 Keycloak UUID: %USER_ID%
echo 🔑 Password: %PASSWORD%
echo ========================================================
echo.

:: AUTO-SYNC TO DATABASE
echo [SYNC] Updating local database to match Keycloak ID...
cd c:\Projects\HospitalManagement\frontend
node -e "const { query } = require('./lib/db'); async function sync() { await query(\"UPDATE patients SET id = '%USER_ID%' WHERE email = '%EMAIL%'\"); await query(\"UPDATE medical_records SET patient_id = '%USER_ID%' WHERE patient_id = (SELECT id FROM patients WHERE email = '%EMAIL%' LIMIT 1) OR patient_id = 'dev-akelilu@example.com'\"); console.log('Database synced!'); process.exit(0); } sync();"

pause
