@echo off
:: --- FIX FOR PATHS WITH PARENTHESES ---
subst W: /d >nul 2>&1
subst W: "%~dp0."
W:
cd \

:: --- Locate Java 21 ---
set "JAVA_HOME="

:: 1. Check C:\box_tools\java21
if exist "C:\box_tools\java21\bin\java.exe" (
    if exist "C:\box_tools\java21\lib\jvm.cfg" set "JAVA_HOME=C:\box_tools\java21"
)

:: 2. Check E:\Java21
if not defined JAVA_HOME (
    for /d %%i in ("E:\Java21\jdk*") do (
        if exist "%%i\bin\java.exe" if exist "%%i\lib\jvm.cfg" set "JAVA_HOME=%%i"
    )
)

:: 3. Check E:\AT FINAL
if not defined JAVA_HOME (
    for /d %%i in ("E:\AT FINAL\jdk*") do (
        if exist "%%i\bin\java.exe" if exist "%%i\lib\jvm.cfg" set "JAVA_HOME=%%i"
    )
)

if not defined JAVA_HOME (
    echo Error: Java 21 not found or broken.
    pause
    exit /b 1
)

set "PATH=%JAVA_HOME%\bin;%PATH%"
set "KEYCLOAK_ADMIN=admin"
set "KEYCLOAK_ADMIN_PASSWORD=admin"

echo ===================================================
echo   CLEANING UP KEYCLOAK PROCESSES AND LOCKS
echo ===================================================

echo 1. Stopping any existing Java processes...
taskkill /F /IM java.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo 2. Restoring database directory and cleaning locks...
cd /d W:\keycloak-23.0.3

if exist "data\h2_temp" if not exist "data\h2" ren "data\h2_temp" "h2"

if exist "data\h2\keycloakdb.trace.db" del /f /q "data\h2\keycloakdb.trace.db"
if exist "data\h2\*.lock.db" del /f /q "data\h2\*.lock.db"

echo 2.5. Ensuring realm file is in import folder...
if not exist "data\import" mkdir "data\import"
copy /y "W:\hms-realm.json" "data\import\hms-realm.json"

echo.
echo 3. Starting Keycloak on port 8180...
echo    Realm: HMS (Import from backend\hms-realm.json)
echo.

:: Ensure we are in the bindir for execution
cd /d "W:\keycloak-23.0.3\bin"

:: Trigger registration fix in background (will wait for Keycloak to start)
start /min "" "W:\fix_keycloak_registration.bat"

:: Run Keycloak with H2 fix and realm import
:: Added --optimized to skip build phase if possible
call kc.bat start-dev --http-port 8180 --import-realm --db-url "jdbc:h2:file:../data/h2/keycloakdb;DB_CLOSE_ON_EXIT=FALSE;FILE_LOCK=SOCKET;NON_KEYWORDS=VALUE"

:: Cleanup
c:
subst W: /d
pause
