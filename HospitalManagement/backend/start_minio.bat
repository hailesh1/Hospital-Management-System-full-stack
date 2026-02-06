@echo off
setlocal

:: Settings
set "MINIO_EXE=minio.exe"
set "MINIO_URL=https://dl.min.io/server/minio/release/windows-amd64/minio.exe"
set "MINIO_DATA=e:\minio_data"
set "MINIO_PORT=9000"
set "MINIO_CONSOLE_PORT=9001"
set "MINIO_ROOT_USER=minioadmin"
set "MINIO_ROOT_PASSWORD=minioadmin"

:: 1. Check if MinIO exists
if not exist "%MINIO_EXE%" (
    echo MinIO executable not found. Downloading...
    powershell -Command "Invoke-WebRequest -Uri '%MINIO_URL%' -OutFile '%MINIO_EXE%'"
    if %errorlevel% neq 0 (
        echo Error: Failed to download MinIO. Please download it manually from %MINIO_URL%
        pause
        exit /b 1
    )
)

:: 2. Create data directory if it doesn't exist
if not exist "%MINIO_DATA%" (
    echo Creating data directory: %MINIO_DATA%
    mkdir "%MINIO_DATA%"
)

:: 3. Start MinIO
echo Starting MinIO Server...
echo Endpoint: http://localhost:%MINIO_PORT%
echo Console:  http://localhost:%MINIO_CONSOLE_PORT%
echo Username: %MINIO_ROOT_USER%
echo Password: %MINIO_ROOT_PASSWORD%
echo.

set "MINIO_ROOT_USER=%MINIO_ROOT_USER%"
set "MINIO_ROOT_PASSWORD=%MINIO_ROOT_PASSWORD%"

"%MINIO_EXE%" server "%MINIO_DATA%" --address ":%MINIO_PORT%" --console-address ":%MINIO_CONSOLE_PORT%"

pause
endlocal
