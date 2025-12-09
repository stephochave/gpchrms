import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Briefcase } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

interface EmploymentRecord {
  id: string;
  employeeId: string;
  employmentPeriod: number;
  dateHired: string;
  dateEnded: string | null;
  employmentType: string | null;
  department: string | null;
  position: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface EmploymentHistoryProps {
  employeeId: string;
  isAdmin: boolean;
  onHistoryUpdate?: () => void;
}

export const EmploymentHistory = ({
  employeeId,
  isAdmin,
  onHistoryUpdate,
}: EmploymentHistoryProps) => {
  const [history, setHistory] = useState<EmploymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingRecord, setEditingRecord] = useState<EmploymentRecord | null>(
    null
  );
  const [formData, setFormData] = useState({
    dateHired: "",
    dateEnded: "",
    employmentType: "",
    department: "",
    position: "",
    notes: "",
  });
  const { toast } = useToast();

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/employment-history/employee/${employeeId}`
      );
      if (!res.ok) throw new Error("Failed to fetch employment history");
      const data = await res.json();
      setHistory(data.data || []);
    } catch (error: any) {
      console.error("Error fetching employment history:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load employment history",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchHistory();
    }
  }, [employeeId]);

  const resetForm = () => {
    setFormData({
      dateHired: "",
      dateEnded: "",
      employmentType: "",
      department: "",
      position: "",
      notes: "",
    });
    setEditingRecord(null);
  };

  const openAddDialog = () => {
    resetForm();
    setShowDialog(true);
  };

  const openEditDialog = (record: EmploymentRecord) => {
    setEditingRecord(record);
    setFormData({
      dateHired: record.dateHired,
      dateEnded: record.dateEnded || "",
      employmentType: record.employmentType || "",
      department: record.department || "",
      position: record.position || "",
      notes: record.notes || "",
    });
    setShowDialog(true);
  };

  const handleAddEmploymentPeriod = async () => {
    if (!formData.dateHired) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Date hired is required",
      });
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/employment-history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          dateHired: formData.dateHired,
          dateEnded: formData.dateEnded || null,
          employmentType: formData.employmentType || null,
          department: formData.department || null,
          position: formData.position || null,
          notes: formData.notes || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to add employment period");

      toast({
        title: "Success",
        description: "New employment period added successfully",
      });

      setShowDialog(false);
      resetForm();
      await fetchHistory();
      onHistoryUpdate?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add employment period",
      });
    }
  };

  const handleUpdateRecord = async () => {
    if (!editingRecord) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/employment-history/${editingRecord.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dateEnded: formData.dateEnded || null,
            notes: formData.notes || null,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update employment period");

      toast({
        title: "Success",
        description: "Employment period updated successfully",
      });

      setShowDialog(false);
      resetForm();
      await fetchHistory();
      onHistoryUpdate?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update employment period",
      });
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this employment period?")) {
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/employment-history/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete employment period");

      toast({
        title: "Success",
        description: "Employment period deleted successfully",
      });

      await fetchHistory();
      onHistoryUpdate?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete employment period",
      });
    }
  };

  const isCurrentPeriod = (record: EmploymentRecord) => !record.dateEnded;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            <CardTitle>Employment History</CardTitle>
          </div>
          {isAdmin && (
            <Button
              size="sm"
              onClick={openAddDialog}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Employment Period
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center text-muted-foreground py-4">
            Loading employment history...
          </div>
        ) : history.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No employment history found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Ended</TableHead>
                  <TableHead>Rehired On</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  {isAdmin && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      Period {record.employmentPeriod}
                    </TableCell>
                    <TableCell>
                      {new Date(record.dateHired).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {record.dateEnded
                        ? new Date(record.dateEnded).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {record.employmentPeriod > 1
                        ? new Date(record.createdAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>{record.department || "-"}</TableCell>
                    <TableCell>{record.position || "-"}</TableCell>
                    <TableCell>{record.employmentType || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={isCurrentPeriod(record) ? "default" : "secondary"}>
                        {isCurrentPeriod(record) ? "Current" : "Former"}
                      </Badge>
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(record)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteRecord(record.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingRecord ? "Update Employment Period" : "Add Employment Period"}
              </DialogTitle>
              <DialogDescription>
                {editingRecord
                  ? `Update employment period ${editingRecord.employmentPeriod}`
                  : "Record a new employment period for this employee"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="dateHired">Date Hired *</Label>
                <Input
                  id="dateHired"
                  type="date"
                  value={formData.dateHired}
                  onChange={(e) =>
                    setFormData({ ...formData, dateHired: e.target.value })
                  }
                  disabled={!!editingRecord}
                />
              </div>

              <div>
                <Label htmlFor="dateEnded">Date Ended</Label>
                <Input
                  id="dateEnded"
                  type="date"
                  value={formData.dateEnded}
                  onChange={(e) =>
                    setFormData({ ...formData, dateEnded: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="employmentType">Employment Type</Label>
                <Input
                  id="employmentType"
                  value={formData.employmentType}
                  onChange={(e) =>
                    setFormData({ ...formData, employmentType: e.target.value })
                  }
                  placeholder="e.g., Regular, Contract, Part-time"
                />
              </div>

              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Additional notes (optional)"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => {
                  setShowDialog(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={
                  editingRecord ? handleUpdateRecord : handleAddEmploymentPeriod
                }
              >
                {editingRecord ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
