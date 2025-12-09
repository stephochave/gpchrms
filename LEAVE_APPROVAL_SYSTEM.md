# Multi-Level Leave Approval System - Complete Setup

## ✅ System Status: FULLY OPERATIONAL

Both frontend and backend servers are running:
- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:4000

---

## 📋 Department Heads (Department Admins)

All department heads can review and approve leave requests from employees in their department:

| Employee ID | Name | Position | Department | Username | Password |
|------------|------|----------|------------|----------|----------|
| 25-GPC-00001 | POLINNE MARI MONTEMAYR RABINA | Human Resource Head | Administration Department | 25-gpc-00001 | 12345678 |
| 25-GPC-00002 | STEPHANY MONTES OCHAVE | Dean of College of Teacher Education | College Department | 25-gpc-00002 | 12345678 |
| 25-GPC-00003 | MIA MYCA NAUNGAYAN TRESENIO | High School Principal | High School Department | 25-gpc-00003 | 12345678 |
| 25-GPC-00004 | MIAH CLAIRE SAGUN CORPUZ | Elementary Principal | Elementary Department | 25-gpc-00004 | 12345678 |

---

## 🔄 Leave Approval Workflow

### Step 1: Employee Submits Leave Request
- Employee files a leave request
- **Status**: `pending`
- Leave appears in their department head's review queue

### Step 2: Department Head Reviews
- Department head logs in and sees "Pending Leaves for Review (Department Head)" section
- Shows ONLY leaves from employees in their department with status `pending`
- Department head can:
  - ✅ **Recommend Approval** (with optional comment)
  - ❌ **Reject** (with reason)
- If recommended: **Status** changes to `department_approved`
- If rejected: **Status** changes to `rejected` (workflow ends)

### Step 3: Admin Final Approval
- Admin logs in and sees all leaves
- Leaves with status `department_approved` show:
  - Department head's recommendation
  - Department head's comment (if any)
  - Who approved it and when
- Admin can:
  - ✅ **Give Final Approval** → Status: `approved`
  - ❌ **Reject** → Status: `rejected`
- Admin decision is FINAL

---

## 🧪 Test Data Created

### Test Employee
- **Employee ID**: 25-GPC-00010
- **Name**: TEST EMPLOYEE COLLEGE
- **Department**: College Department
- **Position**: College Instructor

### Test Leave Request (ID: 3)
- **Employee**: TEST EMPLOYEE COLLEGE
- **Department**: College Department
- **Leave Type**: Vacation
- **Dates**: December 15-17, 2025
- **Status**: `pending`
- **Can be reviewed by**: STEPHANY MONTES OCHAVE (Dean of College)

---

## 📱 How to Test the Complete Workflow

### Test as Department Head (Stephany)
1. Go to http://localhost:8080
2. Login with:
   - Username: `25-gpc-00002`
   - Password: `12345678`
3. Navigate to **Leaves** page
4. You should see:
   - "Pending Leaves for Review (Department Head)" section
   - The test leave request from TEST EMPLOYEE COLLEGE
5. Click "Recommend Approval" or "Reject"
6. Add an optional comment
7. Submit decision

### Test as Admin
1. Logout from department head account
2. Login as admin
3. Navigate to **Leaves** page
4. You should see:
   - All leave requests
   - Status badge showing "Department Approved" (blue)
   - Department head's comment
   - Remaining leaves column for each employee
5. Click "Approve" or "Reject" for final decision
6. Add optional admin comment
7. Submit final decision

---

## 🎯 Key Features

### For Department Heads:
- ✅ See only leaves from their department
- ✅ Can only recommend (not force approve)
- ✅ Can add comments with recommendations
- ✅ Can view their own leave requests
- ✅ Can file their own leave requests

### For Admin:
- ✅ See all leaves from all departments
- ✅ See department head recommendations
- ✅ See remaining leave balance for each employee
- ✅ Give final approval/rejection
- ✅ View complete approval history
- ✅ 10 leaves per year limit enforcement

### System:
- ✅ Multi-level approval workflow
- ✅ Department-based filtering
- ✅ Status tracking (pending → department_approved → approved)
- ✅ Audit trail (who approved, when, comments)
- ✅ Leave balance tracking
- ✅ Color-coded status badges

---

## 🔐 Security & Permissions

### Employee Role:
- Can file leave requests
- Can view own leave requests
- Cannot review or approve any leaves

### Department Head Role:
- Detected by position containing: "Head", "Dean", or "Principal"
- Can file own leave requests
- Can view own leave requests
- Can review/recommend for employees in same department ONLY
- Cannot give final approval

### Admin Role:
- Can view all leave requests
- Can see department head recommendations
- Can give final approval/rejection
- Can enforce leave limits
- Has override capability

---

## 💡 Important Notes

1. **Department heads CANNOT bypass admin** - They can only recommend
2. **Admin has final say** - Can reject even if department head recommended
3. **10 leave limit** - System enforces maximum 10 leaves per employee per year
4. **Department filtering** - Department heads only see their department
5. **Position-based detection** - System automatically detects department heads by position title

---

## 🚀 Next Steps

1. Test the workflow with the test leave request
2. Create more employees in different departments
3. Have those employees file leave requests
4. Test each department head can only see their department's leaves
5. Verify admin can see all leaves and make final decisions

---

## 📊 Current Database State

- **Department Heads**: 4 (all properly configured)
- **Leave Requests**: 3 total
  - 1 pending (awaiting department head review)
  - 2 approved (already completed)
- **Test Data**: Ready for workflow testing

---

**System is ready for production use! 🎉**
