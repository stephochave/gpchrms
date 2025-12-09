import { ChangeEvent, useState, useEffect } from "react";
import DashboardLayoutNew from "@/components/Layout/DashboardLayoutNew";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Folder, Edit, FileText, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentQuickActions from "@/components/Documents/DocumentQuickActions";
import {
  documentFolders,
  type DocumentNavKey,
  type DocumentFolderKey,
} from "@/lib/documentWorkspace";
import {
  DocumentTemplateKey,
  generateDocumentByTemplate,
} from "@/lib/documentTemplates";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const modalConfigs: Record<
  DocumentNavKey,
  {
    title: string;
    description: string;
    fields: Array<{ name: string; placeholder: string; type?: string }>;
    cta: string;
    successMessage: string;
  }
> = {
  documents: {
    title: "Add Document",
    description: "Upload employee documents with description and owner.",
    fields: [
      { name: "documentTitle", placeholder: "Document title" },
      { name: "documentDescription", placeholder: "Document description" },
      { name: "documentFile", placeholder: "Choose file", type: "file" },
    ],
    cta: "Upload Document",
    successMessage: "Document uploaded successfully.",
  },
  templates: {
    title: "Add Template",
    description: "Create a reusable document template.",
    fields: [
      { name: "templateName", placeholder: "Template name" },
      { name: "templateCategory", placeholder: "Category" },
      { name: "templateFile", placeholder: "Upload template", type: "file" },
    ],
    cta: "Save Template",
    successMessage: "Template saved and ready to use.",
  },
  employeeReports: {
    title: "Generate Employee Report",
    description: "Configure and download employee report files.",
    fields: [
      { name: "reportName", placeholder: "Report name" },
      { name: "reportFilter", placeholder: "Filter (e.g. Department, Status)" },
    ],
    cta: "Generate Report",
    successMessage: "Employee report is being generated.",
  },
  attendanceReports: {
    title: "Generate Attendance Report",
    description: "Set filters to export attendance reports.",
    fields: [
      { name: "attendanceRange", placeholder: "Date range (e.g. Jan 1 - 15)" },
      { name: "attendanceFilter", placeholder: "Department or shift" },
    ],
    cta: "Generate Attendance Report",
    successMessage: "Attendance report queued successfully.",
  },
};

type SelectedFolder = { title: string; key: DocumentFolderKey } | null;

