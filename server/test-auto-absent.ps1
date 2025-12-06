# Test Auto-Absent Functionality
$API_BASE = "http://localhost:4000"

Write-Host ""
Write-Host "Testing Auto-Absent Functionality" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan

# Get today's date
$today = Get-Date -Format "yyyy-MM-dd"
Write-Host ""
Write-Host "Testing for date: $today" -ForegroundColor Yellow

# Get all active employees
Write-Host ""
Write-Host "1. Fetching active employees..." -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$API_BASE/employees?status=active"
$activeEmployees = $response.data
Write-Host "   Found $($activeEmployees.Count) active employees" -ForegroundColor Green

# Get today's attendance records
Write-Host ""
Write-Host "2. Fetching today's attendance..." -ForegroundColor Yellow
$attendanceResponse = Invoke-RestMethod -Uri "$API_BASE/attendance?date=$today"
$attendanceRecords = $attendanceResponse.data
Write-Host "   Found $($attendanceRecords.Count) attendance records for today" -ForegroundColor Green

# Identify employees without attendance
$attendedEmployeeIds = $attendanceRecords | ForEach-Object { $_.employeeId }
$employeesWithoutAttendance = $activeEmployees | Where-Object { $attendedEmployeeIds -notcontains $_.employeeId }

Write-Host ""
Write-Host "3. Analysis:" -ForegroundColor Yellow
Write-Host "   Active Employees: $($activeEmployees.Count)" -ForegroundColor White
Write-Host "   With Attendance: $($attendanceRecords.Count)" -ForegroundColor White
Write-Host "   Without Attendance: $($employeesWithoutAttendance.Count)" -ForegroundColor $(if ($employeesWithoutAttendance.Count -gt 0) { "Yellow" } else { "Green" })

if ($employeesWithoutAttendance.Count -gt 0) {
    Write-Host ""
    Write-Host "   Employees without attendance today:" -ForegroundColor Yellow
    foreach ($emp in $employeesWithoutAttendance) {
        Write-Host "   - $($emp.employeeId): $($emp.fullName)" -ForegroundColor White
    }
}

Write-Host ""
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "Test Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Note: Auto-absent marking runs automatically at 4:00 PM" -ForegroundColor Cyan
Write-Host "      It will mark employees without attendance as 'absent'" -ForegroundColor Cyan
