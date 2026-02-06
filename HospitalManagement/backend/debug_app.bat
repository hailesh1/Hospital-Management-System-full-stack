@echo off
setlocal

:: --- Locate Java 21 (Portable) ---
set "INSTALL_DIR=E:\Java21"
set "FINAL_JAVA_HOME="

:: Find the exact sdk folder (e.g., jdk-21.0.6+7) inside E:\Java21
for /d %%i in ("%INSTALL_DIR%\jdk*") do set "FINAL_JAVA_HOME=%%i"

if not defined FINAL_JAVA_HOME (
    echo Error: Java 21 not found in %INSTALL_DIR%
    echo Please ensure you ran 'setup_java.bat' successfully.
    pause
    exit /b 1
)

:: --- Set Environment for this Session ---
set "JAVA_HOME=%FINAL_JAVA_HOME%"
set "PATH=%FINAL_JAVA_HOME%\bin;%PATH%"

echo ===================================================
echo   STARTING HOSPITAL MANAGEMENT BACKEND (DEBUG MODE)
echo   Java Version: 21 (Fixed)
echo ===================================================
java -version
echo.

:: --- Run Maven with full error output ---
echo Running 'mvn spring-boot:run' with full error logging...
echo Output will be saved to debug_output.txt
call mvn spring-boot:run -e -X > debug_output.txt 2>&1

echo.
echo Build finished. Check debug_output.txt for details.
pause

endlocal
