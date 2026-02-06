@echo off
setlocal enabledelayedexpansion

:: --- Configuration ---
set "KC_URL=http://127.0.0.1:8180"
set "APP_URL=http://localhost:8080/api"
set "REALM=hospital-realm"
set "CLIENT=hospital-client"
set "USER=test_blocked"
set "PASS=1234"

echo ===================================================
echo   AUTHENTICATION TEST: KEYCLOAK + BACKEND
echo ===================================================

:: 1. Pre-check with Curl (Verbose)
echo 1. Attempting connection with Curl...
curl -v %KC_URL%/realms/%REALM%/.well-known/openid-configuration --max-time 10
echo.

:: 2. Get Token from Keycloak
echo 2. Requesting token from Keycloak for user: %USER%...
set "TEMP_TOKEN_FILE=%TEMP%\kc_token.txt"
powershell -Command "try { $resp = Invoke-RestMethod -Uri '%KC_URL%/realms/%REALM%/protocol/openid-connect/token' -Method Post -TimeoutSec 10 -ContentType 'application/x-www-form-urlencoded' -Body @{ grant_type='password'; client_id='%CLIENT%'; username='%USER%'; password='%PASS%' }; $resp.access_token | Out-File -FilePath '%TEMP_TOKEN_FILE%' -Encoding ascii } catch { Write-Host '--- KEYCLOAK ERROR ---'; Write-Host $_.Exception.Message; if ($_.Exception.Response) { $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream()); $body = $reader.ReadToEnd(); Write-Host $body }; exit 1 }"

if %errorlevel% neq 0 (
    echo.
    echo Error: Keycloak refused the login. 
    echo Check if 'Direct Access Grants' is enabled in the Client settings.
    del "%TEMP_TOKEN_FILE%" 2>nul
    pause
    exit /b 1
)

set /p TOKEN=<"%TEMP_TOKEN_FILE%"
del "%TEMP_TOKEN_FILE%" 2>nul

if "!TOKEN!"=="" (
    echo Error: Token file was empty.
    pause
    exit /b 1
)

echo Token received!
echo.

:: 2. Call Backend API
echo 2. Calling Backend API: %APP_URL%/staff...
powershell -Command "$headers = @{ Authorization = 'Bearer !TOKEN!' }; try { $resp = Invoke-RestMethod -Uri '%APP_URL%/staff' -Headers $headers; $resp | ConvertTo-Json } catch { $_.Exception.Message; exit 1 }"

if %errorlevel% neq 0 (
    echo Error: API call failed. Check if Spring Boot is running.
) else (
    echo.
    echo ===================================================
    echo   SUCCESS! Backend authenticated the request.
    echo ===================================================
)

echo.
pause
endlocal
