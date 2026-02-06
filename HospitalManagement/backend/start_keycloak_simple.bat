@echo off
echo ========================================
echo Starting Keycloak Server
echo ========================================
echo.

cd /d "e:\haile j\BACKEND Haile\BACKEND Hailye\BACKEND NEW LAST"

set "JAVA_HOME=E:\AT FINAL\jdk-21.0.9+10"
set "PATH=%JAVA_HOME%\bin;%PATH%"
set KEYCLOAK_ADMIN=admin
set KEYCLOAK_ADMIN_PASSWORD=admin

echo Java Home: %JAVA_HOME%
echo.
echo Starting Keycloak on port 8180...
echo This will take 1-2 minutes. Please wait...
echo.

keycloak-23.0.3\bin\kc.bat start-dev --http-port=8180 --import-realm
