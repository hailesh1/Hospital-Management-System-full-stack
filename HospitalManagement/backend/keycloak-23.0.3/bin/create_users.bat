@echo off
set "JAVA_HOME=E:\AT FINAL\jdk-21.0.9+10"
set "PATH=%JAVA_HOME%\bin;%PATH%"
cd /d "e:\haile j\BACKEND Haile\BACKEND Hailye\BACKEND NEW LAST\keycloak-23.0.3\bin"

echo Logging into Keycloak...
call kcadm.bat config credentials --server http://localhost:8180 --realm master --user admin --password admin
if %errorlevel% neq 0 (
    echo Failed to log in to Keycloak. Make sure Keycloak is running on port 8180.
    exit /b %errorlevel%
)

set "REALM=HMS"
set "PASS=password"

echo Creating Admin User...
call kcadm.bat create users -r %REALM% -s username=admin -s email=admin@hms.com -s enabled=true -s firstName=Admin -s lastName=System
call kcadm.bat set-password -r %REALM% --username admin --new-password %PASS%
call kcadm.bat add-roles -r %REALM% --uusername admin --rolename admin

echo Creating Doctor Users...
call kcadm.bat create users -r %REALM% -s username=hiwot.ketma -s email=hiwot.ketma@hms.com -s enabled=true -s firstName=Hiwot -s lastName=Ketma
call kcadm.bat set-password -r %REALM% --username hiwot.ketma --new-password %PASS%
call kcadm.bat add-roles -r %REALM% --uusername hiwot.ketma --rolename doctor

call kcadm.bat create users -r %REALM% -s username=dawit.kebede -s email=dawit.kebede@hms.com -s enabled=true -s firstName=Dawit -s lastName=Kebede
call kcadm.bat set-password -r %REALM% --username dawit.kebede --new-password %PASS%
call kcadm.bat add-roles -r %REALM% --uusername dawit.kebede --rolename doctor

echo Creating Receptionist Users...
call kcadm.bat create users -r %REALM% -s username=haile.adugna -s email=haile.adugna@hms.com -s enabled=true -s firstName=Haile -s lastName=Adugna
call kcadm.bat set-password -r %REALM% --username haile.adugna --new-password %PASS%
call kcadm.bat add-roles -r %REALM% --uusername haile.adugna --rolename receptionist

call kcadm.bat create users -r %REALM% -s username=sara.tekelle -s email=sara.tekelle@hms.com -s enabled=true -s firstName=Sara -s lastName=Tekelle
call kcadm.bat set-password -r %REALM% --username sara.tekelle --new-password %PASS%
call kcadm.bat add-roles -r %REALM% --uusername sara.tekelle --rolename receptionist

echo Creating Patient Users...
call kcadm.bat create users -r %REALM% -s username=alem.tadesse -s email=alem.tadesse@hms.com -s enabled=true -s firstName=Alem -s lastName=Tadesse
call kcadm.bat set-password -r %REALM% --username alem.tadesse --new-password %PASS%
call kcadm.bat add-roles -r %REALM% --uusername alem.tadesse --rolename patient

call kcadm.bat create users -r %REALM% -s username=metsi.yohannes -s email=metsi.yohannes@hms.com -s enabled=true -s firstName=Metsi -s lastName=Yohannes
call kcadm.bat set-password -r %REALM% --username metsi.yohannes --new-password %PASS%
call kcadm.bat add-roles -r %REALM% --uusername metsi.yohannes --rolename patient

echo User creation finished.
