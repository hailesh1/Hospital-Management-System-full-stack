@echo off
setlocal

echo ===================================================
echo   KEYCLOAK MASTER RECOVERY & STARTUP SCRIPT
echo ===================================================

:: 1. Force kill ANY existing Java processes to release file locks
echo 1. Stopping any existing Java processes...
taskkill /F /IM java.exe /T 2>nul
timeout /t 2 /nobreak >nul

:: 2. Handle Path Mapping (Subst) only if necessary
set "BASE_DIR=%~dp0"
set "USE_SUBST=0"
echo %BASE_DIR% | findstr /R "[()#]" >nul && set "USE_SUBST=1"

if "%USE_SUBST%"=="1" (
    echo 2. Special characters detected. Mapping drive W:...
    subst W: /d >nul 2>&1
    subst W: "%BASE_DIR%."
    if errorlevel 1 (
        set "WORK_ROOT=%BASE_DIR%"
    ) else (
        W:
        cd \
        set "WORK_ROOT=W:\"
    )
) else (
    echo 2. Path is safe. Using local directory.
    cd /d "%BASE_DIR%"
    set "WORK_ROOT=%BASE_DIR%"
)

:: Define relative paths from WORK_ROOT
set "KC_HOME=%WORK_ROOT%keycloak-23.0.3"
set "KC_DATA=%KC_HOME%\data"
set "KC_BIN=%KC_HOME%\bin"

:: 3. Wipe Corrupted/Locked Database
echo 3. Cleaning Keycloak database and temporary files...
if exist "%KC_DATA%\h2" (
    echo    Removing database at %KC_DATA%\h2...
    rmdir /s /q "%KC_DATA%\h2"
)
if exist "%KC_DATA%\h2" (
    echo [ERROR] Could not delete data\h2. Locked by another process?
    pause
    exit /b 1
)
mkdir "%KC_DATA%\h2"

if exist "%KC_DATA%\import" (
    rmdir /s /q "%KC_DATA%\import"
)
mkdir "%KC_DATA%\import"

:: 4. Re-import Realm Data
echo 4. Preparing realm for import...
if exist "%WORK_ROOT%hms-realm.json" (
    copy /y "%WORK_ROOT%hms-realm.json" "%KC_DATA%\import\hms-realm.json" >nul
    echo    Realm file copied to import folder.
) else (
    echo [ERROR] hms-realm.json not found in %WORK_ROOT%
    pause
    exit /b 1
)

:: 5. Start Keycloak
echo 5. Starting Keycloak on port 8180...
echo.

cd /d "%KC_BIN%"

:: Force a clean import by using start-dev with --import-realm
call kc.bat start-dev --http-port 8180 --import-realm --db-url "jdbc:h2:file:../data/h2/keycloakdb;DB_CLOSE_ON_EXIT=FALSE;FILE_LOCK=SOCKET;NON_KEYWORDS=VALUE"

echo.
echo ===================================================
echo   KEYCLOAK HAS STOPPED
echo ===================================================
if "%USE_SUBST%"=="1" (
    c:
    subst W: /d >nul 2>&1
)
pause
