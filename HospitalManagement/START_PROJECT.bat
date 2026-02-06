@echo off
setlocal

:: ===================================================
:: HOSPITAL MANAGEMENT SYSTEM - MASTER START SCRIPT
:: ===================================================

:: 1. Set Local Environment (Just in case permanent ones haven't refreshed)
set "JAVA_HOME=C:\box_tools\java21"
set "MAVEN_HOME=C:\box_tools\maven"
set "PATH=%JAVA_HOME%\bin;%MAVEN_HOME%\bin;%PATH%"

:: 2. Project Base Path
set "PROJECT_BASE=C:\Projects\HospitalManagement"

:menu
cls
echo ===================================================
echo   HOSPITAL MANAGEMENT SYSTEM - START MENU
echo ===================================================
echo   1. Start Keycloak (Auth Server)
echo   2. Start Backend (Spring Boot)
echo   3. Start Frontend (React/Next.js)
echo   4. Start MinIO (Storage)
echo   5. Exit
echo ===================================================
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto keycloak
if "%choice%"=="2" goto backend
if "%choice%"=="3" goto frontend
if "%choice%"=="4" goto minio
if "%choice%"=="5" goto end

:keycloak
echo Starting Keycloak...
cd /d "%PROJECT_BASE%\backend"
start cmd /k "call start_keycloak.bat"
goto menu

:backend
echo Starting Backend...
cd /d "%PROJECT_BASE%\backend"
start cmd /k "run_app.bat"
goto menu

:frontend
echo Starting Frontend...
cd /d "%PROJECT_BASE%\frontend"
start cmd /k "npm run dev"
goto menu

:minio
echo Starting MinIO...
cd /d "%PROJECT_BASE%\backend"
start cmd /k "start_minio.bat"
goto menu

:end
echo Goodbye!
pause
exit /b
