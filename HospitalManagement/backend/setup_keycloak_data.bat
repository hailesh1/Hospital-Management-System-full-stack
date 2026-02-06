@echo off
setlocal enabledelayedexpansion

:: --- 1. Fix Broken System PATH ---
set "SYSTEM_PATH=C:\Windows\System32;C:\Windows;C:\Windows\System32\Wbem;C:\Windows\System32\WindowsPowerShell\v1.0"
set "PATH=%SYSTEM_PATH%;%PATH%"

:: --- 2. Locate Java 21 (Portable) ---
set "JAVA_HOME="

:: Check E:\AT FINAL (User's reported path)
set "JAVA_21_DIR_ALT=E:\AT FINAL"
for /d %%i in ("%JAVA_21_DIR_ALT%\jdk*") do set "JAVA_HOME=%%i"

:: If not found, check E:\Java21
if not defined JAVA_HOME (
    set "JAVA_21_DIR=E:\Java21"
    for /d %%i in ("%JAVA_21_DIR%\jdk*") do set "JAVA_HOME=%%i"
)

if defined JAVA_HOME (
    echo Using Portable Java 21: !JAVA_HOME!
    set "PATH=!JAVA_HOME!\bin;%PATH%"
) else (
    echo Error: Java 21 not found in %JAVA_21_DIR%. Please run setup_java.bat first.
    pause
    exit /b 1
)

:: --- 3. Configuration ---
set "KC_DIR=keycloak-23.0.3"
set "KC_ADM=%KC_DIR%\bin\kcadm.bat"
set "KC_URL=http://127.0.0.1:8180"
set "KC_ADMIN=admin"
set "KC_PASS=admin"

set "REALM=hospital-realm"
set "CLIENT=hospital-client"

echo ===================================================
echo   KEYCLOAK DATA CONFIGURATION
echo ===================================================

:: 1. Check if Keycloak is running
echo Checking if Keycloak is available at %KC_URL%...
:: Try simple socket check first, then WebRequest
powershell -Command "$t = New-Object Net.Sockets.TcpClient; try { $t.Connect('127.0.0.1', 8180); exit 0 } catch { exit 1 } finally { $t.Dispose() }"
if %errorlevel% neq 0 (
    echo.
    echo Error: Could not connect to Keycloak on port 8180.
    echo Please make sure the other window says 'Listening on: http://0.0.0.0:8180'.
    echo.
    pause
    exit /b 1
)

:: 2. Login
echo Logging in as %KC_ADMIN%...
call "%KC_ADM%" config credentials --server %KC_URL% --realm master --user %KC_ADMIN% --password %KC_PASS%
if %errorlevel% neq 0 (
    echo Error: Failed to login to Keycloak.
    pause
    exit /b 1
)

:: 3. Create Realm
echo Creating realm: %REALM%...
call "%KC_ADM%" create realms -s realm=%REALM% -s enabled=true
if %errorlevel% neq 0 (
    echo (Realm might already exist, skipping...)
)

:: 4. Create Client
echo Creating client: %CLIENT%...
call "%KC_ADM%" create clients -r %REALM% -s clientId=%CLIENT% -s publicClient=true -s directAccessGrantsEnabled=true -s "redirectUris=[\"*\"]" -s "webOrigins=[\"*\"]" -s enabled=true
if %errorlevel% neq 0 (
    echo (Client might already exist, skipping...)
)

:: 5. Create Roles
echo Creating roles...
for %%r in (ADMIN DOCTOR RECEPTIONIST NURSE) do (
    echo Creating role: %%r...
    call "%KC_ADM%" create roles -r %REALM% -s name=%%r
)

:: 6. Create Test User
echo Creating test user: hospital_admin...
call "%KC_ADM%" create users -r %REALM% -s username=hospital_admin -s enabled=true -s firstName=Admin -s lastName=User
call "%KC_ADM%" set-password -r %REALM% --username hospital_admin --new-password password
call "%KC_ADM%" add-roles -r %REALM% --uusername hospital_admin --rolename ADMIN

echo.
echo ===================================================
echo   CONFIGURATION FINISHED SUCCESSFULY!
echo ===================================================
echo Realm: %REALM%
echo Client: %CLIENT%
echo Test User: hospital_admin / password
echo.
pause
endlocal
