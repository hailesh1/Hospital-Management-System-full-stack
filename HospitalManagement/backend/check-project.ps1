# Simple Project Verification
Write-Host "Hospital Management Backend - Verification" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$javaFiles = (Get-ChildItem -Recurse -Filter "*.java" | Measure-Object).Count
Write-Host "Total Java files: $javaFiles" -ForegroundColor Green

Write-Host "`nKey Files Check:" -ForegroundColor Yellow
if (Test-Path "pom.xml") { Write-Host "  [OK] pom.xml" -ForegroundColor Green } else { Write-Host "  [X] pom.xml MISSING" -ForegroundColor Red }
if (Test-Path "src\main\resources\application.yml") { Write-Host "  [OK] application.yml" -ForegroundColor Green } else { Write-Host "  [X] application.yml MISSING" -ForegroundColor Red }
if (Test-Path "src\main\java\com\hospital\management\HospitalManagementApplication.java") { Write-Host "  [OK] Main Application" -ForegroundColor Green } else { Write-Host "  [X] Main Application MISSING" -ForegroundColor Red }

Write-Host "`nPackage Structure:" -ForegroundColor Yellow
$packages = @("config", "controller", "service", "repository", "entity", "dto/request", "dto/response", "exception")
foreach ($pkg in $packages) {
    $path = "src\main\java\com\hospital\management\$pkg"
    if (Test-Path $path) {
        $count = (Get-ChildItem -Path $path -Filter "*.java" -ErrorAction SilentlyContinue | Measure-Object).Count
        Write-Host "  [OK] $pkg ($count files)" -ForegroundColor Green
    } else {
        Write-Host "  [X] $pkg MISSING" -ForegroundColor Red
    }
}

Write-Host "`nTo compile and run:" -ForegroundColor Cyan
Write-Host "  mvn clean compile    - Compile the project" -ForegroundColor Gray
Write-Host "  mvn spring-boot:run  - Run the application" -ForegroundColor Gray
Write-Host ""



