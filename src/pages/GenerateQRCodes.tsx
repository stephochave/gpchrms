import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/fetch';
import { Loader2, QrCode, Download, CheckCircle, XCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  department: string;
  position: string;
  status: string;
  qrCodeData: string | null;
}

export default function GenerateQRCodes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [generatingAll, setGeneratingAll] = useState(false);
  const [generationResults, setGenerationResults] = useState<{
    success: string[];
    failed: string[];
  }>({ success: [], failed: [] });

  // Fetch all active employees
  const { data: employeesData, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await apiFetch(`${API_BASE_URL}/employees`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch employees');
      const result = await response.json();
      return result.data || result; // Handle both {data: [...]} and [...] formats
    },
  });

  const employees = (employeesData || []) as Employee[];

  // Generate QR for single employee
  const generateQRMutation = useMutation({
    mutationFn: async (employeeId: number) => {
      const response = await apiFetch(`${API_BASE_URL}/employees/${employeeId}/generate-qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ generatedBy: 'Admin' }),
      });
      if (!response.ok) throw new Error('Failed to generate QR code');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  // Generate QR codes for all employees
  const generateAllQRCodes = async () => {
    if (!employees) return;

    setGeneratingAll(true);
    setGenerationResults({ success: [], failed: [] });

    const activeEmployees = employees.filter(emp => emp.status === 'active');
    const results = { success: [] as string[], failed: [] as string[] };

    for (const employee of activeEmployees) {
      try {
        await generateQRMutation.mutateAsync(employee.id);
        results.success.push(employee.fullName);
      } catch (error) {
        results.failed.push(employee.fullName);
      }
    }

    setGenerationResults(results);
    setGeneratingAll(false);

    toast({
      title: 'QR Code Generation Complete',
      description: `Success: ${results.success.length}, Failed: ${results.failed.length}`,
    });
  };

  // Download single QR code
  const downloadQRCode = (employeeId: string, fullName: string) => {
    const svg = document.getElementById(`qr-${employeeId}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      ctx?.drawImage(img, 0, 0, 300, 300);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `QR-${employeeId}-${fullName}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const activeEmployees = employees?.filter(emp => emp.status === 'active') || [];
  const employeesWithQR = activeEmployees.filter(emp => emp.qrCodeData);
  const employeesWithoutQR = activeEmployees.filter(emp => !emp.qrCodeData);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">QR Code Management</h1>
          <p className="text-muted-foreground">Generate and manage employee QR codes</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Active Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEmployees.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">With QR Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{employeesWithQR.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Without QR Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{employeesWithoutQR.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Generation */}
      {employeesWithoutQR.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Bulk QR Code Generation</CardTitle>
            <CardDescription>
              Generate QR codes for all employees who don't have one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={generateAllQRCodes}
              disabled={generatingAll}
              size="lg"
              className="w-full md:w-auto"
            >
              {generatingAll ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating QR Codes...
                </>
              ) : (
                <>
                  <QrCode className="mr-2 h-4 w-4" />
                  Generate QR Codes for {employeesWithoutQR.length} Employees
                </>
              )}
            </Button>

            {/* Generation Results */}
            {(generationResults.success.length > 0 || generationResults.failed.length > 0) && (
              <div className="mt-4 space-y-2">
                {generationResults.success.length > 0 && (
                  <div className="flex items-start gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mt-0.5" />
                    <div>
                      <div className="font-medium">Successfully generated ({generationResults.success.length}):</div>
                      <div className="text-xs">{generationResults.success.join(', ')}</div>
                    </div>
                  </div>
                )}
                {generationResults.failed.length > 0 && (
                  <div className="flex items-start gap-2 text-sm text-red-600">
                    <XCircle className="h-4 w-4 mt-0.5" />
                    <div>
                      <div className="font-medium">Failed ({generationResults.failed.length}):</div>
                      <div className="text-xs">{generationResults.failed.join(', ')}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Employee List with QR Codes */}
      <Card>
        <CardHeader>
          <CardTitle>Employee QR Codes</CardTitle>
          <CardDescription>View and download employee QR codes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeEmployees.map((employee) => (
              <Card key={employee.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{employee.fullName}</CardTitle>
                  <CardDescription className="text-xs">
                    {employee.employeeId} • {employee.position}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {employee.qrCodeData ? (
                    <>
                      <div className="flex justify-center bg-white p-4 rounded-lg">
                        <QRCodeSVG
                          id={`qr-${employee.employeeId}`}
                          value={employee.qrCodeData}
                          size={150}
                          level="H"
                          includeMargin
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => downloadQRCode(employee.employeeId, employee.fullName)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download QR
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center h-[150px] bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">No QR Code</p>
                      </div>
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => generateQRMutation.mutate(employee.id)}
                        disabled={generateQRMutation.isPending}
                      >
                        {generateQRMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <QrCode className="mr-2 h-4 w-4" />
                            Generate QR
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
