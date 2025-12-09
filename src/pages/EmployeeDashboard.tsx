import DashboardLayoutNew from "@/components/Layout/DashboardLayoutNew";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";

import { QrCode, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/fetch";

import { QRCodeSVG } from "qrcode.react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  position: string;
  department: string;
  employmentType: string;
  qrCodeData?: string;
}

interface TodayAttendance {
  checkIn?: string;
  checkOut?: string;
  status?: string;
}

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [todayAttendance, setTodayAttendance] = useState<TodayAttendance>({});
  const [cameraIsOpen, setCameraIsOpen] = useState(false);
  const [activeCapture, setActiveCapture] = useState<"checkIn" | "checkOut" | null>(null);
  const [cameraError, setCameraError] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [selectedDateForLeave, setSelectedDateForLeave] = useState<number | null>(null);
  const [leaveType, setLeaveType] = useState("sick");
  const [leaveReason, setLeaveReason] = useState("");
  const [isFilingLeave, setIsFilingLeave] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [showQRDialog, setShowQRDialog] = useState(false);

  // Calendar states
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(currentDate.getDate());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = [
    ...Array.from({ length: firstDayOfMonth }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  useEffect(() => {
    void fetchEmployeeData();
    void fetchTodayAttendance();

    const interval = setInterval(() => {
      void fetchTodayAttendance();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [user]);

  const fetchEmployeeData = async () => {
    if (!user?.employeeId) return;

    try {
      // First, search by employeeId to get the full employee record
      const response = await apiFetch(
        `${API_BASE_URL}/employees?employeeId=${user.employeeId}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          const employeeData = data.data[0];
          setEmployee({
            id: employeeData.id,
            employeeId: employeeData.employeeId,
            fullName: employeeData.fullName,
            position: employeeData.position || "Employee",
            department: employeeData.department || "College Department",
            employmentType: employeeData.employmentType || "Regular",
            qrCodeData: employeeData.qrCodeData,
          });
        } else {
          setEmployee({
            id: user.id?.toString() || "",
            employeeId: user.employeeId || "",
            fullName: user.fullName || "",
            position: "Employee",
            department: "College Department",
            employmentType: "Regular",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching employee data", error);
      setEmployee({
        id: user.id?.toString() || "",
        employeeId: user.employeeId || "",
        fullName: user.fullName || "",
        position: "Employee",
        department: "College Department",
        employmentType: "Regular",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTodayAttendance = async () => {
    if (!user?.employeeId) return;

    try {
      const nowPH = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" });
      const today = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Manila"
      }).format(new Date());
      
      const response = await apiFetch(
        `${API_BASE_URL}/attendance?employeeId=${user.employeeId}&date=${today}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          const attendance = data.data[0];
          setTodayAttendance({
            checkIn: attendance.checkIn,
            checkOut: attendance.checkOut,
            status: attendance.status,
          });
        } else {
          setTodayAttendance({});
        }
      }
    } catch (error) {
      console.error("Error fetching today's attendance", error);
    }
  };

  const handleFileLeave = async () => {
    if (!selectedDateForLeave || !user?.employeeId || !user?.fullName) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid leave request data",
      });
      return;
    }

    setIsFilingLeave(true);
    try {
      const leaveDate = new Date(currentYear, currentMonth, selectedDateForLeave).toISOString().split("T")[0];

      const response = await fetch(`${API_BASE_URL}/leaves`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: user.employeeId,
          employeeName: user.fullName,
          leaveType: leaveType,
          startDate: leaveDate,
          endDate: leaveDate,
          reason: leaveReason || undefined,
          status: "pending",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to file leave request");
      }

      toast({
        title: "Success",
        description: `Leave request filed for ${leaveType.toUpperCase()} on ${new Date(leaveDate).toLocaleDateString()}`,
      });

      // Reset form
      setLeaveDialogOpen(false);
      setSelectedDateForLeave(null);
      setLeaveType("sick");
      setLeaveReason("");
    } catch (error) {
      console.error("Error filing leave", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to file leave request. Please try again.",
      });
    } finally {
      setIsFilingLeave(false);
    }
  };

  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  if (isLoading) {
    return (
      <DashboardLayoutNew>
        <div className="flex items-center justify-center h-full w-full">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </DashboardLayoutNew>
    );
  }

  return (
    <DashboardLayoutNew>
      <div className="h-full w-full -m-6">
        <Card className="rounded-none shadow-lg border-0 h-full">
          <CardContent className="p-8 h-full flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full h-full">
              {/* Left: Employee Profile Card */}
              <div className="space-y-4 flex flex-col justify-center">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-muted mb-4 border-4 border-primary/20">
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <span className="text-4xl font-bold text-primary">
                        {employee?.fullName?.charAt(0) || user?.fullName?.charAt(0) || "E"}
                      </span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    {employee?.fullName || user?.fullName || "Employee"}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-1">
                    {employee?.employeeId || user?.employeeId || "EMP001"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {employee?.employmentType || "Regular"}
                  </p>
                  
                  <div className="w-full bg-primary/10 rounded-lg p-4 space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Position</p>
                      <p className="text-base font-semibold text-primary">
                        {employee?.position || "Employee"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Department</p>
                      <p className="text-base font-semibold text-primary">
                        {employee?.department || "College Department"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center: Calendar */}
              <div className="space-y-4 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-center">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
                
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-semibold text-muted-foreground py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    if (day === null) {
                      return <div key={`empty-${index}`} className="aspect-square" />;
                    }
                    const isSelected = day === selectedDate;
                    const isToday = day === currentDate.getDate() && 
                                   currentMonth === new Date().getMonth() &&
                                   currentYear === new Date().getFullYear();
                    
                    return (
                      <button
                        key={day}
                        onClick={() => {
                          setSelectedDate(day);
                          setSelectedDateForLeave(day);
                          setLeaveDialogOpen(true);
                        }}
                        className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : isToday
                            ? "bg-primary/20 text-primary font-bold"
                            : "hover:bg-muted hover:cursor-pointer"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Attendance Times */}
              <div className="space-y-4 flex flex-col justify-center">
                {/* QR Code Card */}
                <Card className="rounded-xl border-2 border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <QrCode className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1">My QR Code</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Show this to the guard for attendance
                        </p>
                        <Button
                          onClick={() => setShowQRDialog(true)}
                          className="w-full"
                          variant="default"
                        >
                          Show QR Code
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sign In Time Card */}
                <Card className="rounded-xl border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Sign In Time</h4>
                        <p className="text-2xl font-bold text-primary">
                          {todayAttendance.checkIn || "Not yet signed in"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sign Out Time Card */}
                <Card className="rounded-xl border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Sign Out Time</h4>
                        <p className="text-2xl font-bold text-primary">
                          {todayAttendance.checkOut || "Not yet signed out"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Request Dialog */}
      <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>File a Leave Request</DialogTitle>
            <DialogDescription>
              Submit a leave request for {selectedDateForLeave ? 
                new Date(currentYear, currentMonth, selectedDateForLeave).toLocaleDateString() 
                : "the selected date"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="leaveType">Leave Type</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger id="leaveType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="vacation">Vacation Leave</SelectItem>
                  <SelectItem value="personal">Personal Leave</SelectItem>
                  <SelectItem value="bereavement">Bereavement Leave</SelectItem>
                  <SelectItem value="emergency">Emergency Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="leaveReason">Reason (Optional)</Label>
              <Textarea
                id="leaveReason"
                placeholder="Please provide a reason for your leave request..."
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setLeaveDialogOpen(false);
                  setSelectedDateForLeave(null);
                  setLeaveType("sick");
                  setLeaveReason("");
                }}
                disabled={isFilingLeave}
              >
                Cancel
              </Button>
              <Button
                onClick={handleFileLeave}
                disabled={isFilingLeave}
              >
                {isFilingLeave ? "Filing..." : "File Leave"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayoutNew>
  );
};

export default EmployeeDashboard;
