import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayoutNew from "@/components/Layout/DashboardLayoutNew";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Employee } from "@/types/employee";
import { EmploymentHistory } from "@/components/EmploymentHistory";
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Users } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const InfoRow = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div className="flex justify-between py-1 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-foreground text-right">
      {value === undefined || value === null || value === "" ? "-" : value}
    </span>
  </div>
);

const EmployeeProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE_URL}/employees/${id}`);
        if (!res.ok) throw new Error("Failed to load employee");
        const data = await res.json();
        setEmployee(data.data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load employee profile",
        });
        navigate("/employees");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, [id, navigate, toast]);

  return (
    <DashboardLayoutNew>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employee Profile</h1>
          <p className="text-muted-foreground">
            View summary, basic information, and employment history.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Loading employee...</div>
      ) : !employee ? (
        <div className="text-destructive">Employee not found.</div>
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <CardTitle className="text-xl">{employee.fullName}</CardTitle>
                <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{employee.employeeId}</Badge>
                  <Separator orientation="vertical" className="h-4" />
                  <span>{employee.department}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>{employee.position}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={employee.status === "active" ? "default" : "secondary"}
                  className={employee.status === "active" ? "bg-success hover:bg-success" : ""}
                >
                  {employee.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-muted/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Employment Count</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 text-2xl font-semibold">
                    {employee.employmentCount ?? 1}
                  </CardContent>
                </Card>
                <Card className="bg-muted/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Current Period</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 text-2xl font-semibold">
                    {employee.currentEmploymentPeriod ?? 1}
                  </CardContent>
                </Card>
                <Card className="bg-muted/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Date Hired</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 text-2xl font-semibold">
                    {formatDate(employee.dateHired)}
                  </CardContent>
                </Card>
                <Card className="bg-muted/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Date of Leaving</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 text-2xl font-semibold">
                    {formatDate(employee.dateOfLeaving)}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Basic & Contact Info */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> Employment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <InfoRow label="Department" value={employee.department} />
                <InfoRow label="Designation" value={employee.position} />
                <InfoRow label="Employment Type" value={employee.employmentType || "Regular"} />
                <InfoRow label="Role" value={employee.role || "Employee"} />
                <InfoRow label="Status" value={employee.status === "active" ? "Active" : "Inactive"} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" /> Contact & Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow label="Email" value={employee.email} />
                <InfoRow label="Phone" value={employee.phone} />
                <InfoRow label="Address" value={employee.address} />
                <InfoRow label="Gender" value={employee.gender} />
                <InfoRow label="Civil Status" value={employee.civilStatus} />
                <InfoRow label="Date of Birth" value={formatDate(employee.dateOfBirth)} />
              </CardContent>
            </Card>
          </div>

          {/* Quick contact chips */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="bg-primary/5">
              <CardContent className="flex items-center gap-3 py-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{employee.email || "-"}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-primary/5">
              <CardContent className="flex items-center gap-3 py-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{employee.phone || "-"}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Employment History */}
          <EmploymentHistory
            employeeId={employee.employeeId}
            isAdmin={true}
            onHistoryUpdate={() => {
              // refresh header stats
              setEmployee((prev) =>
                prev
                  ? { ...prev, employmentCount: (prev.employmentCount ?? 1) }
                  : prev
              );
            }}
          />
        </div>
      )}
    </DashboardLayoutNew>
  );
};

export default EmployeeProfile;
