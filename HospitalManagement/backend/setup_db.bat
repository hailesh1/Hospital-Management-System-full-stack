@echo off
setlocal

echo ===================================================
echo   INITIALIZING HOSPITAL DATABASE
echo ===================================================

set "PSQL=C:\Program Files\PostgreSQL\18\bin\psql.exe"
if not exist "%PSQL%" (
    :: Fallback to older version if 18 not found (though we found it)
    set "PSQL=C:\Program Files\PostgreSQL\13\bin\psql.exe"
)

if not exist "%PSQL%" (
    echo Error: psql.exe not found. Is PostgreSQL installed?
    pause
    exit /b 1
)

echo Found psql at: "%PSQL%"
echo.
echo Please enter your main PostgreSQL password (for user 'postgres') when prompted.
echo.

:: 1. Create User
"%PSQL%" -U postgres -c "CREATE USER hospital_user WITH PASSWORD '1234';" 
if %errorlevel% neq 0 (
    echo.
    echo (If it says 'role "hospital_user" already exists', that is fine.)
)

:: 2. Create Database
"%PSQL%" -U postgres -c "CREATE DATABASE hospital_management OWNER hospital_user;"
if %errorlevel% neq 0 (
    echo.
    echo (If it says 'database "hospital_management" already exists', that is fine.)
)

:: 3. Ensure Permissions
echo Granting permissions...
"%PSQL%" -U postgres -d hospital_management -c "GRANT ALL PRIVILEGES ON DATABASE hospital_management TO hospital_user;"
"%PSQL%" -U postgres -d hospital_management -c "GRANT ALL ON SCHEMA public TO hospital_user;"
"%PSQL%" -U postgres -d hospital_management -c "ALTER SCHEMA public OWNER TO hospital_user;"

echo.
echo Database setup attempt finished.
echo If you saw "CREATE ROLE", "CREATE DATABASE", and "ALTER SCHEMA", you are good!
echo.
pause
