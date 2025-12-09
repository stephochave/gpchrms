import { useEffect, useState } from "react";
import DashboardLayoutNew from "@/components/Layout/DashboardLayoutNew";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeDepartment: string | null;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string | null;
  status: "pending" | "approved" | "rejected" | "department_approved";
}

interface ReportData {
  total: number;
  approved: number;
  rejected: number;
  pending: number;
  departmentApproved: number;
}

const statusStyles = {
  pending: "bg-amber-100 text-amber-800",
  department_approved: "bg-blue-100 text-blue-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
};

const LeaveReports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reportType, setReportType] = useState("yearly"); // yearly, monthly, department, employee
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [department, setDepartment] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [employeeIdInput, setEmployeeIdInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all"); // all, approved, rejected, pending, department_approved
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all leaves
  useEffect(() => {
    const fetchLeaves = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/leaves`);
        const data = await res.json();
        setLeaves(data.data || []);

        // Extract unique departments and employees
        const depts = new Set<string>();
        const emps = new Map<string, string>();
        (data.data || []).forEach((leave: LeaveRequest) => {
          if (leave.employeeDepartment) {
            depts.add(leave.employeeDepartment);
          }
          emps.set(leave.employeeId, leave.employeeName);
        });
        setDepartments(Array.from(depts).sort());
        setEmployees(
          Array.from(emps.entries())
            .map(([id, name]) => ({ id, name }))
            .sort((a, b) => a.name.localeCompare(b.name))
        );
      } catch (error) {
        console.error("Error fetching leaves", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch leave data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === "admin") {
      fetchLeaves();
    }
  }, [user, toast]);

  // Filter leaves based on report type
  const getFilteredLeaves = () => {
    let filtered = [...leaves];

    if (reportType === "yearly") {
      filtered = filtered.filter(
        (l) => new Date(l.startDate).getFullYear().toString() === year
      );
    } else if (reportType === "monthly") {
      const selectedYear = parseInt(year);
      const selectedMonth = parseInt(month);
      filtered = filtered.filter((l) => {
        const date = new Date(l.startDate);
        return (
          date.getFullYear() === selectedYear &&
          date.getMonth() + 1 === selectedMonth
        );
      });
    } else if (reportType === "department") {
      if (department !== "all") {
        filtered = filtered.filter(
          (l) => l.employeeDepartment === department
        );
      }
    } else if (reportType === "employee") {
      if (employeeIdInput.trim()) {
        filtered = filtered.filter((l) => 
          l.employeeId.toLowerCase() === employeeIdInput.trim().toLowerCase()
        );
      }
    }

    // Apply category filter (approval status) across all report types
    if (categoryFilter !== "all") {
      filtered = filtered.filter((l) => l.status === categoryFilter);
    }

    return filtered;
  };

  // Calculate report statistics
  const calculateStats = (filteredLeaves: LeaveRequest[]): ReportData => {
    return {
      total: filteredLeaves.length,
      approved: filteredLeaves.filter((l) => l.status === "approved").length,
      rejected: filteredLeaves.filter((l) => l.status === "rejected").length,
      pending: filteredLeaves.filter((l) => l.status === "pending").length,
      departmentApproved: filteredLeaves.filter(
        (l) => l.status === "department_approved"
      ).length,
    };
  };

  const filteredLeaves = getFilteredLeaves();
  const stats = calculateStats(filteredLeaves);

  const handleExport = () => {
    // Create CSV content
    let csvContent = "Employee Name,Employee ID,Department,Leave Type,Start Date,End Date,Status,Reason\n";

    filteredLeaves.forEach((leave) => {
      const reason = (leave.reason || "").replace(/"/g, '""');
      csvContent += `"${leave.employeeName}","${leave.employeeId}","${
        leave.employeeDepartment || ""
      }","${leave.leaveType}","${leave.startDate}","${leave.endDate}","${
        leave.status
      }","${reason}"\n`;
    });

    // Create and download file
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent)
    );
    const reportName =
      reportType === "yearly"
        ? `leave_report_${year}`
        : reportType === "monthly"
        ? `leave_report_${year}_${month}`
        : `leave_report_${department}`;
    element.setAttribute("download", `${reportName}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Success",
      description: "Report exported successfully",
    });
  };

  if (user?.role !== "admin") {
    return (
      <DashboardLayoutNew>
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            Only administrators can access this page.
          </p>
        </div>
      </DashboardLayoutNew>
    );
  }

  return (
    <DashboardLayoutNew>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-foreground">Leave Reports</h1>
          <p className="text-muted-foreground">
            Generate and view leave request reports by year, month, or department.
          </p>
        </div>

        {/* Report Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="department">By Department</SelectItem>
                    <SelectItem value="employee">By Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(reportType === "yearly" || reportType === "monthly") && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Year</label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 5 }, (_, i) => {
                        const y = new Date().getFullYear() - 2 + i;
                        return (
                          <SelectItem key={y} value={y.toString()}>
                            {y}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {reportType === "monthly" && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Month</label>
                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => {
                        const m = i + 1;
                        const monthName = new Date(2024, i).toLocaleString(
                          "default",
                          { month: "long" }
                        );
                        return (
                          <SelectItem key={m} value={m.toString()}>
                            {monthName}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {reportType === "department" && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Department</label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {reportType === "employee" && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Employee ID</label>
                  <Input
                    placeholder="Enter employee ID (e.g., 25-GPC-00008)"
                    value={employeeIdInput}
                    onChange={(e) => setEmployeeIdInput(e.target.value)}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Status Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="department_approved">Department Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col justify-end">
                <Button onClick={handleExport} className="w-full">
                  Export to CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Title */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            {reportType === "yearly" && `Leave Report - ${year}`}
            {reportType === "monthly" && `Leave Report - ${new Date(parseInt(year), parseInt(month) - 1).toLocaleString("default", { month: "long", year: "numeric" })}`}
            {reportType === "department" && `Leave Report - Department: ${department === "all" ? "All Departments" : department}`}
            {reportType === "employee" && `Leave Report - Employee: ${employeeIdInput.trim() ? employees.find(e => e.id.toLowerCase() === employeeIdInput.trim().toLowerCase())?.name || employeeIdInput : "Enter Employee ID"}`}
          </h2>
        </div>

        {/* Report Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {stats.approved}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Department Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.departmentApproved}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {stats.pending}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600">
                {stats.rejected}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {reportType === "yearly"
                ? `Yearly Report - ${year}`
                : reportType === "monthly"
                ? `Monthly Report - ${new Date(
                    parseInt(year),
                    parseInt(month) - 1
                  ).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}`
                : `Department Report${
                    department !== "all" ? ` - ${department}` : ""
                  }`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaves.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        {isLoading ? "Loading..." : "No leave requests found for this period."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLeaves.map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell className="font-medium">
                          <div>{leave.employeeName}</div>
                          <div className="text-xs text-muted-foreground">
                            {leave.employeeId}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {leave.employeeDepartment || "—"}
                        </TableCell>
                        <TableCell className="capitalize">{leave.leaveType}</TableCell>
                        <TableCell className="text-sm">
                          {leave.startDate === leave.endDate
                            ? new Date(leave.startDate).toLocaleDateString()
                            : `${new Date(leave.startDate).toLocaleDateString()} → ${new Date(leave.endDate).toLocaleDateString()}`}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              statusStyles[
                                leave.status as keyof typeof statusStyles
                              ]
                            }
                          >
                            {leave.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm max-w-xs truncate">
                          {leave.reason || "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayoutNew>
  );
};

export default LeaveReports;
