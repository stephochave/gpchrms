# Multi-Level Leave Approval Workflow

## Overview
The leave management system now supports a multi-level approval workflow where leave requests go through sequential approvals:

1. **Employee** - Submits a leave request
2. **Department Head/Dean/Principal** - Reviews and recommends for approval or rejects
3. **Admin** - Makes final approval or rejection

## How It Works

### For Employees
- Employees submit leave requests as usual
- Their request status shows as "pending" initially
- Once their department head reviews it, status changes to either:
  - `department_approved` - Recommended for admin approval
  - `rejected` - Request was rejected

### For Department Heads, Deans, and Principals
Users with positions containing "head", "dean", or "principal" have access to a **Department Head Review** section that displays:

- All pending leave requests from their department
- Ability to recommend requests for admin approval
- Ability to reject requests with comments
- When recommending approval, they can add a comment that the admin will see

Once a department head recommends approval (status: `department_approved`), the request moves to the admin for final approval.

### For Admins
Admins see an enhanced view with:

- **Remaining Leaves** column - Shows remaining leave balance for each employee
- **Department Head** column - Shows if a request has been recommended for approval
  - Displays the department head's name
  - Shows their recommendation comment if provided
- Can approve `pending` or `department_approved` requests
- Can reject requests at any stage
- Cannot approve if employee has reached the 10-leave annual limit

## Leave Request Statuses

- `pending` - Awaiting department head review
- `department_approved` - Department head recommended approval, awaiting admin final approval
- `approved` - Admin has approved (final status)
- `rejected` - Rejected at any stage (final status)

## Database Schema Changes

The following columns were added to the `leave_requests` table:

| Column | Type | Purpose |
|--------|------|---------|
| `employee_department` | VARCHAR(100) | Stores employee's department for routing to correct department head |
| `department_head_comment` | TEXT | Optional comment from department head |
| `department_head_approved_by` | VARCHAR(255) | Name of person who made department head decision |
| `department_head_approved_at` | TIMESTAMP | When the department head decision was made |

## API Endpoints

### New Endpoint
- **PATCH** `/leaves/:id/department-approval`
  - Allows department heads to review and recommend/reject leaves
  - Request body:
    ```json
    {
      "status": "department_approved" | "rejected",
      "departmentHeadComment": "optional comment",
      "approvedBy": "department head name"
    }
    ```

### Modified Endpoints
- **GET** `/leaves` - Now supports `department` query parameter
- **POST** `/leaves` - Now accepts `employeeDepartment` in request body
- **PATCH** `/leaves/:id/status` - Now only allows approval of `pending` or `department_approved` requests

## Migration

To apply the schema changes, run:
```sql
-- Apply multi-level approval schema
mysql -u your_user -p your_database < migrate-add-multi-level-approval.sql

-- Populate departments for existing leave requests
mysql -u your_user -p your_database < migrate-populate-leave-departments.sql
```

## User Interface

### Department Head Section
- Dedicated card for "Pending Leaves for Review (Department Head)"
- Shows only pending leaves from their department
- Recommend or Reject buttons with comment dialogs
- Status badge shows "pending" with amber color

### Admin Section
- Enhanced table with department head information column
- Department head recommendations are highlighted in blue
- Shows "✓ Recommended" with department head name and their comment
- Can still approve/reject at any stage (unless employee hit leave limit)

## Example Workflow

1. **Employee** submits leave request on Dec 8, 2025
   - Status: `pending`
   - Department: Engineering

2. **Engineering Department Head** reviews request
   - Clicks "Recommend" button
   - Adds optional comment: "Approved, coverage arranged"
   - Status changes to: `department_approved`

3. **Admin** reviews the request
   - Sees "✓ Recommended" in Department Head column
   - Sees the department head's comment
   - Verifies employee hasn't reached 10-leave limit
   - Approves the request
   - Status changes to: `approved`

4. **Employee** sees final approval status with admin's comment if any

## Backward Compatibility

- Existing leave requests without department information will show as "—" in the department head column
- The system will automatically populate department info for new leave requests
- Old requests can be manually updated by running the migration script