interface Document {
  id: string;
  name: string;
  employeeId: string | null;
  pds: string | null;
  sr: string | null;
  coe: string | null;
  date: string;
}

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<SelectedFolder>(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [activeModal, setActiveModal] = useState<DocumentNavKey | null>(null);
  const [modalForm, setModalForm] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<Document[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showEditDocDialog, setShowEditDocDialog] = useState(false);
  const [editingDoc, setEditingDoc] = useState<{
    employeeId: string;
    type: "pds" | "sr" | "coe" | "contract";
    currentUrl: string | null;
  } | null>(null);
  const [showViewDocDialog, setShowViewDocDialog] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<{
    url: string;
    title: string;
    type: "pds" | "sr" | "coe";
    isBase64?: boolean;
  } | null>(null);
  const [editDocFile, setEditDocFile] = useState<File | null>(null);
  const [folderDocuments, setFolderDocuments] = useState<any[]>([]);
  const [folderSearchTerm, setFolderSearchTerm] = useState("");
  const [generatorEmployeeId, setGeneratorEmployeeId] = useState("");
  const [isGeneratingDocument, setIsGeneratingDocument] = useState(false);
  const [activeTemplateKey, setActiveTemplateKey] =
    useState<DocumentTemplateKey | null>(null);

  // Department head detection: admin role + head/dean/principal/chairman/president in position
  const isDepartmentHead =
    user?.role === "admin" &&
    user?.position &&
    (user.position.toLowerCase().includes("head") ||
      user.position.toLowerCase().includes("dean") ||
      user.position.toLowerCase().includes("principal") ||
      user.position.toLowerCase().includes("chairman") ||
      user.position.toLowerCase().includes("president"));

  // Helper function to fetch and process documents
  const fetchAndProcessDocuments = async () => {
    try {
      const [documentsRes, employeesRes, allDocsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/documents?type=employee-doc`),
        fetch(`${API_BASE_URL}/employees?status=active`),
        fetch(`${API_BASE_URL}/documents?type=employee-doc`),
      ]);

      if (!documentsRes.ok) {
        throw new Error("Failed to fetch documents");
      }

      const documentsData = await documentsRes.json();
      const allDocsData = await allDocsRes.json();
      let employeesData: any[] = [];

      if (employeesRes.ok) {
        const empData = await employeesRes.json();
        employeesData = empData.data || [];

        // Restrict department heads to their own department
        if (isDepartmentHead && user?.department) {
          employeesData = employeesData.filter(
            (emp: any) =>
              String(emp.department || "").toLowerCase() ===
              String(user.department).toLowerCase()
          );
        }

        setEmployees(employeesData);
      }

      // Create employee map for names and files
      const employeeMap = new Map(
        employeesData.map((emp: any) => [emp.employeeId, emp])
      );

      // Group documents by employee
      const employeeDocs = new Map<string, Document>();

      // First, add documents from employees table (pds_file, service_record_file)
      employeesData.forEach((emp: any) => {
        if (emp.employeeId && !employeeDocs.has(emp.employeeId)) {
          employeeDocs.set(emp.employeeId, {
            id: emp.employeeId,
            name: emp.fullName || "",
            employeeId: emp.employeeId,
            pds: emp.pdsFile 
              ? (emp.pdsFile.startsWith('data:') ? emp.pdsFile : `/uploads/${emp.pdsFile}`)
              : null,
            sr: emp.serviceRecordFile
              ? (emp.serviceRecordFile.startsWith('data:') ? emp.serviceRecordFile : `/uploads/${emp.serviceRecordFile}`)
              : null,
            coe: null,
            date: emp.createdAt || new Date().toISOString(),
          });
        } else if (emp.employeeId) {
          const empDoc = employeeDocs.get(emp.employeeId)!;
          if (emp.pdsFile && !empDoc.pds) {
            empDoc.pds = emp.pdsFile.startsWith('data:') 
              ? emp.pdsFile 
              : `/uploads/${emp.pdsFile}`;
          }
          if (emp.serviceRecordFile && !empDoc.sr) {
            empDoc.sr = emp.serviceRecordFile.startsWith('data:')
              ? emp.serviceRecordFile
              : `/uploads/${emp.serviceRecordFile}`;
          }
        }
      });

      // Build allowed employee ids for department heads
      const allowedEmployeeIds = isDepartmentHead
        ? new Set(employeesData.map((emp: any) => emp.employeeId))
        : null;

      // Then, add/update with documents from documents table
      (documentsData.data || []).forEach((doc: any) => {
        if (allowedEmployeeIds && doc.employeeId && !allowedEmployeeIds.has(doc.employeeId)) {
          return; // Skip documents outside the department for department heads
        }
        if (doc.employeeId) {
          if (!employeeDocs.has(doc.employeeId)) {
            const employee = employeeMap.get(doc.employeeId);
            employeeDocs.set(doc.employeeId, {
              id: doc.employeeId,
              name: employee?.fullName || "",
              employeeId: doc.employeeId,
              pds: null,
              sr: null,
              coe: null,
              date: doc.createdAt || doc.uploadedAt,
            });
          }

          const empDoc = employeeDocs.get(doc.employeeId)!;
          const docType = doc.documentType?.toLowerCase() || "";
          if (
            docType === "pds" ||
            doc.name.toLowerCase().includes("pds") ||
            doc.name.toLowerCase().includes("personal data")
          ) {
            empDoc.pds = doc.fileUrl;
          } else if (
            docType === "sr" ||
            doc.name.toLowerCase().includes("service")
          ) {
            empDoc.sr = doc.fileUrl;
          } else if (
            docType === "coe" ||
            doc.name.toLowerCase().includes("certificate")
          ) {
            empDoc.coe = doc.fileUrl;
          }
        }
      });

      setDocuments(Array.from(employeeDocs.values()));
    } catch (error) {
      console.error("Error fetching documents", error);
      throw error;
    }
  };

  // Fetch documents and employees from API
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        await fetchAndProcessDocuments();
      } catch (error) {
        console.error("Error fetching documents", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load documents",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [toast]);

  useEffect(() => {
    const state = location.state as { openDialog?: DocumentNavKey } | null;
    if (state?.openDialog) {
      // openModal(state.openDialog);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // const openModal = (key: DocumentNavKey) => {
  //   if (key === 'employeeReports') {
  //     setReportDialogType('employee');
  //     return;
  //   }
  //   if (key === 'attendanceReports') {
  //     setReportDialogType('attendance');
  //     return;
  //   }

  //   setActiveModal(key);
  //   setModalForm({});
  // };

  const handleModalFieldChange = (name: string, value: string) => {
    setModalForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalSubmit = async () => {
    if (!activeModal) return;

    try {
      if (activeModal === "documents" || activeModal === "templates") {
        const fileInput = document.querySelector(
          `input[type="file"]`
        ) as HTMLInputElement;
        const file = fileInput?.files?.[0];

        if (!file) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Please select a file to upload",
          });
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "name",
          modalForm.documentTitle || modalForm.templateName || file.name
        );
        formData.append(
          "type",
          activeModal === "templates" ? "template" : "other"
        );
        formData.append("category", modalForm.templateCategory || "");
        formData.append("description", modalForm.documentDescription || "");
        formData.append("uploadedBy", user?.fullName || "System");

        const response = await fetch(`${API_BASE_URL}/documents`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload document");
        }

        toast({
          title: modalConfigs[activeModal].title,
          description: modalConfigs[activeModal].successMessage,
        });

        // Refresh documents list
        if (activeModal === "documents") {
          await fetchAndProcessDocuments();
        }
      } else {
        // For reports, just show success message
        toast({
          title: modalConfigs[activeModal].title,
          description: modalConfigs[activeModal].successMessage,
        });
      }

      setActiveModal(null);
      setModalForm({});
    } catch (error) {
      console.error("Error submitting form", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload document. Please try again.",
      });
    }
  };
  const filteredDocs = (() => {
    const term = searchTerm.trim().toLowerCase();

    // If there's no search term, show all documents (restore viewing)
    if (!term) return documents;

    return documents.filter((doc) =>
      [doc.name, doc.employeeId, doc.pds, doc.sr, doc.coe].some((value) =>
        value?.toLowerCase().includes(term)
      )
    );
  })();

  return (
    <DashboardLayoutNew>
      <div className="space-y-6">
        

        {/* <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-xl">Folders</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {documentFolders.map((folder) => (
              <button
                key={folder.key}
                className="rounded-xl border border-border/60 bg-gradient-to-b from-blue-50 to-white p-4 text-center transition hover:border-primary focus:outline-none"
                onClick={async () => {
                  setSelectedFolder({ title: folder.title, key: folder.key });

                  // Fetch documents for this folder type
                  try {
                    const response = await fetch(
                      `${API_BASE_URL}/documents?type=employee-doc&documentType=${folder.key}`
                    );
                    if (response.ok) {
                      const data = await response.json();
                      const filteredDocs = data.data.filter((doc: any) => {
                        const docType = doc.documentType?.toLowerCase() || "";
                        const name = doc.name.toLowerCase();
                        if (folder.key === "pds") {
                          return (
                            docType === "pds" ||
                            name.includes("pds") ||
                            name.includes("personal data")
                          );
                        } else if (folder.key === "sr") {
                          return docType === "sr" || name.includes("service");
                        } else if (folder.key === "coe") {
                          return (
                            docType === "coe" || name.includes("certificate")
                          );
                        } else if (folder.key === "contract") {
                          return (
                            docType === "contract" || name.includes("contract")
                          );
                        }
                        return false;
                      });

                      // Also include files from employees table
                      const empDocs = employees
                        .filter((emp) => {
                          if (folder.key === "pds" && emp.pdsFile) return true;
                          if (folder.key === "sr" && emp.serviceRecordFile)
                            return true;
                          return false;
                        })
                        .map((emp) => ({
                          id: emp.id,
                          name: emp.fullName,
                          employeeId: emp.employeeId,
                          fileUrl:
                            folder.key === "pds"
                              ? `/uploads/${emp.pdsFile}`
                              : `/uploads/${emp.serviceRecordFile}`,
                          fileSize: "N/A",
                          uploadedAt: emp.createdAt,
                        }));

                      setFolderDocuments([...filteredDocs, ...empDocs]);
                    }
                  } catch (error) {
                    console.error("Error fetching folder documents", error);
                  }

                  setShowFolderModal(true);
                }}
              >
                <div className="flex justify-center mb-2">
                  <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Folder className="w-12 h-12 text-blue-600" />
                  </div>
                </div>
                <p className="font-medium">{folder.title}</p>
                <p className="text-xs text-muted-foreground">
                  {folder.description}
                </p>
              </button>
            ))}
          </CardContent>
        </Card> */}

        <Card className="p-6 border-dashed border-primary/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">View Employee Documents</h3>
              <p className="text-sm text-muted-foreground">
                Type the employee ID then choose which template to merge
                automatically.
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                value={generatorEmployeeId}
                onChange={(event) =>
                  setGeneratorEmployeeId(event.target.value.toUpperCase())
                }
                placeholder="25-GPC-12345"
                className="w-full sm:w-64"
              />
              <Button
                variant="outline"
                onClick={() => setGeneratorEmployeeId("")}
              >
                Clear
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                key: "pds" as DocumentTemplateKey,
                label: "Personal Data Sheet",
                description: "Auto-fill PDS template",
              },
              {
                key: "file201" as DocumentTemplateKey,
                label: "201 File Summary",
                description: "Snapshot of employee records",
              },
              {
                key: "serviceRecord" as DocumentTemplateKey,
                label: "Service Record",
                description: "Employment history overview",
              },
              {
                key: "coe" as DocumentTemplateKey,
                label: "Certificate of Employment",
                description: "COE ready for printing",
              },
            ].map((template) => {
              const isActive = activeTemplateKey === template.key;
              return (
                <Card
                  key={template.key}
                  className="p-4 flex flex-col gap-2 border border-border/70"
                >
                  <div>
                    <h4 className="font-semibold">{template.label}</h4>
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={async () => {
                        if (!generatorEmployeeId.trim()) {
                        toast({
                          variant: "destructive",
                          title: "Employee ID required",
                          description:
                            "Please type an employee ID before viewing a document.",
                        });
                        return;
                      }
                      setIsGeneratingDocument(true);
                      setActiveTemplateKey(template.key);
                      try {
                        const response = await fetch(
                          `${API_BASE_URL}/employees?employeeId=${generatorEmployeeId}`
                        );
                        if (!response.ok)
                          throw new Error("Failed to fetch employee");
                        const data = await response.json();
                        const employee = data.data?.[0];
                        if (!employee) {
                          toast({
                            variant: "destructive",
                            title: "Employee not found",
                            description: `No employee matched the ID ${generatorEmployeeId.trim()}.`,
                          });
                          return;
                        }
                        if (
                          isDepartmentHead &&
                          user?.department &&
                          String(employee.department || "").toLowerCase() !==
                            String(user.department).toLowerCase()
                        ) {
                          toast({
                            variant: "destructive",
                            title: "Access denied",
                            description:
                              "You can only generate documents for employees in your department.",
                          });
                          return;
                        }
                        const html = generateDocumentByTemplate(
                          template.key,
                          employee
                        );
                        const docWindow = window.open("", "_blank");
                        if (docWindow) {
                          docWindow.document.write(html);
                          docWindow.document.close();
                          docWindow.focus();
                          setTimeout(() => {
                            try {
                              docWindow.focus();
                              docWindow.print();
                            } catch (error) {
                              console.error(
                                "Unable to trigger print automatically",
                                error
                              );
                            }
                          }, 400);
                        }
                        toast({
                          title: "Document ready",
                          description: `${template.label} prepared for ${employee.fullName}.`,
                        });
                      } catch (error) {
                        console.error("Document generation failed", error);
                        toast({
                          variant: "destructive",
                          title: "View failed",
                          description:
                            "Unable to prepare the selected document. Please try again.",
                        });
                      } finally {
                        setIsGeneratingDocument(false);
                        setActiveTemplateKey(null);
                      }
                    }}
                    disabled={
                      !generatorEmployeeId.trim() || isGeneratingDocument
                    }
                  >
                    {isActive && isGeneratingDocument ? "Viewing…" : "View"}
                  </Button>
                </Card>
              );
            })}
          </div>
        </Card>
        <Card className="shadow-sm border-border">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl">Documents</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 rounded-full"
              />
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium">
                      Employee Name
                    </th>
                    <th className="py-3 px-4 text-left font-medium">
                      Employee ID
                    </th>
                    <th className="py-3 px-4 text-left font-medium">
                      Personal Data Sheet
                    </th>
                    <th className="py-3 px-4 text-left font-medium">
                      Service Records
                    </th>
                    <th className="py-3 px-4 text-left font-medium">
                      Certificate of Employments
                    </th>
                    <th className="py-3 px-4 text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-muted-foreground"
                      >
                        Loading documents...
                      </td>
                    </tr>
                  ) : filteredDocs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-muted-foreground"
                      >
                        <span>No documents found</span>
                      </td>
                    </tr>
                  ) : (
                    filteredDocs.map((doc, idx) => (
                      <tr
                        key={doc.id || idx}
                        className={idx % 2 === 0 ? "bg-[#eef3ff]" : "bg-white"}
                      >
                        <td className="py-3 px-4 font-medium text-foreground">
                          {doc.name || "N/A"}
                        </td>
                        <td className="py-3 px-4">{doc.employeeId || "N/A"}</td>
                        <td className="py-3 px-4">
                          {doc.pds ? (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 hover:underline h-auto p-1"
                                onClick={() => {
                                  const isBase64 = doc.pds?.startsWith('data:');
                                  let fileUrl: string;
                                  if (isBase64) {
                                    // Base64 file - use it directly
                                    fileUrl = doc.pds;
                                  } else {
                                    // File path - use backend route to serve it
                                    fileUrl = `${API_BASE_URL}/documents/file/${doc.employeeId}/pds`;
                                  }
                                  setViewingDoc({
                                    url: fileUrl,
                                    title: `Personal Data Sheet - ${doc.employeeId}`,
                                    type: "pds",
                                    isBase64: isBase64,
                                  });
                                  setShowViewDocDialog(true);
                                }}
                              >
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  // Open edit dialog for PDS
                                  setEditingDoc({
                                    employeeId: doc.employeeId,
                                    type: "pds",
                                    currentUrl: doc.pds,
                                  });
                                  setShowEditDocDialog(true);
                                }}
                                title="Edit PDS"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingDoc({
                                  employeeId: doc.employeeId,
                                  type: "pds",
                                  currentUrl: null,
                                });
                                setShowEditDocDialog(true);
                              }}
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              Upload
                            </Button>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {doc.sr ? (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 hover:underline h-auto p-1"
                                onClick={() => {
                                  const isBase64 = doc.sr?.startsWith('data:');
                                  let fileUrl: string;
                                  if (isBase64) {
                                    // Base64 file - use it directly
                                    fileUrl = doc.sr;
                                  } else {
                                    // File path - use backend route to serve it
                                    fileUrl = `${API_BASE_URL}/documents/file/${doc.employeeId}/sr`;
                                  }
                                  setViewingDoc({
                                    url: fileUrl,
                                    title: `Service Record - ${doc.employeeId}`,
                                    type: "sr",
                                    isBase64: isBase64,
                                  });
                                  setShowViewDocDialog(true);
                                }}
                              >
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  setEditingDoc({
                                    employeeId: doc.employeeId,
                                    type: "sr",
                                    currentUrl: doc.sr,
                                  });
                                  setShowEditDocDialog(true);
                                }}
                                title="Edit Service Records"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingDoc({
                                  employeeId: doc.employeeId,
                                  type: "sr",
                                  currentUrl: null,
                                });
                                setShowEditDocDialog(true);
                              }}
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              Upload
                            </Button>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {doc.coe ? (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 hover:underline h-auto p-1"
                                onClick={() => {
                                  const isBase64 = doc.coe?.startsWith('data:');
                                  let fileUrl: string;
                                  if (isBase64) {
                                    // Base64 file - use it directly
                                    fileUrl = doc.coe;
                                  } else {
                                    // File path - use backend route to serve it
                                    fileUrl = doc.coe.startsWith('/') 
                                      ? `${API_BASE_URL}${doc.coe}`
                                      : `${API_BASE_URL}/documents/file/${doc.employeeId}/coe`;
                                  }
                                  setViewingDoc({
                                    url: fileUrl,
                                    title: `Certificate of Employment - ${doc.employeeId}`,
                                    type: "coe",
                                    isBase64: isBase64,
                                  });
                                  setShowViewDocDialog(true);
                                }}
                              >
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  setEditingDoc({
                                    employeeId: doc.employeeId,
                                    type: "coe",
                                    currentUrl: doc.coe,
                                  });
                                  setShowEditDocDialog(true);
                                }}
                                title="Edit COE"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingDoc({
                                  employeeId: doc.employeeId,
                                  type: "coe",
                                  currentUrl: null,
                                });
                                setShowEditDocDialog(true);
                              }}
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              Upload
                            </Button>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(doc.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Folder Modal */}
        <Dialog open={showFolderModal} onOpenChange={setShowFolderModal}>
          <DialogContent className="max-w-3xl w-full">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                  <Search className="w-4 h-4 text-primary" />
                </div>
                {selectedFolder?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  className="pl-9 rounded-full"
                  value={folderSearchTerm}
                  onChange={(e) => setFolderSearchTerm(e.target.value)}
                />
              </div>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium">
                        Employee Name
                      </th>
                      <th className="py-3 px-4 text-left font-medium">
                        Employee ID
                      </th>
                      <th className="py-3 px-4 text-left font-medium">File</th>
                      <th className="py-3 px-4 text-left font-medium">Size</th>
                      <th className="py-3 px-4 text-left font-medium">
                        Date Created
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {folderDocuments.filter(
                      (doc) =>
                        !folderSearchTerm ||
                        doc.name
                          ?.toLowerCase()
                          .includes(folderSearchTerm.toLowerCase()) ||
                        doc.employeeId
                          ?.toLowerCase()
                          .includes(folderSearchTerm.toLowerCase())
                    ).length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-8 text-center text-muted-foreground"
                        >
                          No documents found
                        </td>
                      </tr>
                    ) : (
                      folderDocuments
                        .filter(
                          (doc) =>
                            !folderSearchTerm ||
                            doc.name
                              ?.toLowerCase()
                              .includes(folderSearchTerm.toLowerCase()) ||
                            doc.employeeId
                              ?.toLowerCase()
                              .includes(folderSearchTerm.toLowerCase())
                        )
                        .map((doc, idx) => (
                          <tr
                            key={doc.id || idx}
                            className={
                              idx % 2 === 0 ? "bg-[#eef3ff]" : "bg-white"
                            }
                          >
                            <td className="py-3 px-4 font-medium text-foreground">
                              {doc.name || "N/A"}
                            </td>
                            <td className="py-3 px-4">
                              {doc.employeeId || "N/A"}
                            </td>
                            <td className="py-3 px-4">
                              <a
                                href={`${API_BASE_URL}${doc.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                              >
                                View
                              </a>
                            </td>
                            <td className="py-3 px-4">
                              {doc.fileSize || "N/A"}
                            </td>
                            <td className="py-3 px-4">
                              {new Date(
                                doc.uploadedAt || doc.createdAt
                              ).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Quick actions modal */}
        <Dialog
          open={Boolean(activeModal)}
          onOpenChange={(open) => !open && setActiveModal(null)}
        >
          <DialogContent className="max-w-lg">
            {activeModal && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    {modalConfigs[activeModal].title}
                  </DialogTitle>
                  <DialogDescription>
                    {modalConfigs[activeModal].description}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {modalConfigs[activeModal].fields.map((field) => (
                    <Input
                      key={field.name}
                      placeholder={field.placeholder}
                      type={field.type ?? "text"}
                      value={
                        field.type === "file"
                          ? undefined
                          : modalForm[field.name] ?? ""
                      }
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        if (field.type === "file") {
                          const fileName = event.target.files?.[0]?.name ?? "";
                          handleModalFieldChange(field.name, fileName);
                        } else {
                          handleModalFieldChange(
                            field.name,
                            event.target.value
                          );
                        }
                      }}
                    />
                  ))}
                  <Button onClick={handleModalSubmit}>
                    {modalConfigs[activeModal].cta}
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Document Dialog */}
        <Dialog open={showEditDocDialog} onOpenChange={setShowEditDocDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDoc &&
                  `Edit ${editingDoc.type.toUpperCase()} - ${
                    editingDoc.employeeId
                  }`}
              </DialogTitle>
              <DialogDescription>
                {editingDoc?.currentUrl
                  ? "Replace the current document or download it."
                  : "Upload a new document."}
              </DialogDescription>
            </DialogHeader>
            {editingDoc && (
              <div className="space-y-4">
                {editingDoc.currentUrl && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => {
                        if (editingDoc.currentUrl?.startsWith('data:')) {
                          // Base64 file - use backend route to download
                          const fileUrl = `${API_BASE_URL}/documents/file/${editingDoc.employeeId}/${editingDoc.type}`;
                          const link = document.createElement('a');
                          link.href = fileUrl;
                          link.download = `${editingDoc.type}_${editingDoc.employeeId}.pdf`;
                          link.target = '_blank';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        } else {
                          // File path - download from server
                          const fileUrl = editingDoc.currentUrl.startsWith('/')
                            ? `${API_BASE_URL}${editingDoc.currentUrl}`
                            : `${API_BASE_URL}/uploads/${editingDoc.currentUrl}`;
                          const link = document.createElement('a');
                          link.href = fileUrl;
                          link.download = `${editingDoc.type}_${editingDoc.employeeId}.pdf`;
                          link.target = '_blank';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }
                      }}
                    >
                      <Download className="h-4 w-4" />
                      Download Current Document
                    </Button>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Upload New Document (PDF/DOC)</Label>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      setEditDocFile(e.target.files?.[0] || null)
                    }
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEditDocDialog(false);
                      setEditingDoc(null);
                      setEditDocFile(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      if (!editDocFile && !editingDoc.currentUrl) {
                        toast({
                          variant: "destructive",
                          title: "Error",
                          description: "Please select a file to upload",
                        });
                        return;
                      }

                      try {
                        if (editDocFile) {
                          const formData = new FormData();
                          formData.append("file", editDocFile);
                          formData.append(
                            "name",
                            `${editingDoc.type}_${editingDoc.employeeId}`
                          );
                          formData.append("type", "employee-doc");
                          formData.append("employeeId", editingDoc.employeeId);
                          formData.append("documentType", editingDoc.type);
                          formData.append(
                            "uploadedBy",
                            user?.fullName || "System"
                          );

                          const response = await fetch(
                            `${API_BASE_URL}/documents`,
                            {
                              method: "POST",
                              body: formData,
                            }
                          );

                          if (!response.ok) {
                            throw new Error("Failed to upload document");
                          }

                          toast({
                            title: "Success",
                            description: "Document uploaded successfully",
                          });

                          // Refresh documents
                          await fetchAndProcessDocuments();
                        }

                        setShowEditDocDialog(false);
                        setEditingDoc(null);
                        setEditDocFile(null);
                      } catch (error) {
                        console.error("Error uploading document", error);
                        toast({
                          variant: "destructive",
                          title: "Error",
                          description:
                            "Failed to upload document. Please try again.",
                        });
                      }
                    }}
                  >
                    {editingDoc.currentUrl ? "Replace" : "Upload"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* View Document Dialog */}
        <Dialog open={showViewDocDialog} onOpenChange={setShowViewDocDialog}>
          <DialogContent className="max-w-6xl max-h-[90vh] w-full">
            <DialogHeader>
              <DialogTitle>{viewingDoc?.title || "View Document"}</DialogTitle>
              <DialogDescription>
                View the document in the viewer below
              </DialogDescription>
            </DialogHeader>
            {viewingDoc && (
              <div className="w-full h-[75vh] border rounded-lg overflow-hidden bg-gray-100">
                {viewingDoc.isBase64 ? (
                  // Base64 file - embed directly to avoid CSP issues
                  <object
                    data={viewingDoc.url}
                    type="application/pdf"
                    className="w-full h-full"
                    aria-label={viewingDoc.title}
                  >
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">
                        PDF viewer not supported.{" "}
                        <a
                          href={viewingDoc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Open in new tab
                        </a>
                      </p>
                    </div>
                  </object>
                ) : (
                  // Server file - use iframe
                  <iframe
                    src={viewingDoc.url}
                    className="w-full h-full border-0"
                    title={viewingDoc.title}
                  />
                )}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowViewDocDialog(false);
                  setViewingDoc(null);
                }}
              >
                Close
              </Button>
              {viewingDoc && (
                <Button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = viewingDoc.url;
                    link.download = `${viewingDoc.type}_${viewingDoc.title.split(' - ')[1] || 'document'}.pdf`;
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayoutNew>
  );
};

export default Documents;
