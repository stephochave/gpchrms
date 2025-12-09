# Department Head Leave Approval Workflow - Setup Complete

## Department Heads & Their Credentials

All department heads have been set up with user accounts and can now review and approve leaves from employees in their department.

### 1. **Stephany Montes Ochave** - Dean of College of Teacher Education
   - **Employee ID**: 25-GPC-00002
   - **Department**: College Department
   - **Username**: 25-gpc-00002
   - **Default Password**: 12345678
   - **Can Approve Leaves From**: All employees in College Department

### 2. **Miah Claire Sagun Corpuz** - Elementary Principal
   - **Employee ID**: 25-GPC-00004
   - **Department**: Elementary Department
   - **Username**: 25-gpc-00004
   - **Default Password**: 12345678
   - **Can Approve Leaves From**: All employees in Elementary Department

### 3. **Mia Myca Naungayan Tresenio** - High School Principal
   - **Employee ID**: 25-GPC-00003
   - **Department**: High School Department
   - **Username**: 25-gpc-00003
   - **Default Password**: 12345678
   - **Can Approve Leaves From**: All employees in High School Department

### 4. **Constancia Espiritu Castro** - Human Resource Head
   - **Employee ID**: 25-GPC-00001
   - **Department**: Administration Department
   - **Username**: 25-gpc-00001
   - **Default Password**: 12345678
   - **Can Approve Leaves From**: All employees in Administration Department

## Multi-Level Leave Approval Workflow

### Step 1: Employee Submits Leave
- Employee logs in and submits a leave request
- Status: **PENDING** (awaiting department head review)

### Step 2: Department Head Reviews & Recommends
- Department Head logs in
- Views "Pending Leaves for Review (Department Head)" section
- Only sees leaves from their own department
- Can:
  - **Recommend for Approval** - Status becomes **DEPARTMENT_APPROVED**
  - **Reject** - Status becomes **REJECTED**
- Optionally adds a comment/note

### Step 3: Admin Makes Final Approval
- Admin (System Administrator) logs in
- Views all leave requests with all details
- Sees which leaves were recommended by the department head
- Can:
  - **Approve** - Status becomes **APPROVED** (employee gets leave)
  - **Reject** - Status becomes **REJECTED**
- Cannot exceed 10 leaves per employee per year

## System Features

✅ **Department Head Dashboard**
- Dedicated section to review department leaves
- Only shows leaves from their department
- Quick action buttons (Recommend/Reject)
- Comment dialog for notes

✅ **Admin Dashboard**
- Views all leave requests
- Sees department head recommendations
- Displays department head's name and comment
- Visual indicators for recommended leaves
- Enforces 10-leave annual limit

✅ **Employee View**
- Submit leaves with reason
- Track leave status throughout approval process
- See remaining leaves balance
- View admin's final decision

## Database Schema

Leave Request Status Enum:
- `pending` - Awaiting department head review
- `department_approved` - Department head recommended, awaiting admin final approval
- `approved` - FINAL: Admin approved
- `rejected` - FINAL: Rejected at any stage

Leave Request Fields:
- `employee_department` - Department of requesting employee
- `department_head_comment` - Optional note from department head
- `department_head_approved_by` - Name of department head who made decision
- `department_head_approved_at` - Timestamp of department head decision

## How to Test

### Test as Department Head (Stephany Montes Ochave):
1. Go to http://localhost:8080/login
2. Username: `25-gpc-00002`
3. Password: `12345678`
4. Navigate to Leaves
5. You should see:
   - "File a Leave" form to submit your own leaves
   - "Pending Leaves for Review (Department Head)" section
   - "My Leave Requests" section
   - "All Leave Requests" section
6. Find pending leaves from College Department employees
7. Click "Recommend" or "Reject" button

### Test as Admin:
1. Login as System Administrator
2. Navigate to Leaves
3. You should see:
   - All leave requests
   - "Remaining Leaves" column
   - "Department Head" column showing recommendations
   - Department head name and comment if recommended
   - Approve/Reject buttons for non-approved leaves
4. Cannot approve if employee reached 10-leave limit

## Permissions Summary

| User Type | Can Submit Leaves | Can Recommend | Can Final Approve |
|-----------|------------------|---------------|------------------|
| Employee | ✓ | ✗ | ✗ |
| Department Head | ✓ | ✓ (only their dept) | ✗ |
| Admin | ✗ | ✗ | ✓ |

## Important Notes

1. Department heads can **ONLY** review leaves from employees in their department
2. The system automatically checks the department head's position and department
3. Department heads cannot approve leaves - they can only recommend
4. Admin must be the final approver
5. System enforces 10-leave annual limit
6. Once rejected, leave cannot be recovered - employee must resubmit

## Next Steps

1. Have each department head change their password on first login
2. Department heads should distribute this information to their employees
3. Admin should monitor all leave requests and make timely approvals
4. System will track all approvals in the activity log for audit purposes
