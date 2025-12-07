import { useEffect, useMemo, useState } from "react";
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
import { Info } from "lucide-react";
import { apiFetch } from "@/lib/fetch";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const LEAVE_TYPES = ["vacation", "sick", "emergency", "unpaid", "other"] as const;
type LeaveType = (typeof LEAVE_TYPES)[number];
type LeaveStatus = "pending" | "approved" | "rejected";

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string | null;
  status: LeaveStatus;
  adminComment: string | null;
  decidedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

const statusStyles: Record<LeaveStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
};

const MAX_YEARLY_LEAVES = 10;

const Leaves = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | LeaveStatus>("all");
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

  const isAdmin = user?.role === "admin";
  const employeeId = user?.employeeId;

  const fetchRequests = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (!isAdmin && employeeId) params.append("employeeId", employeeId);
      if (filterStatus !== "all") params.append("status", filterStatus);

      const url = params.toString()
        ? `${API_BASE_URL}/leaves?${params.toString()}`
        : `${API_BASE_URL}/leaves`;

      const res = await apiFetch(url);
      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Failed to load leaves");

      setRequests(data.data || []);
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

  const filteredRequests = useMemo(() => {
    return requests.map((req) => ({
      ...req,
      dateRange:
        req.startDate === req.endDate
          ? req.startDate
          : `${req.startDate} → ${req.endDate}`,
    }));
  }, [requests]);

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

    const usedCount = approvedThisYear.length;
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

  return (
    <DashboardLayoutNew>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-foreground">Leave Management</h1>
          <p className="text-muted-foreground">
            {isAdmin
              ? "Review and act on employee leave requests."
              : "Submit a leave request and track its status."}
          </p>
        </div>

        {!isAdmin && (
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

        <Card>
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle>{isAdmin ? "All Leave Requests" : "My Leave Requests"}</CardTitle>
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
                    <TableHead className="hidden md:table-cell">Admin Comment</TableHead>
                    {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 7 : 6} className="text-center text-muted-foreground">
                        {isLoading ? "Loading..." : "No leave requests found."}
                      </TableCell>
                    </TableRow>
                  )}

                  {filteredRequests.map((req) => (
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
                      <TableCell className="hidden md:table-cell whitespace-pre-wrap">
                        {req.adminComment || "—"}
                        {req.decidedBy && (
                          <div className="text-xs text-muted-foreground">By {req.decidedBy}</div>
                        )}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right space-x-2">
                          {req.status === "pending" ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDecision(req.id, "approved")}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openDecision(req.id, "rejected")}
                              >
                                Reject
                              </Button>
                            </>
                          ) : (
                            <div className="text-sm text-muted-foreground">—</div>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
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
    </DashboardLayoutNew>
  );
};

export default Leaves;
