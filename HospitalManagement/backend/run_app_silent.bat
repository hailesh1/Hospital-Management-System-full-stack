@echo off
set "JAVA_HOME=C:\box_tools\java21"
set "PATH=%JAVA_HOME%\bin;C:\box_tools\maven\bin;%PATH%"
cd /d "c:\Projects\HospitalManagement\backend"

echo Starting Backend...
mvn spring-boot:run
