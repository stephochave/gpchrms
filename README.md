# Welcome to your Lovable project
## Project info

### Frontend (Vite + React)
```bash
npm install
npm run dev
```
### Backend (Express + MySQL)

```bash
cd server
npm install
cp env.example .env
npm run dev
```

## TEST USER ACCOUNT

### Admin
```
Employee ID: 25-GPC-ADM01
Email: admin@greatplebeian.edu
Password: Admin@123456

High Level Access:
    Dashboard: Employee, Attendance, Documents, Organization, Absent / Calendar: Add Schedule Event, View Approve Leave   
    Add Edit Delete Employees
    Generate QR Codes
    Add Edit Delete Department / Designation
    Generate Report / Add Attendance
    Await dept head leave request approve / Leave Report
    Upload Add Edit Delete Employee Documents
    Generate Approve Print View Delete   Loyalty Awards 

```
### Head/Dean with admin role
```
Name: Rosa Garcia Fernandez
Department: College Department
Position/Designation: Dean of College of Business Education
Role: Admin
Employee ID: 14-GPC-00003
Email: 14-GPC-00003@school.edu
Password: 14-GPC-00003


Name: Juan Dela Cruz
Department: Elementary Department
Position/Designation: Elementary Principal
Role: Admin
Employee ID: 12-GPC-00002
Email: 12-GPC-00002@gpc.edu
Password: 12-GPC-00002

Mid Level Access:
    Dashboard: Show QR Code to Guard
    Department: Show View / Add only Designation 
    Attendance: Generate Report / Add Attendance / Attendance Report
    Leave Request: File a Leave / Review their Department Leave Request first before admin / Leave Report
    Documents: View Edit Documents 
    Loyalty Awards: Generate / Approve / Print / View / Delete
    Profile: Edit their own Profile / Documents / Show QR Codes
```
### Employee
```

Name: Carlos Mendoza Torres
Department: Marketing 
Position: Marketing Specialist
Role: Employee
Employee ID: 25-GPC-00005
Email: carlos.torres@gpc.edu
Password: Employee@12

For Testing Approve Leave Request Approve before admin
Name: MIAH SAGUN CORPUZ
Department: College Department
Position/Designation: Assistant Librarian
Role: Employee
Employee ID: 25-GPC-00010
Email: 25-GPC-00010@gpc.edu
Password: 25-GPC-00010

For Testing Pending Leave Request
Name: Maria Santos Lopez
Department: Elementary Department
Position/Designation: Elementary Faculty Member
Role: Employee
Employee ID: 15-GPC-00001
Email: 15-GPC-00001@gpc.edu
Password: 15-GPC-00001

Low Level Access: 
    Dashboard: Show QR Code to Guard / Calendar: File a Leave, Show Events  
    Attendance: My Attendance Records   
    Leave: File a Leave / My Leave Requests
    Loyalty Awards: Show own Loyalty Awards
    Profile: Edit their own Profile / Documents / Show QR Codes
```

## Importing Database 
```
Start Apache + MySQL in XAMPP.
    Go to: http://localhost/phpmyadmin
        Import tab.
            Upload your gpchrms_final_database.sql 
```



