import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayoutNew from "@/components/Layout/DashboardLayoutNew";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Search, Users, Download, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: "present" | "absent" | "late" | "half-day" | "leave";
  notes?: string;
  checkInImage?: string;
  checkOutImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  department: string;
  position: string;
}

interface AttendanceRecord {
  name: string;
  type: string;
  signIn: string;
  signOut: string;
  status: string;
  employeeId: string;
  attendanceId?: string;
  rawStatus?: string;
  rawCheckIn?: string;
  rawCheckOut?: string;
}

interface DepartmentRecord {
  department: string;
  date: string;
  records: AttendanceRecord[];
}

const toolbarButtons = [
  {
    // label: "Present Employees List",
    bg: "bg-[#e3f2ff]",
    border: "border-[#6cb3ff]",
    text: "text-[#1c6ed3]",
  },
  {
    // label: "Absent Employees List",
    bg: "bg-[#e7f4ff]",
    border: "border-[#5aaeea]",
    text: "text-[#146fbf]",
  },
  {
    // label: "Late Employees List",
    bg: "bg-[#fef3d4]",
    border: "border-[#f5c248]",
    text: "text-[#c98204]",
  },
];

const SAMPLE_EMPLOYEES: Employee[] = [
  {
    id: "sample-ana",
    employeeId: "25-GPC-0001",
    fullName: "Ana Dela Cruz",
    department: "HR Department",
    position: "HR Specialist",
  },
  {
    id: "sample-mark",
    employeeId: "25-GPC-0002",
    fullName: "Mark Reyes",
    department: "Finance Department",
    position: "Accountant",
  },
  {
    id: "sample-lea",
    employeeId: "25-GPC-0003",
    fullName: "Lea Santos",
    department: "IT Department",
    position: "IT Coordinator",
  },
  {
    id: "sample-jose",
    employeeId: "25-GPC-0004",
    fullName: "Jose Ramirez",
    department: "Elementary Department",
    position: "Teacher",
  },
];

