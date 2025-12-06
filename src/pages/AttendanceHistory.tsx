import { useState, useEffect } from "react";
import DashboardLayoutNew from "@/components/Layout/DashboardLayoutNew";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
}

const AttendanceHistory = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user?.employeeId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/attendance?employeeId=${user.employeeId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch attendance");
        }

        const data = await response.json();
        const attendanceRecords = data.data || [];

        // Sort by date descending (most recent first)
        attendanceRecords.sort((a: Attendance, b: Attendance) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        setAttendance(attendanceRecords);
      } catch (error) {
        console.error("Error fetching attendance", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Unable to load attendance records. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, [user, toast]);

  const formatTime = (time?: string) => {
    if (!time) return "---------";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      present: { label: "Present", variant: "default" },
      late: { label: "Late", variant: "secondary" },
      absent: { label: "Absent", variant: "destructive" },
      "half-day": { label: "Half Day", variant: "outline" },
      leave: { label: "Leave", variant: "outline" },
    };

    const statusInfo = statusMap[status] || { label: status, variant: "outline" as const };
    return (
      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
    );
  };

  return (
    <DashboardLayoutNew>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance History</h1>
          <p className="text-muted-foreground mt-2">
            View your attendance records (Read-only)
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              My Attendance Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">Loading attendance records...</p>
              </div>
            ) : attendance.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No attendance records found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {formatDate(record.date)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            {formatTime(record.checkIn)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            {formatTime(record.checkOut)}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {record.notes || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayoutNew>
  );
};

export default AttendanceHistory;


