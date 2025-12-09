import { useState, useEffect } from "react";
import DashboardLayoutNew from "@/components/Layout/DashboardLayoutNew";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Department } from "@/lib/organizationStorage";
import { useToast } from "@/hooks/use-toast";
import { Search, Pencil, Trash2, Database, ListChecks } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from '@/lib/fetch';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const DepartmentPage = () => {
  const { user } = useAuth();
  
  // Check if user is a department head
  const isDepartmentHead = user?.role === "admin" && user?.position && 
                           (user.position.toLowerCase().includes("head") || 
                            user.position.toLowerCase().includes("dean") || 
                            user.position.toLowerCase().includes("principal") ||
                            user.position.toLowerCase().includes("chairman") ||
                            user.position.toLowerCase().includes("president"));
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentName, setDepartmentName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [showEmployeesModal, setShowEmployeesModal] = useState(false);
  const [selectedDepartmentName, setSelectedDepartmentName] = useState<
    string | null
  >(null);
  const [deptEmployees, setDeptEmployees] = useState<any[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [deptStats, setDeptStats] = useState<{ [key: string]: { employees: number; designations: number } }>({});
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [deptDesignations, setDeptDesignations] = useState<any[]>([]);
  const [showAddDesignationDialog, setShowAddDesignationDialog] = useState(false);
  const [newDesignationName, setNewDesignationName] = useState("");
  const [isSubmittingDesignation, setIsSubmittingDesignation] = useState(false);

  const fetchDepartmentStats = async (deptList: Department[]) => {
    try {
      // Fetch employees
      const empResp = await fetch(`${API_BASE_URL}/employees?status=active`);
      const empData = empResp.ok ? await empResp.json() : { data: [] };
      const employees = empData.data || [];

      // Restrict employees to department head's department
      const filteredEmployees =
        isDepartmentHead && user?.department
          ? employees.filter(
              (emp: any) =>
                String(emp.department || "").toLowerCase() ===
                String(user.department).toLowerCase()
            )
          : employees;

      // Fetch designations
      const desigResp = await fetch(`${API_BASE_URL}/designations`);
      const desigData = desigResp.ok ? await desigResp.json() : { data: [] };
      const designations = desigData.data || [];

      // Build stats
      const stats: { [key: string]: { employees: number; designations: number } } = {};

      // Count employees per department
      filteredEmployees.forEach((emp: any) => {
        const dept = emp.department || 'Unknown';
        if (!stats[dept]) {
          stats[dept] = { employees: 0, designations: 0 };
        }
        stats[dept].employees++;
      });

      // Count designations per department (using departmentId)
      const filteredDesignations =
        isDepartmentHead && user?.department
          ? designations.filter((desig: any) => {
              const dept = deptList.find((d) => d.id === String(desig.departmentId));
              return (
                dept &&
                String(dept.name || "").toLowerCase() ===
                  String(user.department).toLowerCase()
              );
            })
          : designations;

      filteredDesignations.forEach((desig: any) => {
        const deptId = desig.departmentId;
        const dept = deptList.find(d => d.id === String(deptId));
        if (dept) {
          if (!stats[dept.name]) {
            stats[dept.name] = { employees: 0, designations: 0 };
          }
          stats[dept.name].designations++;
        }
      });

      setDeptStats(stats);
    } catch (error) {
      console.error('Error fetching department stats:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const response = await apiFetch(`${API_BASE_URL}/departments`);
      if (!response.ok) {
        throw new Error("Failed to fetch departments");
      }
      const data = await response.json();
      let fetchedDepartments: Department[] = data.data || [];

      // Restrict department heads to their own department
      if (isDepartmentHead && user?.department) {
        fetchedDepartments = fetchedDepartments.filter(
          (dept) =>
            String(dept.name || "").toLowerCase() ===
            String(user.department).toLowerCase()
        );
      }

      setDepartments(fetchedDepartments);
      await fetchDepartmentStats(fetchedDepartments);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to load departments. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSave = async () => {
    if (!departmentName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Department name is required",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const url = editingId
        ? `${API_BASE_URL}/departments/${editingId}`
        : `${API_BASE_URL}/departments`;
      const method = editingId ? "PUT" : "POST";

      const response = await apiFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: departmentName.trim() }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save department");
      }

      toast({
        title: "Success",
        description: editingId
          ? "Department updated successfully"
          : "Department added successfully",
      });
      setDepartmentName("");
      setEditingId(null);
      await fetchDepartments();
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Unable to save department. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (dept: Department) => {
    setDepartmentName(dept.name);
    setEditingId(dept.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) {
      return;
    }

    try {
      const response = await apiFetch(`${API_BASE_URL}/departments/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete department");
      }

      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
      await fetchDepartments();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to delete department. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    setDepartmentName("");
    setEditingId(null);
  };

  const filteredDepartments = departments.filter((dept) => {
    // Department heads can only see their own department
    if (isDepartmentHead && user?.department) {
      if (dept.name !== user.department) {
        return false;
      }
    }
    return dept.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleViewEmployees = async (deptName: string) => {
    try {
      setLoadingEmployees(true);
      setSelectedDepartmentName(deptName);
      
      // Find the department ID
      const dept = departments.find(d => d.name === deptName);
      if (!dept) throw new Error("Department not found");
      setSelectedDepartmentId(dept.id);

      // Fetch only active employees then filter by department client-side
      const empResp = await fetch(`${API_BASE_URL}/employees?status=active`);
      if (!empResp.ok) throw new Error("Failed to fetch employees");
      const empData = await empResp.json();
      const employees = (empData.data || []).filter(
        (e: any) => String(e.department || "").toLowerCase() === deptName.toLowerCase()
      );
      setDeptEmployees(employees);

      // Fetch designations for this department
      const desigResp = await fetch(`${API_BASE_URL}/designations?departmentId=${dept.id}`);
      if (!desigResp.ok) throw new Error("Failed to fetch designations");
      const desigData = await desigResp.json();
      setDeptDesignations(desigData.data || []);

      setShowEmployeesModal(true);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to load data for this department.",
      });
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleAddDesignation = async () => {
    if (!newDesignationName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Designation name is required",
      });
      return;
    }

    if (!selectedDepartmentId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Department not found",
      });
      return;
    }

    try {
      setIsSubmittingDesignation(true);
      const response = await fetch(`${API_BASE_URL}/designations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newDesignationName.trim(),
          departmentId: parseInt(selectedDepartmentId),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create designation");
      }

      toast({
        title: "Success",
        description: "Designation added successfully",
      });

      setNewDesignationName("");
      setShowAddDesignationDialog(false);

      // Refresh designations
      if (selectedDepartmentId) {
        const desigResp = await fetch(`${API_BASE_URL}/designations?departmentId=${selectedDepartmentId}`);
        if (desigResp.ok) {
          const desigData = await desigResp.json();
          setDeptDesignations(desigData.data || []);
        }
      }

      // Refresh stats
      await fetchDepartmentStats();
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Unable to add designation. Please try again.",
      });
    } finally {
      setIsSubmittingDesignation(false);
    }
  };



  return (
    <DashboardLayoutNew>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Department Management</h1>
          <p className="text-muted-foreground">
            Manage and organize company departments
          </p>
        </div>

        {/* Add/Edit Department Section - Only for system admins */}
        {!isDepartmentHead && (
        <Card className="border-2 shadow-lg">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Database className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {editingId ? "Edit Department" : "Add New Department"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {editingId
                    ? "Update department information"
                    : "Create a new department"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="max-w-2xl space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="departmentName"
                  className="text-base font-semibold"
                >
                  Department Name
                </Label>
                <Input
                  id="departmentName"
                  placeholder="e.g., Human Resources, IT Department"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="px-8 h-11 bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingId
                    ? "Update Department"
                    : "Add Department"}
                </Button>
                {editingId && (
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="px-8 h-11"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
        )}

        {/* Department List Section */}
        <Card className="border-2 shadow-lg">
          <div className="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/30 p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <ListChecks className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Department List</h3>
                  <p className="text-sm text-muted-foreground">
                    Total: {filteredDepartments.length} departments
                  </p>
                </div>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left py-4 px-6 font-semibold text-sm">
                      S.No
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-sm">
                      Department Name
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-sm">
                      No. of Employees
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-sm">
                      No. of Designations
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-muted-foreground"
                      >
                        Loading departments...
                      </td>
                    </tr>
                  ) : filteredDepartments.length > 0 ? (
                    filteredDepartments.map((dept, index) => (
                      <tr
                        key={dept.id}
                        className="border-t hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-4 px-6 font-medium text-muted-foreground">
                          {index + 1}
                        </td>
                        <td className="py-4 px-6 font-medium">{dept.name}</td>
                        <td className="py-4 px-6 text-sm text-center font-medium">
                          <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {deptStats[dept.name]?.employees || 0}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-center font-medium">
                          <span className="inline-flex items-center justify-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {deptStats[dept.name]?.designations || 0}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2 justify-center flex-wrap">
                            {!isDepartmentHead && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(dept)}
                                className="h-9 gap-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                              >
                                <Pencil className="h-4 w-4" />
                                Edit
                              </Button>
                            )}
                            {!isDepartmentHead && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(dept.id)}
                                className="h-9 gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-muted-foreground"
                      >
                        No departments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
        {/* Employees Modal */}
        <Dialog open={showEmployeesModal} onOpenChange={setShowEmployeesModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Employees & Designations in {selectedDepartmentName}
              </DialogTitle>
              <DialogDescription>
                {loadingEmployees
                  ? "Loading data..."
                  : `${deptEmployees.length} active employee(s) and ${deptStats[selectedDepartmentName || '']?.designations || 0} designation(s) found.`}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-6">
              {/* Employees Section */}
              <div>
                <h3 className="text-sm font-semibold mb-3 text-blue-700">Employees ({deptEmployees.length})</h3>
                {loadingEmployees ? (
                  <div className="py-4 text-center text-muted-foreground">
                    Loading employees...
                  </div>
                ) : deptEmployees.length > 0 ? (
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-blue-50">
                          <th className="text-left py-3 px-4 font-semibold">#</th>
                          <th className="text-left py-3 px-4 font-semibold">Name</th>
                          <th className="text-left py-3 px-4 font-semibold">Designation</th>
                          <th className="text-left py-3 px-4 font-semibold">Employee ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deptEmployees.map((e, i) => (
                          <tr key={e.id || e.employeeId || i} className="border-t hover:bg-gray-50">
                            <td className="py-3 px-4">{i + 1}</td>
                            <td className="py-3 px-4">{`${e.firstName || ''} ${e.lastName || ''}`.trim() || '-'}</td>
                            <td className="py-3 px-4 font-medium">{e.position || '-'}</td>
                            <td className="py-3 px-4">{e.employeeId || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-4 text-center text-muted-foreground text-sm">
                    No active employees in this department.
                  </div>
                )}
              </div>

              {/* Designations Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-green-700">All Designations ({deptStats[selectedDepartmentName || '']?.designations || 0})</h3>
                  <Button
                    size="sm"
                    onClick={() => setShowAddDesignationDialog(true)}
                    className="h-8 bg-green-600 hover:bg-green-700 text-white"
                  >
                    + Add Designation
                  </Button>
                </div>
                {loadingEmployees ? (
                  <div className="py-4 text-center text-muted-foreground">
                    Loading designations...
                  </div>
                ) : deptDesignations.length > 0 ? (
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-green-50">
                          <th className="text-left py-3 px-4 font-semibold">#</th>
                          <th className="text-left py-3 px-4 font-semibold">Designation Name</th>
                          <th className="text-center py-3 px-4 font-semibold">Assigned</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deptDesignations.map((d, i) => {
                          const assignedEmployee = deptEmployees.find(e => e.position === d.name);
                          return (
                            <tr key={d.id || i} className="border-t hover:bg-gray-50">
                              <td className="py-3 px-4">{i + 1}</td>
                              <td className="py-3 px-4 font-medium">{d.name}</td>
                              <td className="py-3 px-4 text-center">
                                {assignedEmployee ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                    Yes
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                    Vacant
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-4 text-center text-muted-foreground text-sm">
                    No designations found in this department.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowEmployeesModal(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Designation Dialog */}
        <Dialog open={showAddDesignationDialog} onOpenChange={setShowAddDesignationDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Designation</DialogTitle>
              <DialogDescription>
                Add a new designation to {selectedDepartmentName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="designationName" className="text-base font-semibold">
                  Designation Name
                </Label>
                <Input
                  id="designationName"
                  placeholder="e.g., Senior Developer, Manager"
                  value={newDesignationName}
                  onChange={(e) => setNewDesignationName(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddDesignationDialog(false);
                  setNewDesignationName("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddDesignation}
                disabled={isSubmittingDesignation}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmittingDesignation ? "Adding..." : "Add Designation"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayoutNew>
  );
};

export default DepartmentPage;
