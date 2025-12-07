import { ChangeEvent, useState, useEffect } from "react";
import DashboardLayoutNew from "@/components/Layout/DashboardLayoutNew";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Folder, Edit, FileText, Download, XCircle, XIcon, File } from "lucide-react";
import { apiFetch } from '@/lib/fetch';
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
import { title } from "process";

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
  const [formerSearchTerm, setFormerSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<SelectedFolder>(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [activeModal, setActiveModal] = useState<DocumentNavKey | null>(null);
  const [modalForm, setModalForm] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<Document[]>([]);
  const [formerDocuments, setFormerDocuments] = useState<Document[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [formerEmployees, setFormerEmployees] = useState<any[]>([]);
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

  // Helper function to process employee documents
  const processEmployeeDocuments = (employeesData: any[], documentsData: any[]) => {
    const employeeMap = new Map(
      employeesData.map((emp: any) => [emp.employeeId, emp])
    );

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

    // Then, add/update with documents from documents table
    documentsData.forEach((doc: any) => {
      if (doc.employeeId && employeeMap.has(doc.employeeId)) {
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
          doc.name.toLowerCase().includes("sr") ||
          doc.name.toLowerCase().includes("service")
        ) {
          empDoc.sr = doc.fileUrl;
        } else if (
          docType === "coe" ||
          doc.name.toLowerCase().includes("coe") ||
          doc.name.toLowerCase().includes("certificate")
        ) {
          empDoc.coe = doc.fileUrl;
        }
      }
    });

    return Array.from(employeeDocs.values());
  };

  // Helper function to fetch and process documents
  const fetchAndProcessDocuments = async () => {
    try {
      const [documentsRes, activeEmployeesRes, inactiveEmployeesRes] = await Promise.all([
        apiFetch(`${API_BASE_URL}/documents?type=employee-doc`),
        apiFetch(`${API_BASE_URL}/employees?status=active`),
        apiFetch(`${API_BASE_URL}/employees?status=inactive`),
      ]);

      if (!documentsRes.ok) {
        throw new Error("Failed to fetch documents");
      }

      const documentsData = await documentsRes.json();
      let activeEmployeesData: any[] = [];
      let inactiveEmployeesData: any[] = [];

      if (activeEmployeesRes.ok) {
        const empData = await activeEmployeesRes.json();
        activeEmployeesData = empData.data || [];
        setEmployees(activeEmployeesData);
      }

      if (inactiveEmployeesRes.ok) {
        const empData = await inactiveEmployeesRes.json();
        inactiveEmployeesData = empData.data || [];
        setFormerEmployees(inactiveEmployeesData);
      }

      // Process active employee documents
      const activeDocuments = processEmployeeDocuments(activeEmployeesData, documentsData.data || []);
      setDocuments(activeDocuments);

      // Process inactive/former employee documents
      const formerDocs = processEmployeeDocuments(inactiveEmployeesData, documentsData.data || []);
      setFormerDocuments(formerDocs);
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

        const response = await apiFetch(`${API_BASE_URL}/documents`, {
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
  const filteredDocs = documents.filter((doc) =>
    [doc.name, doc.employeeId, doc.pds, doc.sr, doc.coe].some((value) =>
      value?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredFormerDocs = formerDocuments.filter((doc) =>
    [doc.name, doc.employeeId, doc.pds, doc.sr, doc.coe].some((value) =>
      value?.toLowerCase().includes(formerSearchTerm.toLowerCase())
    )
  );

  // Validate document URL
  const validateDocumentUrl = (url: string | null): boolean => {
    if (!url) return false;
    if (url === `${API_BASE_URL}/`) return false;
    if (url === API_BASE_URL) return false;
    if (url.trim() === '') return false;
    return true;
  };

  return (
    <DashboardLayoutNew>
      <div className="space-y-6">
        {/* Generate Employee Documents */}
        <Card className="p-6 border-dashed border-primary/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">
                Generate Employee Documents
              </h3>
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
                key: "sr" as DocumentTemplateKey,
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
                            "Please type an employee ID before generating a document.",
                        });
                        return;
                      }
                      setIsGeneratingDocument(true);
                      setActiveTemplateKey(template.key);
                      try {
                        const response = await apiFetch(
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
                          description: `${template.label} generated for ${employee.fullName}.`,
                        });
                      } catch (error) {
                        console.error("Document generation failed", error);
                        toast({
                          variant: "destructive",
                          title: "Generation failed",
                          description:
                            "Unable to generate the selected document. Please try again.",
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
                    {isActive && isGeneratingDocument
                      ? "Generating…"
                      : "Generate"}
                  </Button>
                </Card>
              );
            })}
          </div>
        </Card>

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

        <Card className="shadow-sm border-border">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl">Active Employee Documents</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search active employees..."
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
                        className="py-12 text-center text-muted-foreground"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          <span>Loading documents...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredDocs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No documents found
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
                                onClick={async () => {
                                  if (!doc.pds || !validateDocumentUrl(doc.pds)) {
                                    toast({
                                      variant: "destructive",
                                      title: "Error",
                                      description: "No document file available or invalid URL.",
                                    });
                                    return;
                                  }

                                  const isBase64 = doc.pds.startsWith('data:');
                                  let fileUrl: string;

                                  if (isBase64) {
                                    fileUrl = doc.pds;
                                  } else {
                                    // Always use the backend route to serve the file
                                    // This ensures proper headers and CORS handling
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
                                <File className="h-3 w-3" />
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 hover:underline h-auto p-1"
                                onClick={() => {
                                  // Open edit dialog for PDS
                                  setEditingDoc({
                                    employeeId: doc.employeeId,
                                    type: "pds",
                                    currentUrl: doc.pds,
                                  });
                                  setShowEditDocDialog(true);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                                Edit
                              </Button>
                              {/* <Button
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
                                Edit
                              </Button> */}
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
                                onClick={async () => {
                                  if (!doc.sr || !validateDocumentUrl(doc.sr)) {
                                    toast({
                                      variant: "destructive",
                                      title: "Error",
                                      description: "No document file available or invalid URL.",
                                    });
                                    return;
                                  }

                                  const isBase64 = doc.sr.startsWith('data:');
                                  let fileUrl: string;

                                  if (isBase64) {
                                    fileUrl = doc.sr;
                                  } else {
                                    // Always use the backend route to serve the file
                                    // This ensures proper headers and CORS handling
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
                                <File className="h-3 w-3" />
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 hover:underline h-auto p-1"
                                onClick={() => {
                                  // Open edit dialog for PDS
                                  setEditingDoc({
                                    employeeId: doc.employeeId,
                                    type: "sr",
                                    currentUrl: doc.sr,
                                  });
                                  setShowEditDocDialog(true);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                                Edit
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
                                onClick={async () => {
                                  if (!doc.coe || !validateDocumentUrl(doc.coe)) {
                                    toast({
                                      variant: "destructive",
                                      title: "Error",
                                      description: "No document file available or invalid URL.",
                                    });
                                    return;
                                  }

                                  const isBase64 = doc.coe.startsWith('data:');
                                  let fileUrl: string;

                                  if (isBase64) {
                                    fileUrl = doc.coe;
                                  } else {
                                    // Always use the backend route to serve the file
                                    // This ensures proper headers and CORS handling
                                    fileUrl = `${API_BASE_URL}/documents/file/${doc.employeeId}/coe`;
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
                                <File className="h-3 w-3" />
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 hover:underline h-auto p-1"
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
                                Edit
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

        {/* Former Employee Documents Section */}
        <Card className="shadow-sm border-border">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl">Former Employee Documents</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search former employees..."
                value={formerSearchTerm}
                onChange={(e) => setFormerSearchTerm(e.target.value)}
                className="pl-9 rounded-full"
              />
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-600 text-white">
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
                      Certificate of Employment
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
                  ) : filteredFormerDocs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No former employee documents found
                      </td>
                    </tr>
                  ) : (
                    filteredFormerDocs.map((doc, idx) => (
                      <tr
                        key={doc.id || idx}
                        className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}
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
                                  if (!doc.pds || !validateDocumentUrl(doc.pds)) return;
                                  const isBase64 = doc.pds.startsWith('data:');
                                  let fileUrl: string;
                                  if (isBase64) {
                                    fileUrl = doc.pds;
                                  } else if (doc.pds.startsWith('/uploads/')) {
                                    fileUrl = `${API_BASE_URL}${doc.pds}`;
                                  } else if (doc.pds.startsWith('http')) {
                                    fileUrl = doc.pds;
                                  } else if (doc.employeeId) {
                                    fileUrl = `${API_BASE_URL}/documents/file/${doc.employeeId}/pds`;
                                  } else {
                                    return;
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
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">No file</span>
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
                                  if (!doc.sr || !validateDocumentUrl(doc.sr)) return;
                                  const isBase64 = doc.sr.startsWith('data:');
                                  let fileUrl: string;
                                  if (isBase64) {
                                    fileUrl = doc.sr;
                                  } else if (doc.sr.startsWith('/uploads/')) {
                                    fileUrl = `${API_BASE_URL}${doc.sr}`;
                                  } else if (doc.sr.startsWith('http')) {
                                    fileUrl = doc.sr;
                                  } else if (doc.employeeId) {
                                    fileUrl = `${API_BASE_URL}/documents/file/${doc.employeeId}/sr`;
                                  } else {
                                    return;
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
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">No file</span>
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
                                  if (!doc.coe || !validateDocumentUrl(doc.coe)) return;
                                  const isBase64 = doc.coe.startsWith('data:');
                                  let fileUrl: string;
                                  if (isBase64) {
                                    fileUrl = doc.coe;
                                  } else if (doc.coe.startsWith('/uploads/')) {
                                    fileUrl = `${API_BASE_URL}${doc.coe}`;
                                  } else if (doc.coe.startsWith('http')) {
                                    fileUrl = doc.coe;
                                  } else if (doc.employeeId) {
                                    fileUrl = `${API_BASE_URL}/documents/file/${doc.employeeId}/coe`;
                                  } else {
                                    return;
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
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">No file</span>
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
                  `Edit ${editingDoc.type.toUpperCase()} - ${editingDoc.employeeId
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
                      onClick={async () => {
                        try {
                          // Always use backend route for proper file serving
                          const fileUrl = `${API_BASE_URL}/documents/file/${editingDoc.employeeId}/${editingDoc.type}`;

                          // Open in new tab for download
                          window.open(fileUrl, '_blank');

                          toast({
                            title: "Download started",
                            description: "Opening document in new tab",
                          });
                        } catch (error) {
                          console.error("Error downloading document", error);
                          toast({
                            variant: "destructive",
                            title: "Error",
                            description: "Failed to download document",
                          });
                        }
                      }}
                    >

                      <Download className="h-4 w-4" />
                      Download Current
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={async () => {
                        if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
                          return;
                        }

                        try {
                          const response = await apiFetch(
                            `${API_BASE_URL}/documents/employee/${editingDoc.employeeId}/${editingDoc.type}`,
                            {
                              method: 'DELETE',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ deletedBy: user?.fullName || 'Admin' }),
                            }
                          );

                          if (!response.ok) {
                            const errorData = await response.json().catch(() => ({}));
                            throw new Error(errorData.message || 'Failed to delete document');
                          }

                          toast({
                            title: "Success",
                            description: "Document has been deleted",
                          });

                          // Refresh documents and close dialog
                          await fetchAndProcessDocuments();
                          setShowEditDocDialog(false);
                          setEditingDoc(null);
                          setEditDocFile(null);
                        } catch (error) {
                          console.error("Error deleting document", error);
                          toast({
                            variant: "destructive",
                            title: "Error",
                            description: error instanceof Error ? error.message : "Failed to delete document",
                          });
                        }
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                      Delete Current
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

                          // Check if document exists in documents table
                          let existingDocId: string | null = null;
                          if (editingDoc.currentUrl) {
                            try {
                              const checkResponse = await apiFetch(
                                `${API_BASE_URL}/documents?employeeId=${editingDoc.employeeId}&documentType=${editingDoc.type}&type=employee-doc`
                              );
                              if (checkResponse.ok) {
                                const checkData = await checkResponse.json();
                                if (checkData.data && checkData.data.length > 0) {
                                  existingDocId = checkData.data[0].id;
                                }
                              }
                            } catch (checkError) {
                              console.error("Error checking existing document", checkError);
                            }
                          }

                          // Use PUT if document exists, POST if it doesn't
                          const method = existingDocId ? "PUT" : "POST";
                          const url = existingDocId
                            ? `${API_BASE_URL}/documents/${existingDocId}`
                            : `${API_BASE_URL}/documents`;

                          const response = await apiFetch(url, {
                            method: method,
                            body: formData,
                          });

                          if (!response.ok) {
                            const errorData = await response.json().catch(() => ({}));
                            throw new Error(errorData.message || "Failed to upload document");
                          }

                          toast({
                            title: "Success",
                            description: existingDocId
                              ? "Document replaced successfully"
                              : "Document uploaded successfully",
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
                            error instanceof Error
                              ? error.message
                              : "Failed to upload document. Please try again.",
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
            {viewingDoc && viewingDoc.url && viewingDoc.url !== `${API_BASE_URL}/` && viewingDoc.url !== API_BASE_URL ? (
              <div className="w-full h-[75vh] border rounded-lg overflow-hidden bg-gray-100 relative">
                {viewingDoc.isBase64 ? (
                  // Base64 file - embed directly to avoid CSP issues
                  <object
                    data={viewingDoc.url}
                    type="application/pdf"
                    className="w-full h-full"
                    aria-label={viewingDoc.title}
                  >
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                      <p className="text-muted-foreground text-center">
                        PDF viewer not supported in this browser.
                      </p>
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
                        Download PDF
                      </Button>
                    </div>
                  </object>
                ) : viewingDoc.url.toLowerCase().endsWith('.pdf') ? (
                  // PDF file - use iframe for preview
                  <>
                    <iframe
                      src={viewingDoc.url}
                      className="w-full h-full border-0"
                      title={viewingDoc.title}
                      onError={() => {
                        toast({
                          variant: "destructive",
                          title: "Error",
                          description: "Failed to load document. Please try downloading instead.",
                        });
                      }}
                    />
                    <div className="absolute bottom-4 right-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          window.open(viewingDoc.url, '_blank');
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download c
                      </Button>
                    </div>
                  </>
                ) : (
                  // Non-PDF file (DOC, DOCX, etc.) - use Google Docs Viewer for preview
                  <div className="w-full h-full relative">
                    <iframe
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(viewingDoc.url)}&embedded=true`}
                      className="w-full h-full border-0"
                      title={viewingDoc.title}
                      onError={() => {
                        toast({
                          variant: "destructive",
                          title: "Preview Failed",
                          description: "Unable to preview this document. Please download it instead.",
                        });
                      }}
                    />
                    {/* <div className="absolute bottom-4 right-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white"
                        onClick={() => {
                          try {
                          // Always use backend route for proper file serving
                          const fileUrl = `${API_BASE_URL}/documents/file/${editingDoc.employeeId}/${editingDoc.type}`;
                          
                          // Open in new tab for download
                          window.open(fileUrl, '_blank');
                          
                          toast({
                            title: "Download started",
                            description: "Opening document in new tab",
                          });
                        } catch (error) {
                          console.error("Error downloading document", error);
                          toast({
                            variant: "destructive",
                            title: "Error",
                            description: "Failed to download document",
                          });
                        }
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download a
                      </Button>
                    </div> */}
                  </div>
                )}
              </div>
            ) : viewingDoc ? (
              <div className="w-full h-[75vh] border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">Document URL is invalid or missing.</p>
                  <p className="text-sm text-muted-foreground">Please contact administrator or try uploading the document again.</p>
                </div>
              </div>
            ) : null}
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
                    try {
                      // Use the viewingDoc URL directly, or construct from type if needed
                      let downloadUrl = viewingDoc.url;
                      
                      // If it's not a base64 URL and doesn't look like a full URL, 
                      // ensure it's the backend route
                      if (!viewingDoc.isBase64 && !downloadUrl.startsWith('http')) {
                        // Extract employeeId from title (format: "Document Type - EmployeeId")
                        const employeeId = viewingDoc.title.split(' - ')[1];
                        if (employeeId) {
                          downloadUrl = `${API_BASE_URL}/documents/file/${employeeId}/${viewingDoc.type}`;
                        }
                      }

                      // Open in new tab for download
                      window.open(downloadUrl, '_blank');

                      toast({
                        title: "Download started",
                        description: "Opening document in new tab",
                      });
                    } catch (error) {
                      console.error("Error downloading document", error);
                      toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to download document",
                      });
                    }
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download b
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
