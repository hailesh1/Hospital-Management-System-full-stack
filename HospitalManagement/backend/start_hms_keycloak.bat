@echo off
setlocal

echo ===================================================
echo   STARTING KEYCLOAK WITH HMS REALM AUTO-IMPORT
echo ===================================================

:: Define paths
set "CURRENT_DIR=%~dp0"
set "KC_DIR=%CURRENT_DIR%keycloak-23.0.3"
set "IMPORT_DIR=%KC_DIR%\data\import"
set "REALM_JSON=%CURRENT_DIR%hms-realm.json"

:: Check if hms-realm.json exists
if not exist "%REALM_JSON%" (
    echo ERROR: hms-realm.json not found in %CURRENT_DIR%
    pause
    exit /b 1
)

:: Create import directory if it doesn't exist
if not exist "%IMPORT_DIR%" (
    echo Creating import directory: %IMPORT_DIR%
    mkdir "%IMPORT_DIR%"
)

:: Copy realm file to import directory
echo Copying realm configuration to import folder...
copy /Y "%REALM_JSON%" "%IMPORT_DIR%\" >nul
if %errorlevel% neq 0 (
    echo ERROR: Failed to copy hms-realm.json
    pause
    exit /b 1
)

:: Set Java Home (Using the logic from your other scripts)
set "JAVA_HOME=E:\AT FINAL\jdk-21.0.9+10"
if exist "%JAVA_HOME%" (
    set "PATH=%JAVA_HOME%\bin;%PATH%"
) else (
    :: Fallback check
    set "JAVA_21_DIR=E:\Java21"
    for /d %%i in ("%JAVA_21_DIR%\jdk*") do set "JAVA_HOME=%%i"
    if defined JAVA_HOME set "PATH=!JAVA_HOME!\bin;%PATH%"
)

echo Starting Keycloak...
echo Admin Console: http://localhost:8180/admin/
echo.

cd /d "%KC_DIR%\bin"
call kc.bat start-dev --http-port 8180 --import-realm

pause
endlocal
