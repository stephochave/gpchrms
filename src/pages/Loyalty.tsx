import { useState, useEffect } from "react";
import DashboardLayoutNew from "@/components/Layout/DashboardLayoutNew";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { useAuth } from "@/contexts/AuthContext";
import { Award, Check, Printer, Trash2, Download } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

interface EligibleEmployee {
  id: string;
  employeeId: string;
  fullName: string;
  department: string;
  position: string;
  dateHired: string;
  yearsOfService: number;
  isEligible: boolean;
}

interface LoyaltyAward {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  yearsOfService: number;
  awardYear: number;
  awardDate: string;
  certificateNumber: string;
  status: "pending" | "approved" | "printed";
  generatedBy: string;
  generatedAt: string;
  approvedBy?: string | null;
  approvedAt?: string | null;
}

const Loyalty = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [eligibleEmployees, setEligibleEmployees] = useState<EligibleEmployee[]>([]);
  const [loyaltyAwards, setLoyaltyAwards] = useState<LoyaltyAward[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<EligibleEmployee | null>(null);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const isAdmin = user?.role === "admin";

  // Fetch eligible employees
  const fetchEligibleEmployees = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/loyalty/eligible`);
      if (!res.ok) throw new Error("Failed to fetch eligible employees");
      const data = await res.json();
      setEligibleEmployees(data.data || []);
    } catch (error) {
      console.error("Error fetching eligible employees:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load eligible employees.",
      });
    }
  };

  // Fetch loyalty awards
  const fetchLoyaltyAwards = async () => {
    try {
      const params = new URLSearchParams();
      // Regular employees see only their awards
      if (!isAdmin && user?.employeeId) {
        params.append("employeeId", user.employeeId);
      }

      const url = `${API_BASE_URL}/loyalty?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch loyalty awards");
      const data = await res.json();
      setLoyaltyAwards(data.data || []);
    } catch (error) {
      console.error("Error fetching loyalty awards:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load loyalty awards.",
      });
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchEligibleEmployees(), fetchLoyaltyAwards()]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerateAward = async (employee: EligibleEmployee) => {
    setSelectedEmployee(employee);
    setShowGenerateDialog(true);
  };

  const confirmGenerateAward = async () => {
    if (!selectedEmployee) return;

    setIsGenerating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/loyalty`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: selectedEmployee.employeeId,
          employeeName: selectedEmployee.fullName,
          department: selectedEmployee.department,
          position: selectedEmployee.position,
          yearsOfService: selectedEmployee.yearsOfService,
          generatedBy: user?.fullName || "System",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to generate award");

      toast({
        title: "Award Generated",
        description: `Loyalty award generated. Certificate: ${data.certificateNumber}`,
      });

      setShowGenerateDialog(false);
      setSelectedEmployee(null);
      loadData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate loyalty award.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveAward = async (awardId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/loyalty/${awardId}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvedBy: user?.fullName || "System",
        }),
      });

      if (!res.ok) throw new Error("Failed to approve award");

      toast({
        title: "Award Approved",
        description: "Loyalty award has been approved.",
      });

      loadData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to approve loyalty award.",
      });
    }
  };

  const handlePrintAward = async (award: LoyaltyAward) => {
    try {
      // Update status to printed
      await fetch(`${API_BASE_URL}/loyalty/${award.id}/print`, {
        method: "PUT",
      });

      // Generate and print certificate
      const certificateHTML = generateCertificateHTML(award);
      const printWindow = window.open("", "", "width=800,height=600");
      if (printWindow) {
        printWindow.document.write(certificateHTML);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
          loadData();
        }, 250);
      }

      toast({
        title: "Certificate Ready",
        description: "Loyalty certificate is ready for printing.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to print certificate.",
      });
    }
  };

  const handleDeleteAward = async (awardId: string) => {
    if (!confirm("Are you sure you want to delete this loyalty award?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/loyalty/${awardId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete award");

      toast({
        title: "Deleted",
        description: "Loyalty award has been deleted.",
      });

      loadData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete loyalty award.",
      });
    }
  };

  const generateCertificateHTML = (award: LoyaltyAward): string => {
    const formattedDate = new Date(award.awardDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Loyalty Certificate</title>
        <style>
          body {
            font-family: 'Georgia', serif;
            margin: 0;
            padding: 40px;
            background: white;
          }
          .certificate {
            border: 8px solid #c41e3a;
            padding: 60px 80px;
            text-align: center;
            background: linear-gradient(135deg, #fff9f0 0%, #fffbf5 100%);
            max-width: 900px;
            margin: 0 auto;
            box-shadow: 0 10px 30px rgba(196, 30, 58, 0.2);
            border-radius: 8px;
          }
          .header {
            margin-bottom: 40px;
          }
          .logo {
            font-size: 48px;
            font-weight: bold;
            color: #c41e3a;
            margin-bottom: 10px;
          }
          .title {
            font-size: 42px;
            font-weight: bold;
            color: #333;
            margin: 30px 0;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .subtitle {
            font-size: 18px;
            color: #666;
            font-style: italic;
            margin-bottom: 40px;
          }
          .content {
            font-size: 16px;
            line-height: 1.8;
            color: #333;
            margin: 40px 0;
          }
          .recipient {
            font-size: 28px;
            font-weight: bold;
            color: #c41e3a;
            margin: 30px 0;
            text-decoration: underline;
          }
          .details {
            margin: 30px 0;
            font-size: 14px;
            color: #666;
          }
          .detail-row {
            margin: 10px 0;
          }
          .detail-label {
            font-weight: bold;
            display: inline-block;
            width: 120px;
          }
          .signature-area {
            margin-top: 60px;
            display: flex;
            justify-content: space-around;
          }
          .signature-box {
            text-align: center;
            width: 200px;
          }
          .signature-line {
            border-bottom: 2px solid #333;
            margin: 40px 0 10px 0;
            height: 30px;
          }
          .signature-title {
            font-weight: bold;
            font-size: 12px;
          }
          .certificate-no {
            font-size: 11px;
            color: #999;
            margin-top: 40px;
            font-family: 'Courier New', monospace;
          }
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .certificate {
              box-shadow: none;
              border-width: 5px;
            }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">
            <div class="logo">🏆</div>
            <div class="title">Certificate of Loyalty</div>
            <div class="subtitle">In Recognition of Years of Dedicated Service</div>
          </div>

          <div class="content">
            <p>This is to certify that</p>
            <div class="recipient">${award.employeeName}</div>
            <p>has faithfully and diligently served</p>
            <p><strong>THE GREAT PLEBEIAN COLLEGE</strong></p>
            <p>for a period of</p>
            <p style="font-size: 24px; font-weight: bold; color: #c41e3a;">
              ${award.yearsOfService} Years
            </p>
            <p>with exceptional dedication and commitment</p>
          </div>

          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Employee ID:</span>
              <span>${award.employeeId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Department:</span>
              <span>${award.department}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Position:</span>
              <span>${award.position}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Award Year:</span>
              <span>${award.awardYear}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date Issued:</span>
              <span>${formattedDate}</span>
            </div>
          </div>

          <div class="signature-area">
            <div class="signature-box">
              <div class="signature-line"></div>
              <div class="signature-title">Authorized By</div>
              <div style="font-size: 11px; margin-top: 5px;">${award.approvedBy || "________________"}</div>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <div class="signature-title">Date</div>
              <div style="font-size: 11px; margin-top: 5px;">${formattedDate}</div>
            </div>
          </div>

          <div class="certificate-no">
            Certificate Number: ${award.certificateNumber}
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const filteredEligible = eligibleEmployees.filter((emp) =>
    [emp.fullName, emp.employeeId].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Debug: log to console
  useEffect(() => {
    console.log("Eligible employees:", eligibleEmployees);
  }, [eligibleEmployees]);

  const statusStyles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-emerald-100 text-emerald-800",
    printed: "bg-blue-100 text-blue-800",
  };

  return (
    <DashboardLayoutNew>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-foreground">Loyalty Awards</h1>
          <p className="text-muted-foreground">
            Manage and generate loyalty certificates for employees with 10+ years of service.
          </p>
        </div>

        {isAdmin && (
          <Card>
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Eligible Employees
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Employees eligible for loyalty awards ({filteredEligible.length})
                </p>
              </div>
              <div className="w-full md:w-72">
                <Input
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Employee Name</TableHead>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead className="text-center">Years of Service</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Loading eligible employees...
                        </TableCell>
                      </TableRow>
                    ) : filteredEligible.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No eligible employees found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEligible.map((emp) => (
                        <TableRow key={emp.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{emp.fullName}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {emp.employeeId}
                          </TableCell>
                          <TableCell>{emp.department}</TableCell>
                          <TableCell>{emp.position}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="border-emerald-500 text-emerald-700">
                              {emp.yearsOfService} years
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              onClick={() => handleGenerateAward(emp)}
                              className="gap-2"
                            >
                              <Award className="h-4 w-4" />
                              Generate Award
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              {isAdmin ? "All Loyalty Awards" : "My Loyalty Awards"}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {loyaltyAwards.length} award(s) found
            </p>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Employee</TableHead>
                    {isAdmin && <TableHead>Department</TableHead>}
                    <TableHead>Years</TableHead>
                    <TableHead className="text-center">Award Year</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={isAdmin ? 7 : 6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Loading awards...
                      </TableCell>
                    </TableRow>
                  ) : loyaltyAwards.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={isAdmin ? 7 : 6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No loyalty awards found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    loyaltyAwards.map((award) => (
                      <TableRow key={award.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">
                          <div>{award.employeeName}</div>
                          <div className="text-xs text-muted-foreground">{award.employeeId}</div>
                        </TableCell>
                        {isAdmin && <TableCell>{award.department}</TableCell>}
                        <TableCell className="text-center font-medium">
                          {award.yearsOfService}
                        </TableCell>
                        <TableCell className="text-center">{award.awardYear}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={statusStyles[award.status]}>
                            {award.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(award.generatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          {isAdmin && award.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproveAward(award.id)}
                              className="gap-1"
                            >
                              <Check className="h-3 w-3" />
                              Approve
                            </Button>
                          )}
                          {award.status !== "printed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePrintAward(award)}
                              className="gap-1"
                            >
                              <Printer className="h-3 w-3" />
                              Print
                            </Button>
                          )}
                          {isAdmin && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteAward(award.id)}
                              className="gap-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Loyalty Award</DialogTitle>
              <DialogDescription>
                Create a loyalty certificate for {selectedEmployee?.fullName}
              </DialogDescription>
            </DialogHeader>
            {selectedEmployee && (
              <div className="space-y-4 py-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Employee</p>
                  <p className="text-base font-semibold">{selectedEmployee.fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Employee ID</p>
                  <p className="text-base">{selectedEmployee.employeeId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Department</p>
                  <p className="text-base">{selectedEmployee.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Years of Service</p>
                  <p className="text-base font-semibold text-emerald-700">
                    {selectedEmployee.yearsOfService} years
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowGenerateDialog(false)}
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmGenerateAward}
                disabled={isGenerating}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isGenerating ? "Generating..." : "Generate Award"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayoutNew>
  );
};

export default Loyalty;
