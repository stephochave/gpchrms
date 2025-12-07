import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRScanner } from '@/components/QRScanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, Clock, LogOut, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { apiFetch } from '@/lib/fetch';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface ScanResult {
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  timestamp: Date;
  status: 'success' | 'error';
  message?: string;
}

export default function GuardDashboard() {
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleQRScan = async (qrToken: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    const scanTime = new Date();

    try {
      // Verify QR code
      const verifyResponse = await apiFetch(`${API_BASE_URL}/attendance/verify-qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          qrToken,
          scannedBy: 'Guard'
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData.message || 'QR verification failed');
      }

      // Mark attendance
      const today = format(new Date(), 'yyyy-MM-dd');
      const currentTime = format(new Date(), 'HH:mm');

      const attendanceResponse = await apiFetch(`${API_BASE_URL}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: verifyData.employee.employeeId,
          employeeName: verifyData.employee.employeeName,
          date: today,
          checkIn: currentTime,
          status: 'present',
          qrVerified: true,
          verificationMethod: 'guard_qr',
          notes: 'Scanned by guard',
        }),
      });

      if (!attendanceResponse.ok) {
        const errorData = await attendanceResponse.json();
        throw new Error(errorData.message || 'Failed to mark attendance');
      }

      // Success
      const scanResult: ScanResult = {
        employeeId: verifyData.employee.employeeId,
        employeeName: verifyData.employee.employeeName,
        department: verifyData.employee.department,
        position: verifyData.employee.position,
        timestamp: scanTime,
        status: 'success',
      };

      setScanHistory(prev => [scanResult, ...prev.slice(0, 19)]); // Keep last 20 scans

      toast({
        title: 'Attendance Recorded',
        description: `${verifyData.employee.employeeName} checked in successfully at ${currentTime}`,
        duration: 3000,
      });

    } catch (error: any) {
      const errorResult: ScanResult = {
        employeeId: '',
        employeeName: 'Unknown',
        department: '',
        position: '',
        timestamp: scanTime,
        status: 'error',
        message: error.message || 'QR scan failed',
      };

      setScanHistory(prev => [errorResult, ...prev.slice(0, 19)]);

      toast({
        title: 'Scan Failed',
        description: error.message || 'Unable to process QR code',
        variant: 'destructive',
        duration: 4000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hrms_token');
    localStorage.removeItem('hrms_user');
    navigate('/login');
  };

  const todayScans = scanHistory.filter(scan => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const scanDate = format(scan.timestamp, 'yyyy-MM-dd');
    return scanDate === today;
  });

  const todaySuccessCount = todayScans.filter(s => s.status === 'success').length;
  const todayErrorCount = todayScans.filter(s => s.status === 'error').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Guard Attendance Station</h1>
            <p className="text-gray-600 mt-1">Scan employee QR codes to mark attendance</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Today's Check-ins</p>
                  <p className="text-2xl font-bold text-green-600">{todaySuccessCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Failed Scans</p>
                  <p className="text-2xl font-bold text-red-600">{todayErrorCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Time</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {format(new Date(), 'HH:mm')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Scanner */}
          <div className="lg:sticky lg:top-4 h-fit">
            <QRScanner
              onScan={handleQRScan}
              onError={(error) => {
                toast({
                  title: 'Scanner Error',
                  description: error,
                  variant: 'destructive',
                });
              }}
              title="Scan Employee QR Code"
              description="Position the employee's QR code within the camera frame"
            />
            {isProcessing && (
              <Alert className="mt-4">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <AlertDescription>Processing QR code...</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Scan History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Scans</CardTitle>
              <CardDescription>Last 20 scan attempts (today highlighted)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {scanHistory.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No scans yet. Start scanning employee QR codes.
                  </p>
                ) : (
                  scanHistory.map((scan, index) => {
                    const isToday = format(scan.timestamp, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          isToday ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {scan.status === 'success' ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                              )}
                              <span className="font-semibold text-gray-900">
                                {scan.employeeName}
                              </span>
                            </div>
                            {scan.status === 'success' ? (
                              <>
                                <p className="text-sm text-gray-600">
                                  {scan.employeeId} • {scan.department}
                                </p>
                                <p className="text-xs text-gray-500">{scan.position}</p>
                              </>
                            ) : (
                              <p className="text-sm text-red-600">{scan.message}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <Badge variant={scan.status === 'success' ? 'default' : 'destructive'}>
                              {scan.status}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              {format(scan.timestamp, 'HH:mm:ss')}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              {scanHistory.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setScanHistory([])}
                    >
                      Clear History
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
