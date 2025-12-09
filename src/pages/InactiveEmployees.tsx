import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayoutNew from "@/components/Layout/DashboardLayoutNew";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { apiFetch } from '@/lib/fetch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { employeeStorage } from "@/lib/employeeStorage";
import { Employee } from "@/types/employee";
import { Department, Designation } from "@/lib/organizationStorage";
import { Search, RotateCcw, Users, Plus, Eye } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const roleOptions = ["Employee", "Manager", "Admin", "Contractor"];

const addInactiveDefault = {
  firstName: "",
  lastName: "",
  employeeId: "",
  department: "",
  designation: "",
  role: "",
  dateOfJoining: "",
  dateOfLeaving: "",
  reason: "",
  retire: "",
  deactivationDate: "",
  reactivationDate: "",
  uploadImage: "",
  uploadImagePreview: "",
  sr: "",
  serviceRecordPreview: "",
  personalDataSheet: "",
  personalDataSheetPreview: "",
  employmentRecord: "",
  employmentRecordPreview: "",
};

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const EditField = ({
  label,
  className = "",
  error,
  children,
}: {
  label: string;
  className?: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className={`space-y-2 ${className}`}>
    <Label className="text-sm font-semibold text-muted-foreground">
      {label}
    </Label>
    {children}
    {error && <p className="text-sm text-destructive">{error}</p>}
  </div>
);

const InactiveEmployees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addForm, setAddForm] = useState(addInactiveDefault);
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchDepartments = async () => {
    try {
      const response = await apiFetch(`${API_BASE_URL}/departments`);
      if (!response.ok) {
        throw new Error("Failed to fetch departments");
      }
      const data = await response.json();
      setDepartments(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDesignations = async () => {
    try {
      const response = await apiFetch(`${API_BASE_URL}/designations`);
      if (!response.ok) {
        throw new Error("Failed to fetch designations");
      }
      const data = await response.json();
      setDesignations(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const mapEmployee = (employee: any): Employee => ({
    id: employee.id,
    employeeId: employee.employeeId,
    firstName: employee.firstName || "",
    lastName: employee.lastName || "",
    fullName: employee.fullName,
    department: employee.department,
    position: employee.position,
    designation: employee.position,
    email: employee.email,
    phone: employee.phone,
    dateOfBirth: employee.dateOfBirth || "",
    address: employee.address || "",
    gender: employee.gender || "",
    civilStatus: employee.civilStatus || "",
    dateHired: employee.dateHired,
    dateOfLeaving: employee.dateOfLeaving || "",
    employmentType: employee.employmentType || "Regular",
    role: employee.role || "",
    sssNumber: employee.sssNumber || "",
    pagibigNumber: employee.pagibigNumber || "",
    tinNumber: employee.tinNumber || "",
    emergencyContact: employee.emergencyContact || "",
    educationalBackground: employee.educationalBackground || "",
    signatureFile: employee.signatureFile || "",
    pdsFile: employee.pdsFile || "",
    serviceRecordFile: employee.serviceRecordFile || "",
    registeredFaceFile: employee.registeredFaceFile || "",
    status: employee.status,
    archivedReason: employee.archivedReason || undefined,
    archivedDate: employee.archivedAt || undefined,
    createdAt: employee.createdAt,
    updatedAt: employee.updatedAt,
  });

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      // Only fetch inactive employees
      const response = await apiFetch(`${API_BASE_URL}/employees?status=inactive`);
      if (!response.ok) {
        throw new Error("Failed to fetch inactive employees");
      }
      const data = await response.json();
      setEmployees(data.data.map(mapEmployee));
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to load inactive employees. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddInactive = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!addForm.firstName.trim()) errors.firstName = "Required";
    if (!addForm.lastName.trim()) errors.lastName = "Required";
    if (!addForm.employeeId.trim()) errors.employeeId = "Required";
    if (!addForm.department) errors.department = "Required";
    if (!addForm.designation) errors.designation = "Required";

    setAddErrors(errors);
    if (Object.keys(errors).length) return;

    try {
      setIsSubmitting(true);
      const trimmedEmployeeId = addForm.employeeId.trim();
      const firstName = addForm.firstName.trim();
      const lastName = addForm.lastName.trim();
      const generatedPassword = `Inactive${Date.now()
        .toString()
        .slice(-4)}!`;
      const inactiveReason =
        addForm.reason ||
        (addForm.retire === "yes" ? "Retired" : "Marked as inactive");
      const inactiveDate =
        addForm.deactivationDate || new Date().toISOString().slice(0, 10);

      const response = await apiFetch(`${API_BASE_URL}/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: trimmedEmployeeId,
          firstName,
          middleName: "N/A",
          lastName,
          suffixName: "N/A",
          fullName:
            `${firstName} ${lastName}`.replace(/\s+/g, " ").trim(),
          department: addForm.department,
          position: addForm.designation,
          email: `${trimmedEmployeeId.toLowerCase()}@inactive.local`,
          phone: "0000000000",
          dateOfBirth: "1990-01-01",
          address: addForm.reason || "No address provided",
          dateHired:
            addForm.dateOfJoining || new Date().toISOString().slice(0, 10),
          dateOfLeaving:
            addForm.dateOfLeaving || addForm.deactivationDate || null,
          status: "inactive",
          archivedReason: inactiveReason,
          archivedAt: inactiveDate,
          employmentType: "Former",
          role: addForm.role || null,
          password: generatedPassword,
          emergencyContact: addForm.reason?.trim() || "Not provided",
          educationalBackground: null,
          serviceRecordFile: addForm.sr || null,
          pdsFile: addForm.personalDataSheet || null,
          signatureFile: null,
          registeredFaceFile: addForm.uploadImage || null,
          gender: null,
          civilStatus: null,
          sssNumber: null,
          pagibigNumber: null,
          tinNumber: null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add inactive employee");
      }

      const responseData = await response.json().catch(() => ({}));
      
      // Refresh the inactive employees list
      await fetchEmployees();
      setAddForm(addInactiveDefault);
      setAddErrors({});
      setShowAddDialog(false);

      toast({
        title: "Success",
        description: `Inactive employee "${firstName} ${lastName}" (${trimmedEmployeeId}) has been successfully saved to the database.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Unable to add inactive employee. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = async (
    field: keyof typeof addForm,
    files: FileList | null
  ) => {
    if (!files || !files[0]) {
      const previewField = `${field}Preview` as keyof typeof addForm;
      setAddForm((prev) => ({ 
        ...prev, 
        [field]: "",
        [previewField]: "",
      }));
      return;
    }

    const file = files[0];
    const fileName = file.name;
    const previewField = `${field}Preview` as keyof typeof addForm;

    // Convert file to base64 for preview and storage
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAddForm((prev) => ({
        ...prev,
        [field]: base64String,
        [previewField]: base64String,
      }));
    };
    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to read file: ${fileName}`,
      });
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchDesignations();
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleRestore = async () => {
    if (!selectedEmployee) return;

    try {
      setIsSubmitting(true);
      // Update employee status to 'active' via API
      const response = await apiFetch(
        `${API_BASE_URL}/employees/${selectedEmployee.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "active",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to restore employee");
      }

      // Refresh the inactive employees list
      await fetchEmployees();
      setShowRestoreDialog(false);
      setSelectedEmployee(null);

      toast({
        title: "Success",
        description:
          "Employee restored successfully. They will now appear in the active employees list.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Unable to restore employee. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };


  return (
    <DashboardLayoutNew>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Inactive Employees
            </h1>
            <p className="text-muted-foreground">
              View and manage inactive employee records
            </p>
          </div>
          <Button 
            className="gap-2" 
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="w-4 h-4" />
            Add Inactive Employee
          </Button>
        </div>

        {/* Inactive Employee List Card */}
        <Card className="shadow-sm">
          <CardHeader className="border-b bg-gradient-to-r from-muted/30 to-muted/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Users className="w-5 h-5 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl">Inactive Employees List</CardTitle>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">
                      Employee Name
                    </TableHead>
                    <TableHead className="font-semibold">Employee ID</TableHead>
                    <TableHead className="font-semibold">
                      Deactivation Date
                    </TableHead>
                    <TableHead className="font-semibold">Designation</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold text-center">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-muted-foreground py-12"
                      >
                        No inactive employees found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <TableRow
                        key={employee.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="font-medium">
                          {employee.fullName}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {employee.employeeId}
                        </TableCell>
                        <TableCell>
                          {employee.archivedDate
                            ? formatDate(employee.archivedDate)
                            : "N/A"}
                        </TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Inactive</Badge>
                        </TableCell>
                        <TableCell>FORMER EMPLOYEE</TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-blue-700 hover:text-blue-800 hover:bg-blue-50"
                                onClick={() => navigate(`/employees/${employee.id}`)}
                                title="View Profile"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedEmployee(employee);
                                  setShowViewDialog(true);
                                }}
                              >
                                View
                              </Button>
                            </div>
                          </div>
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

      {/* Add Inactive Employee Dialog */}
      <Dialog
        open={showAddDialog}
        onOpenChange={(open) => {
          setShowAddDialog(open);
          if (!open) {
            setAddForm(addInactiveDefault);
            setAddErrors({});
          }
        }}
      >
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Add Inactive Employee
            </DialogTitle>
            <DialogDescription>
              Fill out the details to log a former employee
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddInactive(e);
            }}
            className="space-y-6"
          >
            {/* Personal Information */}
            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <EditField label="First Name *" error={addErrors.firstName}>
                <Input
                  value={addForm.firstName}
                  onChange={(e) =>
                    setAddForm({ ...addForm, firstName: e.target.value })
                  }
                  placeholder="Employee's First Name"
                />
              </EditField>
              <EditField label="Last Name *" error={addErrors.lastName}>
                <Input
                  value={addForm.lastName}
                  onChange={(e) =>
                    setAddForm({ ...addForm, lastName: e.target.value })
                  }
                  placeholder="Employee's Last Name"
                />
              </EditField>
              <EditField label="Employee ID *" error={addErrors.employeeId}>
                <Input
                  value={addForm.employeeId}
                  onChange={(e) =>
                    setAddForm({ ...addForm, employeeId: e.target.value })
                  }
                  placeholder="Example: 25-GPC-0357"
                />
              </EditField>
            </section>

            {/* Employment Details */}
            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <EditField label="Department *" error={addErrors.department}>
                <Select
                  value={addForm.department}
                  onValueChange={(value) =>
                    setAddForm({ ...addForm, department: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </EditField>
              <EditField label="Designation *" error={addErrors.designation}>
                <Select
                  value={addForm.designation}
                  onValueChange={(value) =>
                    setAddForm({ ...addForm, designation: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {designations.map((desig) => (
                      <SelectItem key={desig.id} value={desig.name}>
                        {desig.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </EditField>
              <EditField label="Role">
                <Select
                  value={addForm.role}
                  onValueChange={(value) =>
                    setAddForm({ ...addForm, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </EditField>
            </section>

            {/* Dates and Reason */}
            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <EditField label="Date of Joining">
                <Input
                  type="date"
                  value={addForm.dateOfJoining}
                  onChange={(e) =>
                    setAddForm({ ...addForm, dateOfJoining: e.target.value })
                  }
                />
              </EditField>
              <EditField label="Date of Leaving">
                <Input
                  type="date"
                  value={addForm.dateOfLeaving}
                  onChange={(e) =>
                    setAddForm({ ...addForm, dateOfLeaving: e.target.value })
                  }
                />
              </EditField>
              <EditField label="Deactivation Date">
                <Input
                  type="date"
                  value={addForm.deactivationDate}
                  onChange={(e) =>
                    setAddForm({ ...addForm, deactivationDate: e.target.value })
                  }
                />
              </EditField>
              <EditField label="Reactivation Date">
                <Input
                  type="date"
                  value={addForm.reactivationDate}
                  onChange={(e) =>
                    setAddForm({ ...addForm, reactivationDate: e.target.value })
                  }
                />
              </EditField>
              <EditField label="Reason" className="lg:col-span-2">
                <Input
                  value={addForm.reason}
                  onChange={(e) =>
                    setAddForm({ ...addForm, reason: e.target.value })
                  }
                  placeholder="Reason of employee"
                />
              </EditField>
              <EditField label="Retire?">
                <Select
                  value={addForm.retire}
                  onValueChange={(value) =>
                    setAddForm({ ...addForm, retire: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Yes / No" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </EditField>
            </section>

            {/* File Uploads */}
            <section className="grid gap-4 md:grid-cols-2">
              <EditField label="Upload Image">
                <div className="space-y-2">
                  {addForm.uploadImagePreview ? (
                    <div className="space-y-2">
                      <img
                        src={addForm.uploadImagePreview}
                        alt="Uploaded image preview"
                        className="w-full h-40 object-cover rounded-xl border border-border/70"
                      />
                      <p className="text-xs text-green-600 font-medium">
                        ✓ Image uploaded
                      </p>
                    </div>
                  ) : (
                    <div className="w-full h-40 border-2 border-dashed border-border/60 rounded-xl flex flex-col items-center justify-center text-sm text-muted-foreground bg-muted/30">
                      <Users className="w-8 h-8 mb-2 text-muted-foreground/50" />
                      <p>No image uploaded</p>
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange("uploadImage", e.target.files)
                    }
                  />
                </div>
              </EditField>
              <EditField label="Service Record">
                <div className="space-y-2">
                  {addForm.serviceRecordPreview ? (
                    <div className="space-y-2">
                      {addForm.serviceRecordPreview.startsWith("data:image") ? (
                        <img
                          src={addForm.serviceRecordPreview}
                          alt="Service record preview"
                          className="w-full h-40 object-contain rounded-xl border border-border/70"
                        />
                      ) : (
                        <div className="w-full h-40 border-2 border-primary/20 rounded-xl flex flex-col items-center justify-center bg-muted/30">
                          <p className="text-xs text-green-600 font-medium">
                            ✓ Service record file uploaded
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-40 border-2 border-dashed border-border/60 rounded-xl flex flex-col items-center justify-center text-sm text-muted-foreground bg-muted/30">
                      <p>No file uploaded</p>
                    </div>
                  )}
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={(e) =>
                      handleFileChange("sr", e.target.files)
                    }
                  />
                </div>
              </EditField>
              <EditField label="Personal Data Sheet">
                <div className="space-y-2">
                  {addForm.personalDataSheetPreview ? (
                    <div className="space-y-2">
                      {addForm.personalDataSheetPreview.startsWith("data:image") ? (
                        <img
                          src={addForm.personalDataSheetPreview}
                          alt="Personal data sheet preview"
                          className="w-full h-40 object-contain rounded-xl border border-border/70"
                        />
                      ) : (
                        <div className="w-full h-40 border-2 border-primary/20 rounded-xl flex flex-col items-center justify-center bg-muted/30">
                          <p className="text-xs text-green-600 font-medium">
                            ✓ Personal data sheet file uploaded
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-40 border-2 border-dashed border-border/60 rounded-xl flex flex-col items-center justify-center text-sm text-muted-foreground bg-muted/30">
                      <p>No file uploaded</p>
                    </div>
                  )}
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={(e) =>
                      handleFileChange("personalDataSheet", e.target.files)
                    }
                  />
                </div>
              </EditField>
              <EditField label="Employment Record">
                <div className="space-y-2">
                  {addForm.employmentRecordPreview ? (
                    <div className="space-y-2">
                      {addForm.employmentRecordPreview.startsWith("data:image") ? (
                        <img
                          src={addForm.employmentRecordPreview}
                          alt="Employment record preview"
                          className="w-full h-40 object-contain rounded-xl border border-border/70"
                        />
                      ) : (
                        <div className="w-full h-40 border-2 border-primary/20 rounded-xl flex flex-col items-center justify-center bg-muted/30">
                          <p className="text-xs text-green-600 font-medium">
                            ✓ Employment record file uploaded
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-40 border-2 border-dashed border-border/60 rounded-xl flex flex-col items-center justify-center text-sm text-muted-foreground bg-muted/30">
                      <p>No file uploaded</p>
                    </div>
                  )}
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={(e) =>
                      handleFileChange("employmentRecord", e.target.files)
                    }
                  />
                </div>
              </EditField>
            </section>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  setAddForm(addInactiveDefault);
                  setAddErrors({});
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Record"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Restore Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore {selectedEmployee?.fullName}?
              They will be moved back to the active employees list.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="py-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Employee ID:</span>
                <span className="font-medium">
                  {selectedEmployee.employeeId}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Department:</span>
                <span className="font-medium">
                  {selectedEmployee.department}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Archived Reason:</span>
                <span className="font-medium">
                  {selectedEmployee.archivedReason || "N/A"}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRestoreDialog(false);
                setSelectedEmployee(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleRestore} disabled={isSubmitting}>
              <RotateCcw className="w-4 h-4 mr-2" />
              {isSubmitting ? "Restoring..." : "Restore Employee"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayoutNew>
  );
};

export default InactiveEmployees;

