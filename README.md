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
Email: admin@greatplebeian.edu
Employee ID: 25-GPC-ADM01
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
Email: 14-GPC-00003@school.edu
Employee ID: 14-GPC-00003
Password: 14-GPC-00003


Name: Juan Dela Cruz
Department: Elementary Department
Position/Designation: Elementary Principal
Role: Admin
Email: 12-GPC-00002@gpc.edu
Employee ID: 12-GPC-00002
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
Email: carlos.torres@gpc.edu
Employee ID: 25-GPC-00005
Password: Employee@12

For Testing Approve Leave Request Approve before admin
Name: MIAH SAGUN CORPUZ
Department: College Department
Position/Designation: Assistant Librarian
Role: Employee
Email: 25-GPC-00010@gpc.edu
Employee ID: 25-GPC-00010
Password: 25-GPC-00010

For Testing Pending Leave Request
Name: Maria Santos Lopez
Department: Elementary Department
Position/Designation: Elementary Faculty Member
Role: Employee
Email: 15-GPC-00001@gpc.edu
Employee ID: 15-GPC-00001
Password: 15-GPC-00001

Low Level Access: 
    Dashboard: Show QR Code to Guard / Calendar: File a Leave, Show Events  
    Attendance: My Attendance Records   
    Leave: File a Leave / My Leave Requests
    Loyalty Awards: Show own Loyalty Awards
    Profile: Edit their own Profile / Documents / Show QR Codes
```

## Importing Database 
### Using XAMPP
```
    1. Start Apache + MySQL in XAMPP.
    2. Go to: http://localhost/phpmyadmin
    3. Delete the old database
        a. Select the DB ('hrms' if exist) → Operations → Drop the database -> OK
    4. Create new Database 'hrms'
        a. Select New -> Databases -> Database Name: 'hrms' -> Create
    5. Upload your gpchrms_final_database.sql 
```

### Using MySQL Command Line
```
    1. mysql -u root -p -e "DROP DATABASE IF EXISTS hrms;"
    2. mysql -u root -p -e "CREATE DATABASE hrms;"
    3. mysql -u root -p hrms < C:\path\gpchrms_final_database.sql
```




