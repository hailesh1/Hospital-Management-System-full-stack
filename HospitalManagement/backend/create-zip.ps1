# PowerShell script to create a zip file of the backend
$sourceFolder = $PSScriptRoot
$zipFile = Join-Path $sourceFolder "hospital-management-backend.zip"

# Remove existing zip if it exists
if (Test-Path $zipFile) {
    Remove-Item $zipFile
}

# Create zip file
Compress-Archive -Path "$sourceFolder\*" -DestinationPath $zipFile -Force

Write-Host "Zip file created: $zipFile"

