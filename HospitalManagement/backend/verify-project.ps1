# Project Verification Script
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Hospital Management Backend - Verification" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check main application class
Write-Host "Checking main application class..." -ForegroundColor Yellow
if (Test-Path "src\main\java\com\hospital\management\HospitalManagementApplication.java") {
    Write-Host "✓ HospitalManagementApplication.java found" -ForegroundColor Green
} else {
    Write-Host "✗ HospitalManagementApplication.java NOT found" -ForegroundColor Red
}

# Check config files
Write-Host "`nChecking configuration files..." -ForegroundColor Yellow
$configFiles = @("MinioConfig.java", "SecurityConfig.java", "KeycloakConfig.java", "WebConfig.java")
foreach ($file in $configFiles) {
    if (Test-Path "src\main\java\com\hospital\management\config\$file") {
        Write-Host "✓ $file found" -ForegroundColor Green
    } else {
        Write-Host "✗ $file NOT found" -ForegroundColor Red
    }
}

# Check entities
Write-Host "`nChecking entity classes..." -ForegroundColor Yellow
$entities = @("Patient.java", "Staff.java", "Appointment.java", "LabTest.java", "Prescription.java", 
              "MedicalRecord.java", "Invoice.java", "Schedule.java", "Attendance.java")
foreach ($entity in $entities) {
    if (Test-Path "src\main\java\com\hospital\management\entity\$entity") {
        Write-Host "✓ $entity found" -ForegroundColor Green
    } else {
        Write-Host "✗ $entity NOT found" -ForegroundColor Red
    }
}

# Check controllers
Write-Host "`nChecking controller classes..." -ForegroundColor Yellow
$controllers = @("PatientController.java", "StaffController.java", "AppointmentController.java", 
                 "LabTestController.java", "PrescriptionController.java", "MedicalRecordController.java",
                 "InvoiceController.java", "ScheduleController.java", "AnalyticsController.java", "HealthController.java")
$controllerCount = 0
foreach ($controller in $controllers) {
    if (Test-Path "src\main\java\com\hospital\management\controller\$controller") {
        Write-Host "✓ $controller found" -ForegroundColor Green
        $controllerCount++
    } else {
        Write-Host "✗ $controller NOT found" -ForegroundColor Red
    }
}

# Check services
Write-Host "`nChecking service classes..." -ForegroundColor Yellow
$services = @("PatientService.java", "StaffService.java", "AppointmentService.java", 
              "LabTestService.java", "PrescriptionService.java", "MedicalRecordService.java",
              "InvoiceService.java", "ScheduleService.java", "AnalyticsService.java", "MinioService.java")
$serviceCount = 0
foreach ($service in $services) {
    if (Test-Path "src\main\java\com\hospital\management\service\$service") {
        Write-Host "✓ $service found" -ForegroundColor Green
        $serviceCount++
    } else {
        Write-Host "✗ $service NOT found" -ForegroundColor Red
    }
}

# Check repositories
Write-Host "`nChecking repository interfaces..." -ForegroundColor Yellow
$repositories = @("PatientRepository.java", "StaffRepository.java", "AppointmentRepository.java",
                  "LabTestRepository.java", "PrescriptionRepository.java", "MedicalRecordRepository.java",
                  "InvoiceRepository.java", "ScheduleRepository.java")
foreach ($repo in $repositories) {
    if (Test-Path "src\main\java\com\hospital\management\repository\$repo") {
        Write-Host "✓ $repo found" -ForegroundColor Green
    } else {
        Write-Host "✗ $repo NOT found" -ForegroundColor Red
    }
}

# Check configuration files
Write-Host "`nChecking configuration files..." -ForegroundColor Yellow
if (Test-Path "pom.xml") {
    Write-Host "✓ pom.xml found" -ForegroundColor Green
} else {
    Write-Host "✗ pom.xml NOT found" -ForegroundColor Red
}

if (Test-Path "src\main\resources\application.yml") {
    Write-Host "✓ application.yml found" -ForegroundColor Green
} else {
    Write-Host "✗ application.yml NOT found" -ForegroundColor Red
}

# Summary
Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
$ctrlColor = if($controllerCount -eq 10){"Green"}else{"Yellow"}
$svcColor = if($serviceCount -eq 10){"Green"}else{"Yellow"}
Write-Host "Controllers: $controllerCount/10" -ForegroundColor $ctrlColor
Write-Host "Services: $serviceCount/10" -ForegroundColor $svcColor
Write-Host ""

# Check Java files count
$javaFiles = (Get-ChildItem -Recurse -Filter "*.java" | Measure-Object).Count
Write-Host "Total Java files: $javaFiles" -ForegroundColor Cyan

# Instructions
Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "1. Install Maven (if not installed):" -ForegroundColor White
Write-Host "   Download from: https://maven.apache.org/download.cgi" -ForegroundColor Gray
Write-Host "`n2. To compile the project:" -ForegroundColor White
Write-Host "   mvn clean compile" -ForegroundColor Gray
Write-Host "`n3. To build the project:" -ForegroundColor White
Write-Host "   mvn clean package" -ForegroundColor Gray
Write-Host "`n4. To run the application:" -ForegroundColor White
Write-Host "   mvn spring-boot:run" -ForegroundColor Gray
Write-Host "`n5. Make sure you have:" -ForegroundColor White
Write-Host "   - Java 17+ installed" -ForegroundColor Gray
Write-Host "   - PostgreSQL running" -ForegroundColor Gray
Write-Host "   - Keycloak server running (for authentication)" -ForegroundColor Gray
Write-Host "   - MinIO server running (for file storage)" -ForegroundColor Gray
Write-Host ""

