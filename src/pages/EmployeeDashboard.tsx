import DashboardLayoutNew from "@/components/Layout/DashboardLayoutNew";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  position: string;
  department: string;
  employmentType: string;
  registeredFaceFile?: string;
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
  const [todayAttendance, setTodayAttendance] = useState<TodayAttendance>({});
  const [isLoading, setIsLoading] = useState(true);
  const [cameraIsOpen, setCameraIsOpen] = useState(false);
  const [activeCapture, setActiveCapture] = useState<"checkIn" | "checkOut" | null>(null);
  const [cameraError, setCameraError] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Calendar state
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const [selectedDate, setSelectedDate] = useState(currentDate.getDate());

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Generate calendar days
  const calendarDays = [];
  // Empty cells for days before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  useEffect(() => {
    fetchEmployeeData();
    fetchTodayAttendance();
  }, [user]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const fetchEmployeeData = async () => {
    if (!user?.employeeId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/employees?employeeId=${user.employeeId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          setEmployee(data.data[0]);
        } else {
          // Fallback: create employee object from user data
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
      // Fallback on error
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
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch(
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
        }
      }
    } catch (error) {
      console.error("Error fetching today's attendance", error);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleOpenCamera = async (type: "checkIn" | "checkOut") => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast({
        variant: "destructive",
        title: "Camera not supported",
        description: "Your browser does not allow camera access.",
      });
      return;
    }

    try {
      setCameraError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      mediaStreamRef.current = stream;
      setActiveCapture(type);
      setCameraIsOpen(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      });
    } catch (error) {
      console.error("Unable to open camera", error);
      setCameraError("Unable to access camera. Please check permissions.");
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const context = canvas.getContext("2d");
    if (!context) return;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setCapturedImage(dataUrl);
    
    // Submit attendance
    submitAttendance(activeCapture!, dataUrl);
    
    stopCamera();
    setCameraIsOpen(false);
    setActiveCapture(null);
  };

  const submitAttendance = async (type: "checkIn" | "checkOut", image: string) => {
    if (!user?.employeeId || !user?.fullName) return;

    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    try {
      const attendanceData: any = {
        employeeId: user.employeeId,
        employeeName: user.fullName,
        date: today,
        status: "present",
      };

      if (type === "checkIn") {
        attendanceData.checkIn = time;
        attendanceData.checkInImage = image;
      } else {
        attendanceData.checkOut = time;
        attendanceData.checkOutImage = image;
      }

      // If already has check-in, update; otherwise create new
      if (todayAttendance.checkIn && type === "checkOut") {
        attendanceData.checkIn = todayAttendance.checkIn;
      }

      const response = await fetch(`${API_BASE_URL}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attendanceData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Successfully recorded ${type === "checkIn" ? "Sign In" : "Sign Out"}`,
        });
        fetchTodayAttendance();
      } else {
        throw new Error("Failed to submit attendance");
      }
    } catch (error) {
      console.error("Error submitting attendance", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit attendance. Please try again.",
      });
    }
  };

  const closeCamera = () => {
    stopCamera();
    setCameraIsOpen(false);
    setActiveCapture(null);
    setCapturedImage(null);
    setCameraError("");
  };

  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
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
                    {employee?.registeredFaceFile ? (
                      <img
                        src={employee.registeredFaceFile}
                        alt={employee.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10">
                        <span className="text-4xl font-bold text-primary">
                          {employee?.fullName?.charAt(0) || user?.fullName?.charAt(0) || "E"}
                        </span>
                      </div>
                    )}
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
                        onClick={() => setSelectedDate(day)}
                        className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : isToday
                            ? "bg-primary/20 text-primary font-bold"
                            : "hover:bg-muted"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Sign In/Out Cards */}
              <div className="space-y-4 flex flex-col justify-center">
                {/* Sign In Time Card */}
                <Card className="rounded-xl border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Sign In Time</h4>
                        <p className="text-2xl font-bold text-primary mb-2">
                          {todayAttendance.checkIn || "No Time In"}
                        </p>
                        <Button
                          onClick={() => handleOpenCamera("checkIn")}
                          disabled={!!todayAttendance.checkIn}
                          className="w-full"
                          variant={todayAttendance.checkIn ? "outline" : "default"}
                        >
                          {todayAttendance.checkIn ? "Already Signed In" : "Sign In"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sign Out Time Card */}
                <Card className="rounded-xl border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Sign Out Time</h4>
                        <p className="text-2xl font-bold text-primary mb-2">
                          {todayAttendance.checkOut || "No Time Out"}
                        </p>
                        <Button
                          onClick={() => handleOpenCamera("checkOut")}
                          disabled={!!todayAttendance.checkOut || !todayAttendance.checkIn}
                          className="w-full"
                          variant={todayAttendance.checkOut ? "outline" : "default"}
                        >
                          {!todayAttendance.checkIn
                            ? "Sign In First"
                            : todayAttendance.checkOut
                            ? "Already Signed Out"
                            : "Sign Out"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Camera Dialog */}
      {cameraIsOpen && (
        <Dialog open={cameraIsOpen} onOpenChange={(open) => !open && closeCamera()}>
          <DialogContent className="max-w-2xl w-full p-0 gap-0">
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <DialogTitle className="text-lg font-semibold">
                    Capture Face — {activeCapture === "checkIn" ? "Sign In" : "Sign Out"}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Align your face in the camera and tap capture.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeCamera}
                  className="h-8 w-8"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="rounded-xl overflow-hidden bg-black aspect-video mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              {cameraError && (
                <p className="text-sm text-destructive mb-4">{cameraError}</p>
              )}

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={closeCamera}>
                  Cancel
                </Button>
                <Button onClick={handleCapturePhoto}>Capture</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayoutNew>
  );
};

export default EmployeeDashboard;
