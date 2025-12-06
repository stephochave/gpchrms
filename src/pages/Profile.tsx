import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayoutNew from "@/components/Layout/DashboardLayoutNew";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Upload,
  AlertCircle,
  FileText,
  Download,
  Eye,
} from "lucide-react";
import {
  generatePersonalDataSheet,
  generateServiceRecord,
} from "@/lib/documentTemplates";
import type { Employee as EmployeeRecord } from "@/types/employee";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const showPasswordChange =
    searchParams.get("changePassword") === "true" ||
    user?.passwordResetRequired;

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const buildDocumentEmployee = (): EmployeeRecord => {
    const today = new Date().toISOString().split("T")[0];
    return {
      id: String(employeeData?.id || "sample-employee"),
      employeeId: employeeData?.employeeId || user?.employeeId || "25-GPC-0000",
      firstName: employeeData?.firstName || "",
      middleName: employeeData?.middleName || "",
      lastName: employeeData?.lastName || "",
      suffixName: employeeData?.suffixName || "",
      fullName: employeeData?.fullName || user?.fullName || "Sample Employee",
      department: employeeData?.department || "Human Resources",
      position: employeeData?.position || "Staff",
      email: employeeData?.email || user?.email || "sample@gpc.edu.ph",
      phone: employeeData?.phone || "N/A",
      dateOfBirth: employeeData?.dateOfBirth || "1990-01-01",
      address: employeeData?.address || "San Vicente, Palawan",
      gender: employeeData?.gender || "N/A",
      civilStatus: employeeData?.civilStatus || "N/A",
      dateHired: employeeData?.dateHired || today,
      dateOfLeaving: employeeData?.dateOfLeaving || "",
      employmentType: employeeData?.employmentType || "Regular",
      role: employeeData?.role || user?.role,
      sssNumber: employeeData?.sssNumber || "",
      pagibigNumber: employeeData?.pagibigNumber || "",
      tinNumber: employeeData?.tinNumber || "",
      emergencyContact: employeeData?.emergencyContact || "",
      educationalBackground: employeeData?.educationalBackground || "",
      signatureFile: employeeData?.signatureFile || "",
      pdsFile: employeeData?.pdsFile || "",
      serviceRecordFile: employeeData?.serviceRecordFile || "",
      registeredFaceFile: employeeData?.registeredFaceFile || "",
      status: employeeData?.status || "active",
      archivedReason: employeeData?.archivedReason,
      archivedDate: employeeData?.archivedDate,
      createdAt: employeeData?.createdAt || new Date().toISOString(),
      updatedAt: employeeData?.updatedAt || new Date().toISOString(),
    };
  };

  const openDocumentPreview = (type: "pds" | "serviceRecord") => {
    if (!user) return;
    const employeeDoc = buildDocumentEmployee();
    const html =
      type === "pds"
        ? generatePersonalDataSheet(employeeDoc)
        : generateServiceRecord(employeeDoc);
    const docWindow = window.open("", "_blank");
    if (docWindow) {
      docWindow.document.write(html);
      docWindow.document.close();
      docWindow.focus();
      setTimeout(() => {
        try {
          docWindow.print();
        } catch (error) {
          console.error("Unable to open print dialog", error);
        }
      }, 400);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: "pds" | "serviceRecord" | "201"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "File must be smaller than 10MB",
      });
      return;
    }

    if (!file.type.includes("pdf") && !file.type.includes("image")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF or image file",
      });
      return;
    }

    setUploadingDoc(docType);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", docType);
      formData.append("employeeId", user?.employeeId || "");

      const response = await fetch(`${API_BASE_URL}/employees/${employeeData?.id}/upload-document`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Upload failed");
      }

      const data = await response.json();

      toast({
        title: "Success",
        description: `${docType.toUpperCase()} uploaded successfully`,
      });

      // Refresh employee data
      const refreshResponse = await fetch(
        `${API_BASE_URL}/employees?employeeId=${user?.employeeId}`
      );
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        if (refreshData.data && refreshData.data.length > 0) {
          setEmployeeData(refreshData.data[0]);
        }
      }
    } catch (error: any) {
      console.error("Upload error", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error?.message || "Unable to upload document",
      });
    } finally {
      setUploadingDoc(null);
      e.target.value = "";
    }
  };

  // Fetch employee data
  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!user?.employeeId) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/employees?employeeId=${user.employeeId}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.length > 0) {
            const emp = data.data[0];
            setEmployeeData(emp);
            setPhone(emp.phone || "");
            setAddress(emp.address || "");
            setFullName(emp.fullName || user.fullName || "");
            setEmail(emp.email || user.email || "");
          }
        }
      } catch (error) {
        console.error("Error fetching employee data", error);
      }
    };

    fetchEmployeeData();
  }, [user]);

  // Sync with user data from database
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New passwords do not match",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 6 characters",
      });
      return;
    }

    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:4000";
      const token =
        localStorage.getItem("hrms_token") || localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      toast({
        title: "Success",
        description: "Password changed successfully",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Clear password reset required flag and close dialog
      if (user?.passwordResetRequired) {
        const storedUser = localStorage.getItem("hrms_user");
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            parsed.passwordResetRequired = false;
            localStorage.setItem("hrms_user", JSON.stringify(parsed));
          } catch (err) {
            console.error("Failed to update stored user", err);
          }
        }
        setSearchParams({});
        // Reload to refresh user data
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Change password error", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Unable to change password. Please try again.",
      });
    }
  };

  return (
    <DashboardLayoutNew>
      {/* Force Password Change Dialog */}
      <Dialog
        open={showPasswordChange}
        onOpenChange={(open) => {
          if (!open && user?.passwordResetRequired) {
            // Don't allow closing if password reset is required
            return;
          }
          setSearchParams({});
        }}
      >
        <DialogContent
          className="sm:max-w-md"
          onPointerDownOutside={(e) => {
            if (user?.passwordResetRequired) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-full">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
              <DialogTitle>Password Change Required</DialogTitle>
            </div>
            <DialogDescription>
              Your password has been reset by an administrator. Please change
              your password to continue.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="forceCurrentPassword">Current Password</Label>
              <Input
                id="forceCurrentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter temporary password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="forceNewPassword">New Password</Label>
              <Input
                id="forceNewPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min. 6 characters)"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="forceConfirmPassword">Confirm New Password</Label>
              <Input
                id="forceConfirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!currentPassword || !newPassword || !confirmPassword}
            >
              Change Password
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <UserCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Profile</h1>
        </div>

        {/* Profile Info Card */}
        <Card className="p-6">
          <div className="flex items-start gap-6 mb-6">
            <Avatar className="w-24 h-24">
              {employeeData?.registeredFaceFile ? (
                <AvatarImage
                  src={`${API_BASE_URL}/uploads/${employeeData.registeredFaceFile}`}
                />
              ) : (
                <AvatarImage src="" />
              )}
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {user?.fullName?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">
                {employeeData?.fullName || user?.fullName}
              </h2>
              <p className="text-muted-foreground capitalize mb-1">
                {user?.role}
              </p>
              {employeeData?.department && (
                <p className="text-sm text-muted-foreground mb-1">
                  Department: {employeeData.department}
                </p>
              )}
              {employeeData?.position && (
                <p className="text-sm text-muted-foreground mb-4">
                  Position: {employeeData.position}
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    Full Name
                  </div>
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </div>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., +63 912 345 6789"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Role
                  </div>
                </Label>
                <Input
                  id="role"
                  value={user?.role}
                  disabled
                  className="capitalize"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </div>
              </Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., San Vicente, Palawan"
              />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
              />
            </div> */}

            {/* <Button type="submit" className="px-8">
              Save Changes
            </Button> */}
          </form>
        </Card>

        {/* Change Password Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Change Password</h2>

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-2xl">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="px-8">
              Change Password
            </Button>
          </form>
        </Card>

        {/* Documents Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">My Documents</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Personal Data Sheet (PDS)</h3>
                </div>
              </div>
              {employeeData?.pdsFile ? (
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const fileUrl = `${API_BASE_URL}/uploads/${employeeData.pdsFile}`;
                      window.open(fileUrl, "_blank");
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const fileUrl = `${API_BASE_URL}/uploads/${employeeData.pdsFile}`;
                      const link = document.createElement("a");
                      link.href = fileUrl;
                      link.download = `PDS_${
                        employeeData.employeeId || "document"
                      }.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={uploadingDoc === "pds"}
                    onClick={() => document.getElementById("upload-pds")?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingDoc === "pds" ? "Uploading..." : "Replace"}
                  </Button>
                  <input
                    id="upload-pds"
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "pds")}
                  />
                </div>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDocumentPreview("pds")}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    disabled={uploadingDoc === "pds"}
                    onClick={() => document.getElementById("upload-pds")?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingDoc === "pds" ? "Uploading..." : "Upload"}
                  </Button>
                  <input
                    id="upload-pds"
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "pds")}
                  />
                </div>
              )}
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Service Record</h3>
                </div>
              </div>
              {employeeData?.serviceRecordFile ? (
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const fileUrl = `${API_BASE_URL}/uploads/${employeeData.serviceRecordFile}`;
                      window.open(fileUrl, "_blank");
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const fileUrl = `${API_BASE_URL}/uploads/${employeeData.serviceRecordFile}`;
                      const link = document.createElement("a");
                      link.href = fileUrl;
                      link.download = `ServiceRecord_${
                        employeeData.employeeId || "document"
                      }.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={uploadingDoc === "serviceRecord"}
                    onClick={() => document.getElementById("upload-service")?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingDoc === "serviceRecord" ? "Uploading..." : "Replace"}
                  </Button>
                  <input
                    id="upload-service"
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "serviceRecord")}
                  />
                </div>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDocumentPreview("serviceRecord")}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    disabled={uploadingDoc === "serviceRecord"}
                    onClick={() => document.getElementById("upload-service")?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingDoc === "serviceRecord" ? "Uploading..." : "Upload"}
                  </Button>
                  <input
                    id="upload-service"
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "serviceRecord")}
                  />
                </div>
              )}
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">201 File</h3>
                </div>
              </div>
              {employeeData?.file201 ? (
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const fileUrl = `${API_BASE_URL}/uploads/${employeeData.file201}`;
                      window.open(fileUrl, "_blank");
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const fileUrl = `${API_BASE_URL}/uploads/${employeeData.file201}`;
                      const link = document.createElement("a");
                      link.href = fileUrl;
                      link.download = `201File_${
                        employeeData.employeeId || "document"
                      }.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={uploadingDoc === "201"}
                    onClick={() => document.getElementById("upload-201")?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingDoc === "201" ? "Uploading..." : "Replace"}
                  </Button>
                  <input
                    id="upload-201"
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "201")}
                  />
                </div>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  <p className="text-sm text-muted-foreground mb-2">No file uploaded</p>
                  <Button
                    variant="default"
                    size="sm"
                    disabled={uploadingDoc === "201"}
                    onClick={() => document.getElementById("upload-201")?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingDoc === "201" ? "Uploading..." : "Upload"}
                  </Button>
                  <input
                    id="upload-201"
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "201")}
                  />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Account Info */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Member since:</span>
              <span className="font-medium">
                {employeeData?.createdAt
                  ? new Date(employeeData.createdAt).toLocaleDateString()
                  : new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">User ID:</span>
              <span className="font-medium">{user?.id}</span>
            </div>
            {user?.employeeId && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Employee ID:</span>
                <span className="font-medium">{user.employeeId}</span>
              </div>
            )}
            {employeeData?.department && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Department:</span>
                <span className="font-medium">{employeeData.department}</span>
              </div>
            )}
            {employeeData?.position && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Designation:</span>
                <span className="font-medium">{employeeData.position}</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayoutNew>
  );
};

export default Profile;
