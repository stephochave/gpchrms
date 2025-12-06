export type DocumentNavKey =
  | "documents"
  | "templates"
  | "employeeReports"
  | "attendanceReports";

export type DocumentFolderKey = "pds" | "sr" | "coe" | "contract";

export const documentNavCards: Array<{
  key: DocumentNavKey;
  title: string;
  subtitle: string;
}> = [
  { key: "employeeReports", title: "Employee Reports", subtitle: "Generate" },
];

export const documentFolders: Array<{
  key: DocumentFolderKey;
  title: string;
  description: string;
}> = [
  { key: "pds", title: "Personal Data Sheet", description: "View or upload" },
  { key: "sr", title: "Service Records", description: "Archive history" },
  {
    key: "coe",
    title: "Certificate of Employment",
    description: "Issue certificates",
  },
  {
    key: "contract",
    title: "Contract of Employment",
    description: "Manage contracts",
  },
];



