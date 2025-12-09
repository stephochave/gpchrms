# Department Head Leave Approval System - Complete Setup

## ✅ System Status: FULLY OPERATIONAL

The multi-level leave approval workflow has been successfully implemented and all department heads have been set up with user accounts.

## 📋 Department Heads Ready to Approve Leaves

| # | Name | Position | Department | Username | Password |
|---|------|----------|-----------|----------|----------|
| 1 | **Stephany Montes Ochave** | Dean of College of Teacher Education | College Department | `25-gpc-00002` | `12345678` |
| 2 | **Miah Claire Sagun Corpuz** | Elementary Principal | Elementary Department | `25-gpc-00004` | `12345678` |
| 3 | **Mia Myca Naungayan Tresenio** | High School Principal | High School Department | `25-gpc-00003` | `12345678` |
| 4 | **Constancia Espiritu Castro** | Human Resource Head | Administration Department | `25-gpc-00001` | `12345678` |

---

## 🔄 Complete Workflow Process

### **Phase 1: Employee Submits Leave** 📝
```
Employee → Fills Leave Form → Selects Leave Type, Dates, Reason → Submits
Status: PENDING
```

### **Phase 2: Department Head Reviews** 👤
```
Department Head logs in → Views "Pending Leaves for Review" section
→ Only sees leaves from their department → Chooses:
  ✓ Recommend for Approval (+ optional comment)
  ✗ Reject (+ optional comment)
Status: DEPARTMENT_APPROVED or REJECTED
```

### **Phase 3: Admin Makes Final Decision** 🔐
```
Admin logs in → Views all leave requests → Sees department head recommendation
→ Verifies 10-leave annual limit → Chooses:
  ✓ Approve (Employee gets the leave)
  ✗ Reject (Employee denied)
Status: APPROVED or REJECTED
```

---

## 🎯 Key Features

### For Department Heads:
- ✅ Can see their own leave balance and submit leaves
- ✅ Dedicated "Department Head Review" section
- ✅ Only see leaves from their own department
- ✅ Quick action buttons: Recommend or Reject
- ✅ Optional comment field for notes
- ✅ View all leaves (filter by status)

### For Admin:
- ✅ See all leave requests from all departments
- ✅ View remaining leave balance for each employee
- ✅ See department head recommendation with name and comment
- ✅ Visual indicator (blue badge) for recommended leaves
- ✅ Final approval/rejection controls
- ✅ Cannot exceed 10 leaves per employee per year

### For Employees:
- ✅ Submit leave requests
- ✅ Track status through all approval stages
- ✅ See remaining leaves for the year
- ✅ View department head's notes (if rejected)
- ✅ View admin's final decision

---

## 🔐 Database Structure

### Leave Request Status Flow:
```
pending → department_approved → approved ✓
   ↓           ↓            ↓
   └→ rejected ←┴────────────┘
```

### Leave Request Table Columns:
| Column | Purpose |
|--------|---------|
| `status` | Current stage: pending, department_approved, approved, rejected |
| `employee_department` | Department for routing to correct head |
| `department_head_comment` | Optional note from department head |
| `department_head_approved_by` | Name of department head |
| `department_head_approved_at` | Timestamp of approval |
| `admin_comment` | Optional note from admin |
| `decided_by` | Name of admin |

---

## 🧪 How to Test the System

### Test 1: Department Head Reviews Leaves

**Step 1:** Go to http://localhost:8080/login
**Step 2:** Login as a department head (e.g., Stephany Montes Ochave)
- Username: `25-gpc-00002`
- Password: `12345678`

**Step 3:** Navigate to **Leaves** menu

**Step 4:** You should see:
1. **File a Leave** - Form to submit your own leaves
2. **Pending Leaves for Review (Department Head)** - Section showing leaves from your department employees
3. **My Leave Requests** - Your own submitted leaves
4. **All Leave Requests** - All leaves you can see

**Step 5:** Find a pending leave and click **Recommend** or **Reject**

**Step 6:** Add a comment and confirm

---

### Test 2: Admin Final Approval

**Step 1:** Login as Admin (System Administrator)

**Step 2:** Navigate to **Leaves**

**Step 3:** You should see:
- All leave requests
- **Remaining Leaves** column showing balance
- **Department Head** column showing:
  - "✓ Recommended" (if department head approved)
  - Department head's name
  - Department head's comment
  - "—" (if still pending)

**Step 4:** Click **Approve** or **Reject** to make final decision

**Step 5:** Add admin comment and confirm

---

## 📊 Sample Leave Approval Timeline

**Scenario:** Employee in College Department submits leave

```
2025-12-08 10:00 AM - Employee submits leave request
                      Status: PENDING ⏳

2025-12-08 11:30 AM - Dean (Stephany Montes Ochave) reviews
                      → Recommends approval with comment: "Approved, coverage arranged"
                      Status: DEPARTMENT_APPROVED ✅

2025-12-08 2:00 PM  - Admin reviews
                      → Approves (sees recommendation)
                      Status: APPROVED ✅
                      
Employee receives notification: Leave APPROVED ✓
```

---

## ⚙️ Technical Details

### API Endpoints:
- `GET /leaves` - List leave requests (with filters)
- `POST /leaves` - Create new leave request
- `PATCH /leaves/:id/department-approval` - Department head approval/rejection
- `PATCH /leaves/:id/status` - Admin final approval/rejection
- `GET /leaves/check-department-head` - Verify if user is department head
- `GET /leaves/stats` - Get leave statistics
- `GET /leaves/stats/:employeeId` - Get employee's leave balance

### Database Tables:
- `leave_requests` - Stores all leave data with multi-level approval fields
- `employees` - Employee details including department and position
- `users` - User accounts for login

### Validation Rules:
- ✓ Department head can only recommend (not reject permanently)
- ✓ Admin can approve/reject at any stage
- ✓ Max 10 approved leaves per employee per year
- ✓ Department head must be in same department as employee
- ✓ Department head position must contain: "Head", "Dean", or "Principal"

---

## 🚀 System Ready for Use!

All infrastructure is in place. Department heads and admin can now manage the complete leave approval process.

### Quick Start:
1. **Department heads** log in and review pending leaves from their departments
2. **Admin** logs in and makes final approvals
3. **Employees** can track their leave status in real-time

### Support:
- Default password for all new accounts: `12345678`
- Users should change password on first login
- All actions are logged in activity history for audit trail
