@echo off
setlocal
set "JAVA_HOME=C:\box_tools\java21"
set "PATH=%JAVA_HOME%\bin;%PATH%"
cd /d "%~dp0keycloak-23.0.3\bin"

echo Waiting for Keycloak to be ready on port 8180...
:wait_loop
powershell -Command "$t = New-Object Net.Sockets.TcpClient; try { $t.Connect('127.0.0.1', 8180); exit 0 } catch { exit 1 } finally { $t.Dispose() }"
if %errorlevel% neq 0 (
    timeout /t 2 /nobreak >nul
    goto wait_loop
)

echo Keycloak is up. Logging in...
call kcadm.bat config credentials --server http://localhost:8180 --realm master --user admin --password admin

echo Enabling registration for realm HMS...
call kcadm.bat update realms/HMS -s registrationAllowed=true -s resetPasswordAllowed=true

echo Registration enabled successfully!
timeout /t 5
exit

