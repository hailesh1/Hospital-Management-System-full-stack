@echo off
set "JAVA_HOME=C:\box_tools\java21"
set "PATH=%JAVA_HOME%\bin;%PATH%"
cd /d "c:\Projects\HospitalManagement\backend"

:: Stop any existing Java processes
taskkill /F /IM java.exe /T 2>nul
timeout /t 2 /nobreak >nul

:: Cleanup locks
cd /d "c:\Projects\HospitalManagement\backend\keycloak-23.0.3"
if exist "data\h2\keycloakdb.trace.db" del /f /q "data\h2\keycloakdb.trace.db"
if exist "data\h2\*.lock.db" del /f /q "data\h2\*.lock.db"

:: Start Keycloak
cd /d "c:\Projects\HospitalManagement\backend\keycloak-23.0.3\bin"

:: Trigger registration fix in background (will wait for Keycloak to start)
start /min "" "c:\Projects\HospitalManagement\backend\fix_keycloak_registration.bat"

call kc.bat start-dev --http-port 8180 --import-realm --db-url "jdbc:h2:file:../data/h2/keycloakdb;DB_CLOSE_ON_EXIT=FALSE;FILE_LOCK=SOCKET;NON_KEYWORDS=VALUE"
