$ErrorActionPreference = "Stop"
$ProgressPreference = 'SilentlyContinue'

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   HOSPITAL MANAGEMENT SYSTEM - AUTO SETUP" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$CurrentDir = Get-Location
$BackendDir = Join-Path $CurrentDir "backend"
$FrontendDir = Join-Path $CurrentDir "frontend"
$InstallBase = "C:\box_tools" # Installing in a local tools folder to avoid E: drive issues if it doesn't exist

# Create Install Directory
if (-not (Test-Path $InstallBase)) {
    New-Item -ItemType Directory -Force -Path $InstallBase | Out-Null
}

# -------------------------------------------------------------------------
# 1. JAVA SETUP (OpenJDK 21)
# -------------------------------------------------------------------------
$JavaUrl = "https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.6%2B7/OpenJDK21U-jdk_x64_windows_hotspot_21.0.6_7.zip"
$JavaZip = Join-Path $InstallBase "java21.zip"
$JavaExtractDir = Join-Path $InstallBase "java21"

Write-Host "`n[1/3] Checking Java..." -ForegroundColor Yellow
if (-not (Test-Path "$JavaExtractDir\bin\java.exe")) {
    Write-Host "Downloading Java 21..." -ForegroundColor Gray
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $JavaUrl -OutFile $JavaZip
    
    Write-Host "Extracting Java..." -ForegroundColor Gray
    Expand-Archive -Path $JavaZip -DestinationPath $InstallBase -Force
    
    # Rename the extracted folder (it usually has version name) to 'java21'
    $ExtractedFolder = Get-ChildItem -Path $InstallBase -Filter "jdk-21*" -Directory | Select-Object -First 1
    if ($ExtractedFolder) {
        Rename-Item -Path $ExtractedFolder.FullName -NewName "java21"
    }
    Remove-Item $JavaZip -Force
    Write-Host "Java installed at $JavaExtractDir" -ForegroundColor Green
}
else {
    Write-Host "Java already installed." -ForegroundColor Green
}

# Set JAVA LOCAL ENV
$env:JAVA_HOME = $JavaExtractDir
$env:PATH = "$JavaExtractDir\bin;$env:PATH"

# -------------------------------------------------------------------------
# 2. MAVEN SETUP (Apache Maven 3.9.6)
# -------------------------------------------------------------------------
$MavenUrl = "https://dlcdn.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip"
$MavenZip = Join-Path $InstallBase "maven.zip"
$MavenExtractDir = Join-Path $InstallBase "maven"

Write-Host "`n[2/3] Checking Maven..." -ForegroundColor Yellow
if (-not (Test-Path "$MavenExtractDir\bin\mvn.cmd")) {
    Write-Host "Downloading Maven..." -ForegroundColor Gray
    Invoke-WebRequest -Uri $MavenUrl -OutFile $MavenZip
    
    Write-Host "Extracting Maven..." -ForegroundColor Gray
    Expand-Archive -Path $MavenZip -DestinationPath $InstallBase -Force
    
    # Rename extracted folder
    $ExtractedFolder = Get-ChildItem -Path $InstallBase -Filter "apache-maven*" -Directory | Select-Object -First 1
    if ($ExtractedFolder) {
        Rename-Item -Path $ExtractedFolder.FullName -NewName "maven"
    }
    Remove-Item $MavenZip -Force
    Write-Host "Maven installed at $MavenExtractDir" -ForegroundColor Green
}
else {
    Write-Host "Maven already installed." -ForegroundColor Green
}

# Set MAVEN LOCAL ENV
$env:M2_HOME = $MavenExtractDir
$env:PATH = "$MavenExtractDir\bin;$env:PATH"

# Verify Backend Tools
Write-Host "`nVerifying Tools:" -ForegroundColor Cyan
java -version 2>&1 | Select-Object -First 1
mvn -version 2>&1 | Select-Object -First 1

# -------------------------------------------------------------------------
# 3. FRONTEND SETUP (Clean Install)
# -------------------------------------------------------------------------
Write-Host "`n[3/3] Fixing Frontend Dependencies..." -ForegroundColor Yellow
Push-Location $FrontendDir

if (Test-Path "node_modules") {
    Write-Host "Removing corrupted node_modules (this may take a moment)..." -ForegroundColor Gray
    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
}

Write-Host "Running npm install..." -ForegroundColor Gray
try {
    npm install
    Write-Host "Frontend dependencies installed successfully!" -ForegroundColor Green
}
catch {
    Write-Host "Error installing frontend dependencies." -ForegroundColor Red
    Write-Error $_
}

Pop-Location

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "   SETUP COMPLETE" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "To run the project:"
Write-Host "1. Backend:  $env:JAVA_HOME\bin\java -jar ..."
Write-Host "   (Or use the 'mvn spring-boot:run' command from the backend folder with the tools in PATH)"
Write-Host "2. Frontend: npm run dev"
