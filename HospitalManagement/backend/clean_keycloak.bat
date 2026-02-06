@echo off
setlocal

echo ===================================================
echo   CLEANING KEYCLOAK DATABASE
echo ===================================================

set "KC_DIR=keycloak-23.0.3"
set "DATA_DIR=%KC_DIR%\data\h2"

if exist "%DATA_DIR%" (
    echo Found Keycloak data directory.
    echo Removing "%DATA_DIR%" to fix lock/corruption...
    
    rmdir /s /q "%DATA_DIR%"
    if exist "%KC_DIR%\data\import" (
        echo Removing import directory...
        rmdir /s /q "%KC_DIR%\data\import"
    )
    
    if exist "%DATA_DIR%" (
        echo.
        echo ERROR: Could not delete the data folder.
        echo This means a Java process is still holding the file lock.
        echo.
        echo PLEASE TYPE THIS COMMAND to kill all Java processes - or restart your computer:
        echo taskkill /f /im java.exe
        echo.
        pause
        exit /b 1
    ) else (
        echo.
        echo SUCCESS: Database files removed.
        echo You can now run 'start_keycloak.bat' again.
        echo.
    )
) else (
    echo Data directory already clean.
)

endlocal
