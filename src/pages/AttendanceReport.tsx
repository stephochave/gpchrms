import { useMemo, useState, useEffect, useCallback } from "react";
import DashboardLayoutNew from "@/components/Layout/DashboardLayoutNew";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportRow {
  name: string;
  type: string;
  date: string;
  signIn: string;
  signOut: string;
  status: string;
  employeeId: string;
  attendanceId: string;
}

interface ReportSection {
  department: string;
  date: string;
  rows: ReportRow[];
}

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
  employmentType?: string;
}

const AttendanceReport = () => {
  // Set default date to today for easy daily report generation
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usingSampleData, setUsingSampleData] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Attendance | null>(null);
  const [editForm, setEditForm] = useState({
    status: "present" as Attendance["status"],
    checkIn: "",
    checkOut: "",
    notes: "",
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const { toast } = useToast();

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const sampleEmployees: Employee[] = [
    {
      id: "sample-1",
      employeeId: "25-GPC-0001",
      fullName: "Ana Dela Cruz",
      department: "HR Department",
      position: "HR Specialist",
      employmentType: "Regular",
    },
    {
      id: "sample-2",
      employeeId: "25-GPC-0002",
      fullName: "Mark Reyes",
      department: "Finance Department",
      position: "Accountant",
      employmentType: "Regular",
    },
    {
      id: "sample-3",
      employeeId: "25-GPC-0003",
      fullName: "Lea Santos",
      department: "IT Department",
      position: "IT Coordinator",
      employmentType: "Project-Based",
    },
  ];

  const sampleAttendance: Attendance[] = [
    {
      id: "att-sample-1",
      employeeId: "25-GPC-0001",
      employeeName: "Ana Dela Cruz",
      date: today,
      checkIn: "08:05",
      checkOut: "17:02",
      status: "present",
      notes: "On time",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "att-sample-2",
      employeeId: "25-GPC-0002",
      employeeName: "Mark Reyes",
      date: today,
      checkIn: "08:25",
      checkOut: "17:45",
      status: "late",
      notes: "On Leave",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "att-sample-3",
      employeeId: "25-GPC-0003",
      employeeName: "Lea Santos",
      date: today,
      status: "absent",
      notes: "Filed leave",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const applySampleData = () => {
    setAttendance(sampleAttendance);
    setEmployees(sampleEmployees);
    setUsingSampleData(true);
  };

  const fetchReportsData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [attendanceRes, employeesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/attendance`),
        fetch(`${API_BASE_URL}/employees?status=active`),
      ]);

      const attendancePayload = attendanceRes.ok
        ? (await attendanceRes.json()).data || []
        : [];
      const employeePayload = employeesRes.ok
        ? (await employeesRes.json()).data || []
        : [];

      if (attendancePayload.length === 0 || employeePayload.length === 0) {
        applySampleData();
      } else {
        setAttendance(attendancePayload);
        setEmployees(employeePayload);
        setUsingSampleData(false);
      }
    } catch (error) {
      console.error("Error fetching data", error);
      applySampleData();
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Unable to load attendance data. Showing sample data instead.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL, toast]);

  useEffect(() => {
    fetchReportsData();
  }, [fetchReportsData]);

  const reportData = useMemo(() => {
    // Filter attendance by date range if provided, otherwise show all
    let allAttendance = attendance;
    if (startDate && endDate) {
      allAttendance = attendance.filter((att) => {
        const attDate = new Date(att.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return attDate >= start && attDate <= end;
      });
    } else if (startDate) {
      // If only start date is provided, show that single day
      allAttendance = attendance.filter((att) => att.date === startDate);
    }

    const employeeMap = new Map(employees.map((emp) => [emp.employeeId, emp]));

    // Group attendance by department and date
    const grouped = new Map<string, Map<string, ReportRow[]>>();

    allAttendance.forEach((att) => {
      const employee = employeeMap.get(att.employeeId);
      if (!employee) return;

      const dept = employee.department || "Unassigned";
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
        if (!time) return "---------";
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

      // Use employmentType instead of position
      const employmentType = employee.employmentType || "Regular";
      // Ensure it's one of the valid types
      const validTypes = [
        "Regular",
        "Contractual",
        "Probationary",
        "Project-Based",
      ];
      const employeeType = validTypes.includes(employmentType)
        ? employmentType
        : "Regular";

      deptMap.get(date)!.push({
        name: employee.fullName,
        type: employeeType,
        date: new Date(date)
          .toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })
          .replace(/\//g, "-"),
        signIn: formatTime(att.checkIn),
        signOut: formatTime(att.checkOut || ""),
        status: statusText,
        employeeId: att.employeeId,
        attendanceId: att.id,
      });
    });

    // Convert to array format
    const sections: ReportSection[] = [];
    grouped.forEach((deptMap, department) => {
      deptMap.forEach((rows, date) => {
        sections.push({ department, date, rows });
      });
    });

    // Sort by date (newest first)
    sections.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Filter by search term
    const filtered = sections.filter((section) => section.rows.length > 0);

    return filtered;
  }, [startDate, endDate, attendance, employees]);

  const handleGenerate = () => {
    if (!startDate) {
      toast({
        variant: "destructive",
        title: "Date Required",
        description:
          "Please select at least a start date to generate a report.",
      });
      return;
    }

    // If only start date is provided, use it as both start and end (single day report)
    const reportStartDate = startDate;
    const reportEndDate = endDate || startDate;

    if (reportData.length === 0) {
      toast({
        variant: "destructive",
        title: "No Data",
        description: "No attendance records found for the selected date(s).",
      });
      return;
    }

    // Generate CSV
    const csvRows: string[] = [];
    csvRows.push(
      "Department,Date,Employee Name,Employee ID,Employee Type,Sign In Time,Sign Out Time,Attendance Status"
    );

    reportData.forEach((section) => {
      section.rows.forEach((row) => {
        csvRows.push(
          `"${section.department}","${section.date}","${row.name}","${row.employeeId}","${row.type}","${row.signIn}","${row.signOut}","${row.status}"`
        );
      });
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    const fileName =
      endDate && endDate !== startDate
        ? `attendance_report_${reportStartDate}_to_${reportEndDate}.csv`
        : `attendance_report_${reportStartDate}.csv`;
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Report Generated",
      description:
        endDate && endDate !== startDate
          ? `Attendance report exported successfully for ${reportStartDate} to ${reportEndDate}.`
          : `Attendance report exported successfully for ${reportStartDate}.`,
    });
  };

  const openEditDialog = (attendanceId: string) => {
    const record = attendance.find((att) => att.id === attendanceId);
    if (!record) return;
    setEditingRecord(record);
    setEditForm({
      status: record.status,
      checkIn: record.checkIn || "",
      checkOut: record.checkOut || "",
      notes: record.notes || "",
    });
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditingRecord(null);
  };

  const handleSaveEdit = async () => {
    if (!editingRecord) return;
    try {
      setIsSavingEdit(true);
      const response = await fetch(
        `${API_BASE_URL}/attendance/${editingRecord.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId: editingRecord.employeeId,
            employeeName: editingRecord.employeeName,
            date: editingRecord.date,
            status: editForm.status,
            checkIn: editForm.checkIn || null,
            checkOut: editForm.checkOut || null,
            notes: editForm.notes || null,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update attendance");
      }

      toast({
        title: "Attendance updated",
        description: "Record saved successfully.",
      });
      await fetchReportsData();
      closeEditDialog();
    } catch (error) {
      console.error("Error updating attendance", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Unable to update attendance. Please try again.",
      });
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <DashboardLayoutNew>
      <div className="space-y-6">
        <Card className="shadow-sm border-border">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <CardTitle className="text-2xl">Attendance Report</CardTitle>
              <p className="text-sm text-muted-foreground">
                Generate custom date-range summaries
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Field label="Date">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    // If end date is not set, allow single day report
                  }}
                  max={new Date().toISOString().split("T")[0]}
                />
              </Field>
              <Field label="End Date (Optional)">
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || undefined}
                  max={new Date().toISOString().split("T")[0]}
                  placeholder="Leave empty for single day report"
                />
              </Field>
              <div className="flex items-end">
                <Button
                  onClick={handleGenerate}
                  className="w-full"
                  disabled={isLoading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isLoading ? "Loading..." : "Generate Report"}
                </Button>
              </div>
            </div>
          </CardHeader>
          {usingSampleData && (
            <CardContent className="pt-0">
              <Badge variant="outline" className="rounded-full px-3">
                Sample data preview
              </Badge>
            </CardContent>
          )}
        </Card>

        <Card className="shadow-sm border-border">
          <div className="divide-y">
            {reportData.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No attendance records found.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {startDate && endDate
                    ? `Try adjusting the date range.`
                    : "Add attendance records or adjust your filters."}
                </p>
              </div>
            ) : (
              reportData.map((dept, sectionIndex) => (
                <div
                  key={`${dept.department}-${dept.date}-${sectionIndex}`}
                  className="py-6"
                >
                  <div className="px-6 flex items-center justify-between flex-wrap gap-3">
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
                    <Button
                      variant="outline"
                      className="rounded-full px-5"
                      onClick={() => {
                        const csvRows: string[] = [];
                        csvRows.push(
                          "Employee Name,Employee ID,Employee Type,Date,Sign In Time,Sign Out Time,Attendance Status"
                        );
                        dept.rows.forEach((row) => {
                          csvRows.push(
                            `"${row.name}","${row.employeeId}","${row.type}","${row.date}","${row.signIn}","${row.signOut}","${row.status}"`
                          );
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
                          `attendance_${dept.department.replace(/\s+/g, "_")}_${
                            dept.date
                          }.csv`
                        );
                        link.style.visibility = "hidden";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        toast({
                          title: "Export Successful",
                          description: `CSV exported for ${dept.department}`,
                        });
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>

                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-sm border border-border/60 rounded-xl">
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
                        {dept.rows.map((row, index) => (
                          <tr
                            key={`${row.employeeId}-${row.date}-${index}`}
                            className={
                              index % 2 === 0 ? "bg-[#eef3ff]" : "bg-white"
                            }
                          >
                            <td className="py-3 px-4 font-medium text-foreground">
                              {row.name}
                            </td>
                            <td className="py-3 px-4">{row.type}</td>
                            <td className="py-3 px-4">{row.date}</td>
                            <td className="py-3 px-4">{row.signIn}</td>
                            <td className="py-3 px-4">{row.signOut}</td>
                            <td className="py-3 px-4">
                              <Badge
                                variant="secondary"
                                className="rounded-full px-3 bg-primary/10 text-primary"
                              >
                                {row.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full px-4"
                                onClick={() => openEditDialog(row.attendanceId)}
                              >
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
      </div>

      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) {
            closeEditDialog();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Attendance Record</DialogTitle>
            <DialogDescription>
              Update the status or time entries for{" "}
              {editingRecord?.employeeName ?? "the selected employee"}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Field label="Employee">
              <Input value={editingRecord?.employeeName ?? ""} readOnly />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Status">
                <Select
                  value={editForm.status}
                  onValueChange={(value) =>
                    setEditForm((prev) => ({
                      ...prev,
                      status: value as Attendance["status"],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="half-day">Half Day</SelectItem>
                    <SelectItem value="leave">Leave</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Date">
                <Input value={editingRecord?.date ?? ""} readOnly />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Check In">
                <Input
                  type="time"
                  value={editForm.checkIn}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      checkIn: e.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Check Out">
                <Input
                  type="time"
                  value={editForm.checkOut}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      checkOut: e.target.value,
                    }))
                  }
                />
              </Field>
            </div>
            <Field label="Notes">
              <Textarea
                rows={3}
                value={editForm.notes}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Reason for adjustment or remarks"
              />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSavingEdit}>
              {isSavingEdit ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayoutNew>
  );
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2 w-full">
    <Label className="text-sm font-semibold text-muted-foreground">
      {label}
    </Label>
    {children}
  </div>
);

export default AttendanceReport;
