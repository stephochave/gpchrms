import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayoutNew from "@/components/Layout/DashboardLayoutNew";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Info, Printer } from "lucide-react";
import { apiFetch } from "@/lib/fetch";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const LEAVE_TYPES = ["vacation", "sick", "emergency", "unpaid", "other"] as const;
type LeaveType = (typeof LEAVE_TYPES)[number];
type LeaveStatus = "pending" | "approved" | "rejected" | "department_approved";

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeDepartment: string | null;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string | null;
  status: LeaveStatus | "department_approved";
  departmentHeadComment: string | null;
  departmentHeadApprovedBy: string | null;
  departmentHeadApprovedAt: string | null;
  adminComment: string | null;
  decidedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

interface LeaveStats {
  employeeId: string;
  employeeName: string;
  year: number;
  maxLeaves: number;
  usedCount: number;
  remaining: number;
}

const statusStyles: Record<LeaveStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  department_approved: "bg-blue-100 text-blue-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
};

const MAX_YEARLY_LEAVES = 10;

const Leaves = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const viewParam = searchParams.get("view"); // "my" or "department"

  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [leaveStats, setLeaveStats] = useState<Map<string, LeaveStats>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | LeaveStatus>("all");
  const [searchQuery, setSearchQuery] = useState(""); // Search by employee name or ID
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    leaveType: "vacation" as LeaveType,
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [decisionOpen, setDecisionOpen] = useState(false);
  const [decisionComment, setDecisionComment] = useState("");
  const [decisionTarget, setDecisionTarget] = useState<
    { id: string; action: Exclude<LeaveStatus, "pending"> } | null
  >(null);
  const [departmentHeadDecisionOpen, setDepartmentHeadDecisionOpen] = useState(false);
  const [departmentHeadComment, setDepartmentHeadComment] = useState("");
  const [departmentHeadTarget, setDepartmentHeadTarget] = useState<
    { id: string; action: "department_approved" | "rejected" } | null
  >(null);

  const isAdmin = user?.role === "admin";
  const employeeId = user?.employeeId;
  
  // Check if user is a department head, dean, or principal based on position
  const isDepartmentHead = user?.role === "admin" && user?.position && 
                           (user.position.toLowerCase().includes("head") || 
                            user.position.toLowerCase().includes("dean") || 
                            user.position.toLowerCase().includes("principal"));
  
  // System admin is admin without department head position
  const isSystemAdmin = user?.role === "admin" && !isDepartmentHead;

  const fetchRequests = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      
      // If department head, fetch all leaves from their department
      // If regular employee, fetch only their own leaves
      // If admin, fetch all leaves
      if (isDepartmentHead && user.department) {
        params.append("department", user.department);
      } else if (!isAdmin && employeeId) {
        params.append("employeeId", employeeId);
      }
      
      if (filterStatus !== "all") params.append("status", filterStatus);

      const url = params.toString()
        ? `${API_BASE_URL}/leaves?${params.toString()}`
        : `${API_BASE_URL}/leaves`;

      const res = await apiFetch(url);
      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Failed to load leaves");

      setRequests(data.data || []);

      // Fetch leave statistics for admin view
      if (isAdmin) {
        const statsRes = await fetch(`${API_BASE_URL}/leaves/stats`);
        const statsData = await statsRes.json();
        const statsMap = new Map<string, LeaveStats>();
        (statsData.data || []).forEach((stat: LeaveStats) => {
          statsMap.set(stat.employeeId, stat);
        });
        setLeaveStats(statsMap);
      }
    } catch (error: any) {
      console.error("Error fetching leave requests", error);
      toast({
        variant: "destructive",
        title: "Unable to load leaves",
        description:
          error?.message || "Please check your connection or try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, user?.role, user?.employeeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!employeeId) {
      toast({
        variant: "destructive",
        title: "Profile incomplete",
        description: "Your employee ID is missing. Contact an admin to update it.",
      });
      return;
    }

    if (!form.startDate || !form.endDate) {
      toast({
        variant: "destructive",
        title: "Dates required",
        description: "Please select a start and end date for your leave.",
      });
      return;
    }

    if (remainingThisYear <= 0) {
      toast({
        variant: "destructive",
        title: "Leave limit reached",
        description: "You have used all 10 leaves for this year.",
      });
      return;
    }

    const startDateObj = new Date(form.startDate);
    const monthClash = requests.some((r) => {
      if (r.employeeId !== employeeId) return false;
      const d = new Date(r.startDate);
      return (
        d.getFullYear() === startDateObj.getFullYear() &&
        d.getMonth() === startDateObj.getMonth() &&
        (r.status === "pending" || r.status === "approved")
      );
    });

    if (monthClash) {
      toast({
        variant: "destructive",
        title: "Monthly limit reached",
        description: "You already have a leave request this month (pending or approved).",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiFetch(`${API_BASE_URL}/leaves`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          employeeName: user.fullName,
          employeeDepartment: user?.department || null,
          leaveType: form.leaveType,
          startDate: form.startDate,
          endDate: form.endDate,
          reason: form.reason || null,
          createdBy: user.fullName,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to submit leave");

      toast({ title: "Leave submitted", description: "We will notify you once reviewed." });
      setForm({ leaveType: "vacation", startDate: "", endDate: "", reason: "" });
      fetchRequests();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error?.message || "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDecision = (id: string, action: Exclude<LeaveStatus, "pending">) => {
    setDecisionTarget({ id, action });
    setDecisionComment("");
    setDecisionOpen(true);
  };

  const submitDecision = async () => {
    if (!decisionTarget || !user) return;
    try {
      const res = await apiFetch(`${API_BASE_URL}/leaves/${decisionTarget.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: decisionTarget.action,
          adminComment: decisionComment || null,
          decidedBy: user.fullName,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Unable to update status");

      toast({ title: `Leave ${decisionTarget.action}` });
      setDecisionOpen(false);
      setDecisionTarget(null);
      fetchRequests();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error?.message || "Please try again.",
      });
    }
  };

  const openDepartmentHeadDecision = (id: string, action: "department_approved" | "rejected") => {
    setDepartmentHeadTarget({ id, action });
    setDepartmentHeadComment("");
    setDepartmentHeadDecisionOpen(true);
  };

  const submitDepartmentHeadDecision = async () => {
    if (!departmentHeadTarget || !user) return;
    try {
      const res = await fetch(`${API_BASE_URL}/leaves/${departmentHeadTarget.id}/department-approval`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: departmentHeadTarget.action,
          departmentHeadComment: departmentHeadComment || null,
          approvedBy: user.fullName,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Unable to update status");

      toast({ 
        title: departmentHeadTarget.action === "department_approved" 
          ? "Leave recommended for admin approval" 
          : "Leave rejected" 
      });
      setDepartmentHeadDecisionOpen(false);
      setDepartmentHeadTarget(null);
      fetchRequests();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error?.message || "Please try again.",
      });
    }
  };

  const filteredRequests = useMemo(() => {
    let filtered = requests.map((req) => {
      // Extract just the date part (YYYY-MM-DD) from ISO string
      const startDateOnly = req.startDate.split('T')[0];
      const endDateOnly = req.endDate.split('T')[0];
      
      const dateRange =
        startDateOnly === endDateOnly
          ? startDateOnly
          : `${startDateOnly} → ${endDateOnly}`;

      return {
        ...req,
        dateRange,
      };
    });

    // Filter by search query (employee name or ID)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.employeeName.toLowerCase().includes(query) ||
          req.employeeId.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [requests, searchQuery]);

  const { remainingThisYear, alreadyUsedThisMonth, usedThisYear } = useMemo(() => {
    if (!employeeId) return { remainingThisYear: MAX_YEARLY_LEAVES, alreadyUsedThisMonth: false, usedThisYear: 0 };

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const approvedThisYear = requests.filter(
      (r) =>
        r.employeeId === employeeId &&
        r.status === "approved" &&
        new Date(r.startDate).getFullYear() === year
    );

    // Calculate total days used (not just count of requests)
    let usedCount = 0;
    approvedThisYear.forEach((r) => {
      // Parse dates more carefully - handle ISO format with time component
      const startStr = r.startDate.split('T')[0]; // Get just the date part: YYYY-MM-DD
      const endStr = r.endDate.split('T')[0];
      
      const start = new Date(startStr + 'T00:00:00Z');
      const end = new Date(endStr + 'T00:00:00Z');
      
      // Calculate days: difference in days + 1 to include both start and end dates
      const diffMs = end.getTime() - start.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      const days = Math.floor(diffDays) + 1;
      
      usedCount += days;
    });
    
    const remaining = Math.max(0, MAX_YEARLY_LEAVES - usedCount);

    const usedThisMonth = requests.some((r) => {
      if (r.employeeId !== employeeId) return false;
      const d = new Date(r.startDate);
      return (
        d.getFullYear() === year &&
        d.getMonth() === month &&
        (r.status === "pending" || r.status === "approved")
      );
    });

    return { remainingThisYear: remaining, alreadyUsedThisMonth: usedThisMonth, usedThisYear: usedCount };
  }, [employeeId, requests]);

  // Helper function to calculate remaining leaves for any employee
  const getEmployeeRemaining = (empId: string) => {
    const now = new Date();
    const year = now.getFullYear();
    
    const approvedThisYear = requests.filter(
      (r) =>
        r.employeeId === empId &&
        r.status === "approved" &&
        new Date(r.startDate).getFullYear() === year
    );

    let usedCount = 0;
    approvedThisYear.forEach((r) => {
      // Parse dates more carefully - handle ISO format with time component
      const startStr = r.startDate.split('T')[0]; // Get just the date part: YYYY-MM-DD
      const endStr = r.endDate.split('T')[0];
      
      const start = new Date(startStr + 'T00:00:00Z');
      const end = new Date(endStr + 'T00:00:00Z');
      
      // Calculate days: difference in days + 1 to include both start and end dates
      const diffMs = end.getTime() - start.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      const days = Math.floor(diffDays) + 1;
      
      usedCount += days;
    });

    const remaining = Math.max(0, MAX_YEARLY_LEAVES - usedCount);
    return { remaining, usedCount, maxLeaves: MAX_YEARLY_LEAVES };
  };

  const printLeaveSlip = (req: LeaveRequest) => {
    const startDate = new Date(req.startDate).toLocaleDateString();
    const endDate = new Date(req.endDate).toLocaleDateString();
    const numDays = Math.ceil(
      (new Date(req.endDate).getTime() - new Date(req.startDate).getTime()) / 
      (1000 * 60 * 60 * 24)
    ) + 1;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Leave of Absence Slip</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #000;
            padding-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
          }
          .header p {
            margin: 5px 0;
            font-size: 14px;
          }
          .content {
            margin-bottom: 30px;
          }
          .section {
            margin-bottom: 25px;
          }
          .section-title {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 8px;
          }
          .form-row {
            display: flex;
            margin-bottom: 15px;
            gap: 30px;
          }
          .form-group {
            flex: 1;
          }
          .form-group label {
            font-weight: bold;
            display: block;
            margin-bottom: 5px;
            font-size: 12px;
          }
          .form-group .value {
            border-bottom: 1px solid #000;
            padding: 8px 0;
            font-size: 13px;
          }
          .approvals {
            margin-top: 50px;
            display: flex;
            justify-content: space-around;
          }
          .approval-box {
            width: 200px;
            text-align: center;
          }
          .approval-label {
            font-weight: bold;
            font-size: 12px;
            margin-top: 40px;
            border-top: 1px solid #000;
            padding-top: 5px;
          }
          .approval-name {
            font-size: 11px;
            margin-top: 5px;
            min-height: 15px;
          }
          .signature-line {
            border-bottom: 1px solid #000;
            height: 50px;
            margin-bottom: 5px;
          }
          @media print {
            body {
              margin: 0;
              padding: 10mm;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>LEAVE OF ABSENCE SLIP</h1>
          <p>THE GREAT PLEBEIAN COLLEGE</p>
          <p>Albay Campus Penafrancia</p>
        </div>

        <div class="content">
          <div class="section">
            <div class="section-title">EMPLOYEE INFORMATION</div>
            <div class="form-row">
              <div class="form-group" style="flex: 2;">
                <label>Name:</label>
                <div class="value">${req.employeeName}</div>
              </div>
              <div class="form-group">
                <label>Employee ID:</label>
                <div class="value">${req.employeeId}</div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Department:</label>
                <div class="value">${req.employeeDepartment || '-'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">LEAVE DETAILS</div>
            <div class="form-row">
              <div class="form-group">
                <label>Leave Type:</label>
                <div class="value">${req.leaveType.toUpperCase()}</div>
              </div>
              <div class="form-group">
                <label>Number of Days:</label>
                <div class="value">${numDays}</div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Start Date:</label>
                <div class="value">${startDate}</div>
              </div>
              <div class="form-group">
                <label>End Date:</label>
                <div class="value">${endDate}</div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Reason:</label>
                <div class="value">${req.reason || '-'}</div>
              </div>
            </div>
          </div>

          <div class="approvals">
            <div class="approval-box">
              <div class="signature-line"></div>
              <div style="font-size: 12px; margin-top: 5px; margin-bottom: 5px;">${req.departmentHeadApprovedBy || '_________________'}</div>
              <div style="font-weight: bold; font-size: 12px;">Department Head</div>
              <div style="font-size: 11px; font-style: italic; color: #0066cc;">Recommending Approval</div>
            </div>
            <div class="approval-box">
              <div class="signature-line"></div>
              <div style="font-size: 12px; margin-top: 5px; margin-bottom: 5px;">${req.decidedBy || '_________________'}</div>
              <div style="font-weight: bold; font-size: 12px;">HR Admin</div>
              <div style="font-size: 11px; font-style: italic; color: #0066cc;">Final Approval</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return (
    <DashboardLayoutNew>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-foreground">
            {viewParam === "department" ? "Department Leave Requests" : "Leave Management"}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin
              ? "Review and act on employee leave requests."
              : viewParam === "department"
              ? "Review and manage leave requests from employees in your department."
              : "Submit a leave request and track its status."}
          </p>
        </div>

        {/* Show file leave form for employees and department heads when not in department view */}
        {!isSystemAdmin && viewParam !== "department" && (
          <Card>
            <CardHeader className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span>Yearly quota: {MAX_YEARLY_LEAVES} leaves</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="border-emerald-500 text-emerald-700">
                    Remaining this year: {remainingThisYear}
                  </Badge>
                  <Badge variant="outline" className="border-slate-400 text-slate-700">
                    Taken this year: {usedThisYear}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={alreadyUsedThisMonth ? "border-amber-500 text-amber-700" : "border-emerald-500 text-emerald-700"}
                  >
                    {alreadyUsedThisMonth ? "Monthly leave used" : "Monthly leave available"}
                  </Badge>
                </div>
              </div>
              <CardTitle>File a Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-muted-foreground">Leave Type</label>
                  <Select
                    value={form.leaveType}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, leaveType: value as LeaveType }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAVE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-muted-foreground">Start Date</label>
                  <Input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-muted-foreground">End Date</label>
                  <Input
                    type="date"
                    required
                    value={form.endDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm text-muted-foreground">Reason</label>
                  <Textarea
                    rows={3}
                    placeholder="Provide details"
                    required
                    minLength={5}
                    value={form.reason}
                    onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))}
                  />
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit" disabled={isSubmitting || remainingThisYear <= 0}>
                    {remainingThisYear <= 0 ? "Limit reached" : isSubmitting ? "Submitting..." : "Submit Leave"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Show department head review section only when in department view */}
        {isDepartmentHead && viewParam === "department" && (
          <Card>
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Review Employee Leave Requests</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Pending leave requests from employees in your department
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Select
                  value={filterStatus}
                  onValueChange={(value) => setFilterStatus(value as typeof filterStatus)}
                >
                  <SelectTrigger className="w-[170px]">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="department_approved">Recommended</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead className="hidden md:table-cell">My Comment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.filter(r => 
                      r.employeeDepartment === user?.department && 
                      r.employeeId !== employeeId
                    ).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          {isLoading ? "Loading..." : "No leave requests from your department employees."}
                        </TableCell>
                      </TableRow>
                    ) : null}

                    {filteredRequests
                      .filter(r => 
                        r.employeeDepartment === user?.department && 
                        r.employeeId !== employeeId
                      )
                      .map((req) => (
                        <TableRow key={req.id}>
                          <TableCell className="font-medium">
                            <div>{req.employeeName}</div>
                            <div className="text-xs text-muted-foreground">{req.employeeId}</div>
                          </TableCell>
                          <TableCell className="capitalize">{req.leaveType}</TableCell>
                          <TableCell>{req.dateRange}</TableCell>
                          <TableCell>
                            <Badge className={statusStyles[req.status]}>{req.status}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs whitespace-pre-wrap">
                            {req.reason || "—"}
                          </TableCell>
                          <TableCell className="hidden md:table-cell whitespace-pre-wrap text-sm">
                            {req.departmentHeadComment || "—"}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            {req.status === "pending" ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openDepartmentHeadDecision(req.id, "department_approved")}
                                >
                                  Recommend
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => openDepartmentHeadDecision(req.id, "rejected")}
                                >
                                  Reject
                                </Button>
                              </>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Show "My Leave Requests" for:
            - System admins (always - they see all requests)
            - Department heads in personal view (viewParam === "personal" or no view param)
            - Regular employees (always see their own) */}
        {(isSystemAdmin || (isDepartmentHead && viewParam === "personal") || (isDepartmentHead && !viewParam) || (!isAdmin && viewParam !== "department")) && (
          <Card>
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <CardTitle>{isSystemAdmin ? "All Leave Requests" : isDepartmentHead ? "My Leave Requests" : "My Leave Requests"}</CardTitle>
            <div className="flex items-center gap-3 flex-wrap">
              {isSystemAdmin && (
                <Input
                  placeholder="Search by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[200px]"
                />
              )}
              <Select
                value={filterStatus}
                onValueChange={(value) => setFilterStatus(value as typeof filterStatus)}
              >
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="department_approved">Recommended</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    {isSystemAdmin && <TableHead>Department</TableHead>}
                    {isSystemAdmin && <TableHead>Remaining Leaves</TableHead>}
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reason</TableHead>
                    {isSystemAdmin && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(isSystemAdmin ? filteredRequests : filteredRequests.filter(r => r.employeeId === employeeId)).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={isSystemAdmin ? 7 : 5} className="text-center text-muted-foreground">
                        {isLoading ? "Loading..." : "No leave requests found."}
                      </TableCell>
                    </TableRow>
                  )}

                  {(isSystemAdmin ? filteredRequests : filteredRequests.filter(r => r.employeeId === employeeId)).map((req) => {
                    const empStats = getEmployeeRemaining(req.employeeId);
                    return (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">
                        <div>{req.employeeName}</div>
                        <div className="text-xs text-muted-foreground">{req.employeeId}</div>
                      </TableCell>
                      {isSystemAdmin && (
                        <TableCell className="font-medium text-sm">
                          {req.employeeDepartment || "—"}
                        </TableCell>
                      )}
                      {isSystemAdmin && (
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge variant="outline" className="border-emerald-500 text-emerald-700 w-fit">
                              {empStats.remaining} / {empStats.maxLeaves}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {empStats.usedCount} used
                            </span>
                          </div>
                        </TableCell>
                      )}
                      <TableCell className="capitalize">{req.leaveType}</TableCell>
                      <TableCell>{req.dateRange}</TableCell>
                      <TableCell>
                        <Badge className={statusStyles[req.status]}>{req.status}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs whitespace-pre-wrap">
                        {req.reason || "—"}
                      </TableCell>
                      {isSystemAdmin || isDepartmentHead ? (
                        <TableCell className="text-right space-x-2">
                          {isSystemAdmin && req.status !== "rejected" && req.status !== "approved" ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDecision(req.id, "approved")}
                                disabled={
                                  (empStats && empStats.remaining <= 0) ||
                                  req.status !== "department_approved"
                                }
                                title={
                                  empStats && empStats.remaining <= 0
                                    ? "Employee has reached leave limit"
                                    : req.status !== "department_approved"
                                    ? "Waiting for department head recommendation"
                                    : ""
                                }
                              >
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openDecision(req.id, "rejected")}
                                disabled={req.status !== "department_approved"}
                                title={
                                  req.status !== "department_approved"
                                    ? "Waiting for department head recommendation"
                                    : ""
                                }
                              >
                                Reject
                              </Button>
                            </>
                          ) : req.status === "approved" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => printLeaveSlip(req)}
                              className="gap-2"
                            >
                              <Printer className="h-4 w-4" />
                              Print Slip
                            </Button>
                          ) : (
                            <div className="text-sm text-muted-foreground">—</div>
                          )}
                        </TableCell>
                      ) : (
                        <TableCell className="text-right">
                          {req.status === "approved" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => printLeaveSlip(req)}
                              className="gap-2"
                            >
                              <Printer className="h-4 w-4" />
                              Print Slip
                            </Button>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        )}
      </div>

      <Dialog open={decisionOpen} onOpenChange={setDecisionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{`Confirm ${decisionTarget?.action ?? ""}`}</DialogTitle>
            <DialogDescription>
              {decisionTarget?.action === "approved"
                ? "Approve this leave request."
                : "Reject this leave request."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Comment (optional)</label>
            <Textarea
              rows={3}
              value={decisionComment}
              onChange={(e) => setDecisionComment(e.target.value)}
              placeholder="Add a note for the employee"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDecisionOpen(false)}>
              Cancel
            </Button>
            <Button variant={decisionTarget?.action === "approved" ? "default" : "destructive"} onClick={submitDecision}>
              {decisionTarget?.action === "approved" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={departmentHeadDecisionOpen} onOpenChange={setDepartmentHeadDecisionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {departmentHeadTarget?.action === "department_approved" 
                ? "Recommend for Approval" 
                : "Reject Leave Request"}
            </DialogTitle>
            <DialogDescription>
              {departmentHeadTarget?.action === "department_approved"
                ? "Recommend this leave request for admin approval."
                : "Reject this leave request."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Comment (optional)</label>
            <Textarea
              rows={3}
              value={departmentHeadComment}
              onChange={(e) => setDepartmentHeadComment(e.target.value)}
              placeholder="Add a note for the admin and employee"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDepartmentHeadDecisionOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant={departmentHeadTarget?.action === "department_approved" ? "default" : "destructive"} 
              onClick={submitDepartmentHeadDecision}
            >
              {departmentHeadTarget?.action === "department_approved" ? "Recommend" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayoutNew>
  );
};

export default Leaves;
