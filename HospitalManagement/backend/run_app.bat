@echo off
setlocal

:: --- FIX FOR PATHS WITH PARENTHESES ---
subst V: /d >nul 2>&1
subst V: "%~dp0."
V:
cd \

:: --- Locate Java 21 (Portable) ---
set "FINAL_JAVA_HOME="

:: 1. Check C:\box_tools\java21 (Most stable location)
if exist "C:\box_tools\java21\bin\java.exe" (
    if exist "C:\box_tools\java21\lib\jvm.cfg" set "FINAL_JAVA_HOME=C:\box_tools\java21"
)

:: 2. Check E:\Java21
if not defined FINAL_JAVA_HOME (
    set "INSTALL_DIR=E:\Java21"
    for /d %%i in ("%INSTALL_DIR%\jdk*") do (
        if exist "%%i\bin\java.exe" if exist "%%i\lib\jvm.cfg" set "FINAL_JAVA_HOME=%%i"
    )
)

:: 3. Check E:\AT FINAL (User's reported path, often broken)
if not defined FINAL_JAVA_HOME (
    set "INSTALL_DIR_ALT=E:\AT FINAL"
    for /d %%i in ("%INSTALL_DIR_ALT%\jdk*") do (
        if exist "%%i\bin\java.exe" if exist "%%i\lib\jvm.cfg" set "FINAL_JAVA_HOME=%%i"
    )
)

if not defined FINAL_JAVA_HOME (
    echo Error: Valid Java 21 installation not found!
    echo Checked: C:\box_tools\java21, E:\Java21, and E:\AT FINAL
    echo Please ensure Java 21 is correctly installed.
    pause
    exit /b 1
)

:: --- Set Environment for this Session ---
set "JAVA_HOME=%FINAL_JAVA_HOME%"
set "PATH=%FINAL_JAVA_HOME%\bin;%PATH%"

echo ===================================================
echo   STARTING HOSPITAL MANAGEMENT BACKEND
echo   Java Version: 21 (Fixed)
echo ===================================================
java -version
echo.

:: --- Run Maven ---
echo Running 'mvn spring-boot:run'...
call mvn spring-boot:run

:: Cleanup
c:
subst V: /d
endlocal
