# Regenerate QR codes for all employees
$API_BASE = "http://localhost:4000"

# Get all employees
Write-Host "Fetching employees..." -ForegroundColor Cyan
$response = Invoke-RestMethod -Uri "$API_BASE/employees" -Method Get
$employees = $response.data

Write-Host "Found $($employees.Count) employees" -ForegroundColor Green
Write-Host ""

# Regenerate QR code for each employee
foreach ($emp in $employees) {
    Write-Host "Generating QR for: $($emp.fullName) ($($emp.employeeId))" -ForegroundColor Yellow
    
    try {
        $body = @{ generatedBy = "System" } | ConvertTo-Json
        $result = Invoke-RestMethod -Uri "$API_BASE/employees/$($emp.id)/generate-qr" `
                                    -Method Post `
                                    -ContentType "application/json" `
                                    -Body $body
        
        Write-Host "  Success" -ForegroundColor Green
    } catch {
        Write-Host "  Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "QR regeneration complete!" -ForegroundColor Green
Write-Host ""

# Verify results
Write-Host "Verifying QR codes..." -ForegroundColor Cyan
$response = Invoke-RestMethod -Uri "$API_BASE/employees" -Method Get
$employees = $response.data

foreach ($emp in $employees) {
    if ($emp.qrCodeData) {
        if ($emp.qrCodeData -like "data:image/*") {
            $qrType = "DataURL (OLD)"
            $color = "Yellow"
        } else {
            $qrType = "JWT Token (NEW)"
            $color = "Green"
        }
        $qrLength = $emp.qrCodeData.Length
        Write-Host "$($emp.employeeId): $qrType - $qrLength chars" -ForegroundColor $color
    } else {
        Write-Host "$($emp.employeeId): NO QR CODE" -ForegroundColor Red
    }
}