const buildSampleAttendance = (): Attendance[] => {
  const format = (date: Date) => date.toISOString().split("T")[0];
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  return [
    {
      id: "sample-att-1",
      employeeId: "25-GPC-0001",
      employeeName: "Ana Dela Cruz",
      date: format(today),
      checkIn: "08:04",
      checkOut: "17:02",
      status: "present",
      notes: "Arrived early for morning briefing",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "sample-att-2",
      employeeId: "25-GPC-0002",
      employeeName: "Mark Reyes",
      date: format(today),
      checkIn: "08:28",
      checkOut: "17:41",
      status: "late",
      notes: "Traffic delay due to heavy rain",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "sample-att-3",
      employeeId: "25-GPC-0003",
      employeeName: "Lea Santos",
      date: format(today),
      status: "leave",
      notes: "Approved vacation leave",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "sample-att-4",
      employeeId: "25-GPC-0004",
      employeeName: "Jose Ramirez",
      date: format(yesterday),
      checkIn: "08:10",
      checkOut: "16:55",
      status: "present",
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

const AttendanceList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usingSampleData, setUsingSampleData] = useState(false);
  const [searchParams] = useSearchParams();
  const viewMode = searchParams.get("view") || "personal"; // "personal" or "department"
  const { toast } = useToast();
  const { user } = useAuth();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<{
    record: AttendanceRecord;
    date: string;
  } | null>(null);
  const [editStatus, setEditStatus] = useState<
    "present" | "absent" | "late" | "half-day" | "leave"
  >("present");
  const [editCheckIn, setEditCheckIn] = useState("");
  const [editCheckOut, setEditCheckOut] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [reportFilter, setReportFilter] = useState<"daily" | "weekly" | "monthly">("monthly");

  // Determine user type
  // System Admin: role === "admin" AND has no specific head/dean/principal position
  // Department Head: role === "admin" AND position contains "head"/"dean"/"principal"
  // Employee: role === "employee"
  const isDepartmentHead = user?.role === "admin" && user?.position && 
    (user.position.toLowerCase().includes("head") || 
     user.position.toLowerCase().includes("dean") || 
     user.position.toLowerCase().includes("principal"));
  
  const isSystemAdmin = user?.role === "admin" && !isDepartmentHead;

  const applySampleData = () => {
    setAttendance(buildSampleAttendance());
    setEmployees(SAMPLE_EMPLOYEES);
    setUsingSampleData(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        if (!user?.employeeId) {
          applySampleData();
          return;
        }

        // Determine if user is a department head (admin with specific position)
        const isDepartmentHead = user?.role === "admin" && user?.position && 
          (user.position.toLowerCase().includes("head") || 
           user.position.toLowerCase().includes("dean") || 
           user.position.toLowerCase().includes("principal"));

        // Build attendance fetch URL based on user role
        let attendanceUrl = `${API_BASE_URL}/attendance`;
        let employeeUrl = `${API_BASE_URL}/employees`;

        if (user?.role === "employee") {
          // Employees see only their own attendance
          attendanceUrl += `?employeeId=${user.employeeId}`;
          employeeUrl += `?employeeId=${user.employeeId}`;
        } else if (isDepartmentHead && user?.department) {
          // Department heads see their own department's attendance
          employeeUrl += `?department=${user.department}&status=active`;
        } else {
          // Super admins see all active employees
          employeeUrl += `?status=active`;
        }

        const [attendanceRes, employeeRes] = await Promise.all([
          fetch(attendanceUrl),
          fetch(employeeUrl),
        ]);

        if (!attendanceRes.ok || !employeeRes.ok) {
          applySampleData();
          return;
        }

        const attendanceData = await attendanceRes.json();
        let attendanceRecords = attendanceData.data || [];

        const employeeData = await employeeRes.json();
        const employees = employeeData.data || [];

        if (employees.length === 0) {
          applySampleData();
          return;
        }

        setAttendance(attendanceRecords);
        setEmployees(employees);
        setUsingSampleData(false);
      } catch (error) {
        console.error("Error fetching data", error);
        applySampleData();
        if (!usingSampleData) {
          toast({
            variant: "destructive",
            title: "Error",
            description:
              "Unable to load attendance data. Showing sample data instead.",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Refresh every minute
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [toast, usingSampleData, user?.employeeId, user?.role, user?.position, user?.department]);

  const getDateRangeForFilter = (): { startDate: Date; endDate: Date } => {
    const today = new Date();
    const endDate = new Date(today);

    if (reportFilter === "daily") {
      const startDate = new Date(today);
      return { startDate, endDate };
    } else if (reportFilter === "weekly") {
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - today.getDay());
      return { startDate, endDate };
    } else {
      // monthly
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      return { startDate, endDate };
    }
  };

  const isDateInRange = (dateStr: string, startDate: Date, endDate: Date): boolean => {
    const date = new Date(dateStr);
    return date >= startDate && date <= endDate;
  };

  const departmentRecords = useMemo(() => {
    const employeeMap = new Map(employees.map((emp) => [emp.employeeId, emp]));
    const { startDate, endDate } = getDateRangeForFilter();

    // Filter attendance based on user role and date range
    let filteredAttendance = attendance;
    
    if (isSystemAdmin) {
      // System admins see ALL records
      filteredAttendance = attendance.filter((att) => isDateInRange(att.date, startDate, endDate));
    } else if (isDepartmentHead && user?.department) {
      // Department heads see records of OTHER employees in their department (excluding their own records)
      filteredAttendance = attendance.filter((att) => {
        const employee = employeeMap.get(att.employeeId);
        return employee?.department === user.department && 
               att.employeeId !== user?.employeeId && 
               isDateInRange(att.date, startDate, endDate);
      });
    } else {
      // Regular employees see only their own records
      filteredAttendance = attendance.filter(
        (att) => att.employeeId === user?.employeeId && isDateInRange(att.date, startDate, endDate)
      );
    }
    // Regular admins see all records (no filter needed)

    // Group attendance by department and date
    const grouped = new Map<string, Map<string, AttendanceRecord[]>>();

    filteredAttendance.forEach((att) => {
      const employee = employeeMap.get(att.employeeId);
      const dept = employee?.department || "Unassigned";
      const date = att.date;

      if (!grouped.has(dept)) {
        grouped.set(dept, new Map());
      }

      const deptMap = grouped.get(dept)!;
      if (!deptMap.has(date)) {
        deptMap.set(date, []);
      }

      const statusMap: Record<string, string> = {
        present: "Present",
        absent: "Absent",
        late: "Late",
        "half-day": "Half Day",
        leave: "Leave",
      };

      const formatTime = (time: string) => {
        if (!time) return "-";
        const [hours, minutes] = time.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
      };

      // Calculate minutes late if check-in is after 8:11 AM
      let statusText = statusMap[att.status] || att.status;
      if (att.checkIn && (att.status === "late" || att.status === "present")) {
        const checkInTime = new Date(`2000-01-01T${att.checkIn}`);
        const expectedTime = new Date("2000-01-01T08:11"); // 8:11 AM threshold
        const minutesLate = Math.floor(
          (checkInTime.getTime() - expectedTime.getTime()) / 60000
        );

        if (minutesLate > 0) {
          statusText = `Late (${minutesLate} mins)`;
        } else if (att.status === "late") {
          statusText = "Late";
        }
      }

      deptMap.get(date)!.push({
        name: att.employeeName || employee?.fullName || "Unknown",
        type: employee?.position || "Regular",
        signIn: formatTime(att.checkIn || ""),
        signOut: formatTime(att.checkOut || ""),
        status: statusText,
        employeeId: att.employeeId,
        attendanceId: att.id,
        rawStatus: att.status,
        rawCheckIn: att.checkIn || "",
        rawCheckOut: att.checkOut || "",
      });
    });

    // Convert to array format and filter by search
    const sections: DepartmentRecord[] = [];
    grouped.forEach((deptMap, department) => {
      deptMap.forEach((records, date) => {
        let filtered = records.filter(
          (rec) =>
            rec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rec.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filtered.length > 0) {
          sections.push({ department, date, records: filtered });
        }
      });
    });

    // Sort by date (newest first)
    sections.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return sections;
  }, [searchTerm, attendance, employees, user?.role, user?.employeeId, user?.position, user?.department, reportFilter]);

  // Separate personal records for department heads
  const personalRecords = useMemo(() => {
    if (!isDepartmentHead) return [];
    
    const employeeMap = new Map(employees.map((emp) => [emp.employeeId, emp]));
    const { startDate, endDate } = getDateRangeForFilter();

    // Get only the department head's personal records
    const filteredAttendance = attendance.filter(
      (att) => att.employeeId === user?.employeeId && isDateInRange(att.date, startDate, endDate)
    );

    const grouped = new Map<string, Map<string, AttendanceRecord[]>>();

    filteredAttendance.forEach((att) => {
      const employee = employeeMap.get(att.employeeId);
      const dept = employee?.department || "Unassigned";
      const date = att.date;

      if (!grouped.has(dept)) {
        grouped.set(dept, new Map());
      }

      const deptMap = grouped.get(dept)!;
      if (!deptMap.has(date)) {
        deptMap.set(date, []);
      }

      const statusMap: Record<string, string> = {
        present: "Present",
        absent: "Absent",
        late: "Late",
        "half-day": "Half Day",
        leave: "Leave",
      };

      const formatTime = (time: string) => {
        if (!time) return "-";
        const [hours, minutes] = time.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
      };

      let statusText = statusMap[att.status] || att.status;
      if (att.checkIn && (att.status === "late" || att.status === "present")) {
        const checkInTime = new Date(`2000-01-01T${att.checkIn}`);
        const expectedTime = new Date("2000-01-01T08:11");
        const minutesLate = Math.floor(
          (checkInTime.getTime() - expectedTime.getTime()) / 60000
        );

        if (minutesLate > 0) {
          statusText = `Late (${minutesLate} mins)`;
        } else if (att.status === "late") {
          statusText = "Late";
        }
      }

      deptMap.get(date)!.push({
        name: att.employeeName || employee?.fullName || "Unknown",
        type: employee?.position || "Regular",
        signIn: formatTime(att.checkIn || ""),
        signOut: formatTime(att.checkOut || ""),
        status: statusText,
        employeeId: att.employeeId,
        attendanceId: att.id,
        rawStatus: att.status,
        rawCheckIn: att.checkIn || "",
        rawCheckOut: att.checkOut || "",
      });
    });

    const sections: DepartmentRecord[] = [];
    grouped.forEach((deptMap, department) => {
      deptMap.forEach((records, date) => {
        let filtered = records.filter(
          (rec) =>
            rec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rec.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filtered.length > 0) {
          sections.push({ department, date, records: filtered });
        }
      });
    });

    sections.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return sections;
  }, [searchTerm, attendance, employees, user?.employeeId, reportFilter, isDepartmentHead, user?.role]); // Fixed dependency array

  const handleEditClick = (record: AttendanceRecord, date: string) => {
    // Only admins can edit attendance records
    if (user?.role !== "admin") {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Only admins can edit attendance records.",
      });
      return;
    }

    // Find the actual attendance record
    const attendanceRecord = attendance.find(
      (att) => att.id === record.attendanceId
    );

    if (attendanceRecord) {
      setEditingRecord({ record, date });
      setEditStatus(attendanceRecord.status);
      setEditCheckIn(attendanceRecord.checkIn || "");
      setEditCheckOut(attendanceRecord.checkOut || "");
      setEditNotes(attendanceRecord.notes || "");
      setEditModalOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Attendance record not found.",
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!editingRecord || !editingRecord.record.attendanceId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot save: attendance record not found.",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Convert date to YYYY-MM-DD format
      // Check if date is already in YYYY-MM-DD format
      let formattedDate: string;
      if (/^\d{4}-\d{2}-\d{2}$/.test(editingRecord.date)) {
        formattedDate = editingRecord.date;
      } else {
        const dateObj = new Date(editingRecord.date);
        if (isNaN(dateObj.getTime())) {
          throw new Error("Invalid date format");
        }
        formattedDate = dateObj.toISOString().split('T')[0];
      }
      
      // Convert time format from HH:MM (24-hour) to ensure it's correct
      // The time input already gives HH:MM format, but we need to ensure it's valid
      const formatTime = (time: string) => {
        if (!time) return null;
        // If time is already in HH:MM format, return it
        if (/^\d{2}:\d{2}$/.test(time)) {
          return time;
        }
        // If it's in HH:MM:SS format, remove seconds
        if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
          return time.substring(0, 5);
        }
        return null;
      };

      const formattedCheckIn = formatTime(editCheckIn);
      const formattedCheckOut = formatTime(editCheckOut);

      const response = await fetch(
        `${API_BASE_URL}/attendance/${editingRecord.record.attendanceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId: editingRecord.record.employeeId,
            employeeName: editingRecord.record.name,
            date: formattedDate,
            status: editStatus,
            checkIn: formattedCheckIn,
            checkOut: formattedCheckOut,
            notes: editNotes || null,
            updatedBy: user?.fullName || "Admin",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to update attendance record"
        );
      }

      const data = await response.json();
      const updated = data.data;

      // Update local state
      setAttendance((prev) =>
        prev.map((att) => (att.id === updated.id ? updated : att))
      );

      toast({
        title: "Success",
        description: "Attendance record updated successfully.",
      });
      setEditModalOpen(false);
      setEditingRecord(null);
    } catch (error) {
      console.error("Error updating attendance", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Unable to update attendance record. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayoutNew>
      <div className="space-y-6">
        <Card className="shadow-sm border-border">
          <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between bg-card rounded-t-xl">
            <div>
              <p className="text-xs uppercase text-muted-foreground tracking-[0.3em]">
                Attendance
              </p>
              {/* <CardTitle className="text-2xl">Welcome back, Admin!</CardTitle> */}
            </div>
            <div className="bg-primary/10 rounded-full p-3 text-primary">
              <CalendarDays className="w-6 h-6" />
            </div>
          </CardHeader>
          {/* <CardContent className="flex flex-wrap gap-3 pt-4">
            {toolbarButtons.map((btn) => (
              <Button
                key={btn.label}
                variant="outline"
                className={`rounded-full px-5 h-auto py-3 flex items-center gap-2 border ${btn.border} ${btn.bg} ${btn.text} hover:opacity-90`}
              >
                <Users className="w-4 h-4" />
                {btn.label}
              </Button>
            ))}
          </CardContent> */}
        </Card>

        <Card className="shadow-sm border-border">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <CardTitle className="text-xl">Attendance List</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Daily summary per department
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              {isDepartmentHead && (
                <Select value={reportFilter} onValueChange={(value: any) => setReportFilter(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardHeader>
          {usingSampleData && (
            <div className="px-6 pb-2 -mt-2">
              <Badge variant="outline" className="rounded-full px-3">
                Sample data preview
              </Badge>
            </div>
          )}

          <div className="divide-y">
            {isDepartmentHead && personalRecords.length > 0 && (viewMode === "personal" || !viewMode) && (
              <div className="py-6 px-6 space-y-4 bg-blue-50">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-primary">My Personal Attendance</h3>
                    <p className="text-sm text-muted-foreground">Your own attendance records</p>
                  </div>
                  <Button
                    className="rounded-full px-5"
                    onClick={() => {
                      const csvRows: string[] = [];
                      csvRows.push(
                        "Employee Name,Employee ID,Employee Type,Date,Sign In Time,Sign Out Time,Attendance Status"
                      );
                      personalRecords.forEach((dept) => {
                        dept.records.forEach((rec) => {
                          csvRows.push(
                            `"${rec.name}","${rec.employeeId}","${
                              rec.type
                            }","${new Date(dept.date).toLocaleDateString()}","${
                              rec.signIn
                            }","${rec.signOut}","${rec.status}"`
                          );
                        });
                      });
                      const csvContent = csvRows.join("\n");
                      const blob = new Blob([csvContent], {
                        type: "text/csv;charset=utf-8;",
                      });
                      const link = document.createElement("a");
                      const url = URL.createObjectURL(blob);
                      link.setAttribute("href", url);
                      link.setAttribute(
                        "download",
                        `my_attendance_${reportFilter}_${new Date().toISOString().split('T')[0]}.csv`
                      );
                      link.style.visibility = "hidden";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      toast({
                        title: "Report Generated",
                        description: `CSV exported for your personal attendance (${reportFilter})`,
                      });
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>

                {personalRecords.map((dept, sectionIndex) => (
                  <div
                    key={`personal-${dept.department}-${dept.date}-${sectionIndex}`}
                    className="space-y-4"
                  >
                    <div>
                      <p className="uppercase text-xs font-semibold text-muted-foreground">
                        {dept.department}
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {new Date(dept.date).toLocaleDateString(undefined, {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-t border-border/60">
                        <thead className="bg-primary text-white">
                          <tr>
                            <th className="py-3 px-4 text-left font-medium">Employee Name</th>
                            <th className="py-3 px-4 text-left font-medium">Employee Type</th>
                            <th className="py-3 px-4 text-left font-medium">Date</th>
                            <th className="py-3 px-4 text-left font-medium">Sign In Time</th>
                            <th className="py-3 px-4 text-left font-medium">Sign Out Time</th>
                            <th className="py-3 px-4 text-left font-medium">Attendance Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dept.records.map((rec, index) => (
                            <tr
                              key={`${rec.employeeId}-${dept.date}-${index}`}
                              className={index % 2 === 0 ? "bg-[#eef3ff]" : "bg-white"}
                            >
                              <td className="py-3 px-4 font-medium text-foreground">{rec.name}</td>
                              <td className="py-3 px-4">{rec.type}</td>
                              <td className="py-3 px-4">
                                {new Date(dept.date).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4">{rec.signIn}</td>
                              <td className="py-3 px-4">{rec.signOut}</td>
                              <td className="py-3 px-4">
                                <Badge
                                  variant="secondary"
                                  className="rounded-full px-3 bg-primary/10 text-primary"
                                >
                                  {rec.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isDepartmentHead && departmentRecords.length > 0 && viewMode === "department" && (
              <div className="py-6 px-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-primary">Department Attendance</h3>
                    <p className="text-sm text-muted-foreground">Attendance records for your department</p>
                  </div>
                  <Button
                    className="rounded-full px-5"
                    onClick={() => {
                      const csvRows: string[] = [];
                      csvRows.push(
                        "Employee Name,Employee ID,Employee Type,Date,Sign In Time,Sign Out Time,Attendance Status"
                      );
                      departmentRecords.forEach((dept) => {
                        dept.records.forEach((rec) => {
                          csvRows.push(
                            `"${rec.name}","${rec.employeeId}","${
                              rec.type
                            }","${new Date(dept.date).toLocaleDateString()}","${
                              rec.signIn
                            }","${rec.signOut}","${rec.status}"`
                          );
                        });
                      });
                      const csvContent = csvRows.join("\n");
                      const blob = new Blob([csvContent], {
                        type: "text/csv;charset=utf-8;",
                      });
                      const link = document.createElement("a");
                      const url = URL.createObjectURL(blob);
                      link.setAttribute("href", url);
                      link.setAttribute(
                        "download",
                        `department_attendance_${reportFilter}_${new Date().toISOString().split('T')[0]}.csv`
                      );
                      link.style.visibility = "hidden";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      toast({
                        title: "Report Generated",
                        description: `CSV exported for department attendance (${reportFilter})`,
                      });
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </div>
            )}

            {/* Empty state - show appropriate message based on role and view */}
            {(isDepartmentHead && viewMode === "personal" ? personalRecords.length === 0 : 
              isDepartmentHead && viewMode === "department" ? departmentRecords.length === 0 : 
              isSystemAdmin || user?.role === "employee" ? departmentRecords.length === 0 : false) ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No attendance records found.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Add attendance records to see them here.
                </p>
              </div>
            ) : (isDepartmentHead || user?.role === "employee") ? null : (
              /* System Admin sees all records without dual-view */
              departmentRecords.map((dept, sectionIndex) => (
                <div
                  key={`${dept.department}-${dept.date}-${sectionIndex}`}
                  className="py-6 px-0 space-y-4"
                >
                  <div className="px-6">
                    <div>
                      <p className="uppercase text-xs font-semibold text-muted-foreground">
                        {dept.department}
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {new Date(dept.date).toLocaleDateString(undefined, {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-t border-border/60">
                      <thead className="bg-primary text-white">
                        <tr>
                          <th className="py-3 px-4 text-left font-medium">
                            Employee Name
                          </th>
                          <th className="py-3 px-4 text-left font-medium">
                            Employee Type
                          </th>
                          <th className="py-3 px-4 text-left font-medium">
                            Date
                          </th>
                          <th className="py-3 px-4 text-left font-medium">
                            Sign In Time
                          </th>
                          <th className="py-3 px-4 text-left font-medium">
                            Sign Out Time
                          </th>
                          <th className="py-3 px-4 text-left font-medium">
                            Attendance Status
                          </th>
                          <th className="py-3 px-4 text-left font-medium">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dept.records.map((rec, index) => (
                          <tr
                            key={`${rec.employeeId}-${dept.date}-${index}`}
                            className={
                              index % 2 === 0 ? "bg-[#eef3ff]" : "bg-white"
                            }
                          >
                            <td className="py-3 px-4 font-medium text-foreground">
                              {rec.name}
                            </td>
                            <td className="py-3 px-4">{rec.type}</td>
                            <td className="py-3 px-4">
                              {new Date(dept.date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">{rec.signIn}</td>
                            <td className="py-3 px-4">{rec.signOut}</td>
                            <td className="py-3 px-4">
                              <Badge
                                variant="secondary"
                                className="rounded-full px-3 bg-primary/10 text-primary"
                              >
                                {rec.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(rec, dept.date)}
                                className="text-primary hover:text-primary/80 hover:bg-primary/10"
                                disabled={user?.role !== "admin"}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Edit Attendance Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Attendance</DialogTitle>
              <DialogDescription>
                {editingRecord &&
                  `Update attendance for ${
                    editingRecord.record.name
                  } on ${new Date(editingRecord.date).toLocaleDateString()}`}
              </DialogDescription>
            </DialogHeader>
            {editingRecord && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Employee Name</Label>
                    <Input value={editingRecord.record.name} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Employee ID</Label>
                    <Input value={editingRecord.record.employeeId} disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    value={new Date(editingRecord.date).toLocaleDateString()}
                    disabled
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sign In Time</Label>
                    <Input
                      type="time"
                      value={editCheckIn}
                      onChange={(e) => setEditCheckIn(e.target.value)}
                      disabled={
                        editStatus === "leave" || editStatus === "absent"
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sign Out Time</Label>
                    <Input
                      type="time"
                      value={editCheckOut}
                      onChange={(e) => setEditCheckOut(e.target.value)}
                      disabled={
                        editStatus === "leave" || editStatus === "absent"
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Attendance Status</Label>
                  <Select
                    value={editStatus}
                    onValueChange={(
                      value:
                        | "present"
                        | "absent"
                        | "late"
                        | "half-day"
                        | "leave"
                    ) => {
                      setEditStatus(value);
                      if (value === "leave" || value === "absent") {
                        setEditCheckIn("");
                        setEditCheckOut("");
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="half-day">Half Day</SelectItem>
                      <SelectItem value="leave">Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add notes about this attendance record..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditModalOpen(false);
                      setEditingRecord(null);
                    }}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayoutNew>
  );
};

export default AttendanceList;
