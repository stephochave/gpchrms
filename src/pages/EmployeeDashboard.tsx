import DashboardLayoutNew from "@/components/Layout/DashboardLayoutNew";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, X, CalendarPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

import { QrCode, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/fetch";

import { QRCodeSVG } from "qrcode.react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

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

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  eventDate: string;
  eventTime?: string;
  type: 'event' | 'reminder';
  createdBy?: string;
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  leaveReason: string;
  startDate: string;
  endDate: string;
  status: string;
  reviewedAt?: string;
}

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [todayAttendance, setTodayAttendance] = useState<TodayAttendance>({});
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<Record<string, CalendarEvent[]>>({});
  const [approvedLeaves, setApprovedLeaves] = useState<LeaveRequest[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: "vacation",
    startDate: "",
    endDate: "",
    reason: "",
  });

  // Calendar states
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(currentDate.getDate());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  // Check if user is a department head
  const isDepartmentHead = user?.role === "admin" && user?.position &&
    (user.position.toLowerCase().includes("head") || 
     user.position.toLowerCase().includes("dean") || 
     user.position.toLowerCase().includes("principal"));

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = [
    ...Array.from({ length: firstDayOfMonth }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  useEffect(() => {
    console.log('EmployeeDashboard - user:', user);
    console.log('EmployeeDashboard - user.employeeId:', user?.employeeId);
    
    if (!user) {
      console.log('EmployeeDashboard - No user, setting isLoading to false');
      setIsLoading(false);
      return;
    }
    
    void fetchEmployeeData();
    void fetchTodayAttendance();
    void fetchCalendarEvents();
    void fetchApprovedLeaves();
    void fetchPendingLeaves();

    const interval = setInterval(() => {
      void fetchTodayAttendance();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [user]);

  useEffect(() => {
    void fetchCalendarEvents();
    void fetchApprovedLeaves();
    void fetchPendingLeaves();
  }, [currentMonth, currentYear]);

  const fetchEmployeeData = async () => {
    if (!user?.employeeId) {
      console.log('EmployeeDashboard - No employeeId, setting loading to false');
      setIsLoading(false);
      return;
    }

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

  const fetchCalendarEvents = async () => {
    try {
      const startDate = new Date(currentYear, currentMonth, 1);
      const endDate = new Date(currentYear, currentMonth + 1, 0);
      
      const response = await apiFetch(
        `${API_BASE_URL}/calendar-events?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const eventsByDate: Record<string, CalendarEvent[]> = {};
        
        data.data.forEach((event: CalendarEvent) => {
          const date = new Date(event.eventDate);
          const day = date.getDate();
          if (!eventsByDate[day]) {
            eventsByDate[day] = [];
          }
          eventsByDate[day].push(event);
        });
        
        setCalendarEvents(eventsByDate);
      }
    } catch (error) {
      console.error("Error fetching calendar events", error);
    }
  };

  const fetchApprovedLeaves = async () => {
    if (!user?.employeeId) return;
    
    try {
      const startDate = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
      const endDate = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];
      
      // Department heads see their department's leaves, regular employees see only their own
      let url = `${API_BASE_URL}/leaves?status=approved&startDate=${startDate}&endDate=${endDate}`;
      if (isDepartmentHead && user?.department) {
        url += `&department=${encodeURIComponent(user.department)}`;
      } else {
        url += `&employeeId=${user.employeeId}`;
      }
      
      const response = await apiFetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setApprovedLeaves(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching approved leaves", error);
    }
  };

  const fetchPendingLeaves = async () => {
    if (!user?.employeeId) return;
    
    try {
      const startDate = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
      const endDate = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];
      
      // Department heads see their department's pending leaves, regular employees see only their own
      let url = `${API_BASE_URL}/leaves?status=pending&startDate=${startDate}&endDate=${endDate}`;
      if (isDepartmentHead && user?.department) {
        url += `&department=${encodeURIComponent(user.department)}`;
      } else {
        url += `&employeeId=${user.employeeId}`;
      }
      
      const response = await apiFetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setPendingLeaves(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching pending leaves", error);
    }
  };

  const handleDayClick = (day: number) => {
    const clickedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setLeaveForm({
      leaveType: "vacation",
      startDate: clickedDate,
      endDate: clickedDate,
      reason: "",
    });
    setShowLeaveDialog(true);
  };

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.employeeId) {
      toast({
        variant: "destructive",
        title: "Profile incomplete",
        description: "Your employee ID is missing. Contact an admin to update it.",
      });
      return;
    }

    if (!leaveForm.startDate || !leaveForm.endDate) {
      toast({
        variant: "destructive",
        title: "Dates required",
        description: "Please select a start and end date for your leave.",
      });
      return;
    }

    setIsSubmittingLeave(true);
    try {
      const res = await apiFetch(`${API_BASE_URL}/leaves`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: user.employeeId,
          employeeName: user.fullName,
          employeeDepartment: employee?.department || user?.department || null,
          leaveType: leaveForm.leaveType,
          startDate: leaveForm.startDate,
          endDate: leaveForm.endDate,
          reason: leaveForm.reason || null,
          createdBy: user.fullName,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to submit leave");

      toast({ 
        title: "Leave submitted", 
        description: "Your leave request has been submitted and is awaiting review." 
      });
      setShowLeaveDialog(false);
      setLeaveForm({ leaveType: "vacation", startDate: "", endDate: "", reason: "" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error?.message || "Please try again.",
      });
    } finally {
      setIsSubmittingLeave(false);
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full h-full">
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
                <div className="flex flex-col items-center gap-2">
                  <h3 className="text-xl font-bold text-center">
                    {monthNames[currentMonth]} {currentYear}
                  </h3>
                  <p className="text-xs text-muted-foreground text-center flex items-center gap-1">
                    <CalendarPlus className="h-3 w-3" />
                    Click any date to file a leave request
                  </p>
                </div>
                
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
                    
                    const dayEvents = calendarEvents[day] || [];
                    const dayLeaves = approvedLeaves.filter(leave => {
                      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const leaveStart = leave.startDate.split('T')[0];
                      const leaveEnd = leave.endDate.split('T')[0];
                      return dateStr >= leaveStart && dateStr <= leaveEnd;
                    });
                    
                    const dayPendingLeaves = pendingLeaves.filter(leave => {
                      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const leaveStart = leave.startDate.split('T')[0];
                      const leaveEnd = leave.endDate.split('T')[0];
                      return dateStr >= leaveStart && dateStr <= leaveEnd;
                    });
                    
                    const hasEvents = dayEvents.length > 0;
                    const hasLeaves = dayLeaves.length > 0;
                    const hasPendingLeaves = dayPendingLeaves.length > 0;
                    const hasEventType = dayEvents.some(e => e.type === 'event');
                    const hasReminderType = dayEvents.some(e => e.type === 'reminder');
                    
                    const DayContent = (
                      <div className={`aspect-square rounded-lg text-sm font-medium transition-colors relative flex flex-col items-center justify-center ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : isToday
                          ? "bg-primary/20 text-primary font-bold"
                          : "hover:bg-muted"
                      }`}>
                        <span>{day}</span>
                        {(hasEvents || hasLeaves || hasPendingLeaves) && (
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {hasEventType && (
                              <div className="h-1.5 w-1.5 rounded-full bg-destructive" title="Event" />
                            )}
                            {hasReminderType && (
                              <div className="h-1 w-1 rounded-full bg-primary" title="Reminder" />
                            )}
                            {hasLeaves && (
                              <div className="h-1.5 w-1.5 rounded-full bg-green-500" title="Approved Leave" />
                            )}
                            {hasPendingLeaves && (
                              <div className="h-1.5 w-1.5 rounded-full bg-red-500" title="Pending Leave" />
                            )}
                          </div>
                        )}
                      </div>
                    );
                    
                    if (!hasEvents && !hasLeaves && !hasPendingLeaves) {
                      return (
                        <button
                          key={day}
                          onClick={() => handleDayClick(day)}
                        >
                          {DayContent}
                        </button>
                      );
                    }
                    
                    return (
                      <HoverCard key={day} openDelay={200} closeDelay={100}>
                        <HoverCardTrigger asChild>
                          <button onClick={() => handleDayClick(day)}>
                            {DayContent}
                          </button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80" side="top" align="center">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">
                              {new Date(currentYear, currentMonth, day).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric"
                              })}
                            </h4>
                            <div className="space-y-2">
                              {dayEvents.map((event, idx) => (
                                <div key={idx} className="border-l-2 border-primary pl-3 py-1">
                                  <Badge variant={event.type === 'event' ? 'default' : 'secondary'} className="text-xs mb-1">
                                    {event.type === 'event' ? 'Event' : 'Reminder'}
                                  </Badge>
                                  <p className="text-sm font-medium">{event.title}</p>
                                  {event.description && (
                                    <p className="text-xs text-muted-foreground">{event.description}</p>
                                  )}
                                  {event.eventTime && (
                                    <p className="text-xs text-muted-foreground">
                                      Time: {(() => {
                                        const [hours, minutes] = event.eventTime.split(':');
                                        const hour = parseInt(hours, 10);
                                        const ampm = hour >= 12 ? 'PM' : 'AM';
                                        const displayHour = hour % 12 || 12;
                                        return `${displayHour}:${minutes} ${ampm}`;
                                      })()}
                                    </p>
                                  )}
                                </div>
                              ))}
                              {dayLeaves.map((leave, idx) => (
                                <div key={idx} className="border-l-2 border-green-500 pl-3 py-1">
                                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 mb-1">
                                    Approved Leave
                                  </Badge>
                                  <p className="text-sm font-medium">{leave.employeeName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {leave.leaveType} - {leave.leaveReason}
                                  </p>
                                  {leave.reviewedAt && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Approved: {new Date(leave.reviewedAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit"
                                      })}
                                    </p>
                                  )}
                                </div>
                              ))}
                              {dayPendingLeaves.map((leave, idx) => (
                                <div key={`pending-${idx}`} className="border-l-2 border-red-500 pl-3 py-1">
                                  <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200 mb-1">
                                    Pending Leave
                                  </Badge>
                                  <p className="text-sm font-medium">{leave.employeeName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {leave.leaveType}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(leave.startDate).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric"
                                    })} - {new Date(leave.endDate).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric"
                                    })}
                                  </p>
                                  {leave.leaveReason && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {leave.leaveReason}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
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

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="max-w-md w-full">
          <DialogTitle className="text-lg font-semibold text-center">
            My Attendance QR Code
          </DialogTitle>
          <div className="flex flex-col items-center space-y-4 py-4">
            <p className="text-sm text-muted-foreground text-center">
              Show this QR code to the guard to record your attendance
            </p>
            {employee?.qrCodeData ? (
              <div className="bg-white p-6 rounded-lg">
                <QRCodeSVG value={employee.qrCodeData} size={256} level="H" />
              </div>
            ) : (
              <div className="bg-muted p-6 rounded-lg">
                <p className="text-sm text-muted-foreground">QR code not available</p>
              </div>
            )}
            <div className="text-center">
              <p className="text-sm font-medium">{employee?.fullName}</p>
              <p className="text-xs text-muted-foreground">{employee?.employeeId}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Leave Filing Dialog */}
      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarPlus className="h-5 w-5" />
              File Leave Request
            </DialogTitle>
            <DialogDescription>
              Submit a leave request for approval by your department head and admin.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLeaveSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Leave Type</label>
              <Select
                value={leaveForm.leaveType}
                onValueChange={(value) =>
                  setLeaveForm((prev) => ({ ...prev, leaveType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacation">Vacation</SelectItem>
                  <SelectItem value="sick">Sick</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  required
                  value={leaveForm.startDate}
                  onChange={(e) =>
                    setLeaveForm((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  required
                  value={leaveForm.endDate}
                  onChange={(e) =>
                    setLeaveForm((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reason</label>
              <Textarea
                rows={3}
                placeholder="Provide details for your leave request"
                required
                minLength={5}
                value={leaveForm.reason}
                onChange={(e) =>
                  setLeaveForm((prev) => ({ ...prev, reason: e.target.value }))
                }
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowLeaveDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmittingLeave}>
                {isSubmittingLeave ? "Submitting..." : "Submit Leave Request"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayoutNew>
  );
};

export default EmployeeDashboard;
