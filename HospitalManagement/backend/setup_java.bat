@echo off
setlocal

echo ===================================================
echo   AUTOMATED JAVA 21 SETUP FOR KEYCLOAK
echo ===================================================

set "JAVA_ZIP_URL=https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.6%%2B7/OpenJDK21U-jdk_x64_windows_hotspot_21.0.6_7.zip"
set "INSTALL_DIR=E:\Java21"
set "JAVA_ZIP=E:\java21.zip"
set "POWERSHELL_CMD=C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe"

if not exist "%POWERSHELL_CMD%" (
    echo Error: PowerShell not found. Cannot proceed.
    pause
    exit /b 1
)

if not exist "%INSTALL_DIR%" (
    echo [1/3] Creating installation directory at %INSTALL_DIR%...
    mkdir "%INSTALL_DIR%"
)

if not exist "%INSTALL_DIR%\bin\java.exe" (
    echo [2/3] Downloading Java 21...
    "%POWERSHELL_CMD%" -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%JAVA_ZIP_URL%' -OutFile '%JAVA_ZIP%'"
    
    if not exist "%JAVA_ZIP%" (
        echo Error: Download failed.
        pause
        exit /b 1
    )

    echo [3/3] Extracting Java...
    "%POWERSHELL_CMD%" -Command "Expand-Archive -Path '%JAVA_ZIP%' -DestinationPath '%INSTALL_DIR%' -Force"
    
    echo Cleaning up...
    del "%JAVA_ZIP%"
) else (
    echo Java 21 is already installed at %INSTALL_DIR%
)

:: Find the exact inner directory (since zip usually contains a root folder)
set "FINAL_JAVA_HOME="
for /d %%i in ("%INSTALL_DIR%\jdk*") do set "FINAL_JAVA_HOME=%%i"

if defined FINAL_JAVA_HOME (
    echo.
    echo SUCCESS: Java installed at %FINAL_JAVA_HOME%
    echo Starting Keycloak...
    echo.
    
    set "JAVA_HOME=%FINAL_JAVA_HOME%"
    set "PATH=%FINAL_JAVA_HOME%\bin;%PATH%"
    
    call start_keycloak.bat
) else (
    echo Error: Could not find JDK folder in %INSTALL_DIR%
    pause
)

endlocal
