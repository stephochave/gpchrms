import { useEffect, useState } from 'react';
import DashboardLayoutNew from '@/components/Layout/DashboardLayoutNew';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Clock, QrCode } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/fetch';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label className="text-sm text-muted-foreground uppercase tracking-widest">{label}</Label>
    {children}
  </div>
);

const AddAttendance = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [status, setStatus] = useState<'present' | 'absent' | 'late' | 'half-day' | 'leave'>('present');
  const [notes, setNotes] = useState('');
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(false);
  const [minutesLate, setMinutesLate] = useState(0);
  const { toast } = useToast();

  // Fetch employee name when employee ID is entered
  useEffect(() => {
    const fetchEmployeeName = async () => {
      if (!employeeId.trim()) {
        setEmployeeName('');
        return;
      }

      try {
        setIsLoadingEmployee(true);
        const response = await apiFetch(`${API_BASE_URL}/employees?employeeId=${employeeId}`);
        
        if (!response.ok) {
          setEmployeeName('');
          return;
        }

        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setEmployeeName(data.data[0].fullName || '');
        } else {
          setEmployeeName('');
          toast({
            variant: 'destructive',
            title: 'Employee not found',
            description: 'No employee found with this ID.',
          });
        }
      } catch (error) {
        console.error('Error fetching employee', error);
        setEmployeeName('');
      } finally {
        setIsLoadingEmployee(false);
      }
    };

    const timeoutId = setTimeout(fetchEmployeeName, 500);
    return () => clearTimeout(timeoutId);
  }, [employeeId, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!employeeId.trim() || !employeeName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Employee ID and name are required.',
      });
      return;
    }

    // Check current time - attendance only allowed until 7:00 PM
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const cutoffHour = 19; // 7:00 PM
    const cutoffMinute = 0;
    
    if (currentHour > cutoffHour || (currentHour === cutoffHour && currentMinute > cutoffMinute)) {
      toast({
        variant: 'destructive',
        title: 'Attendance Closed',
        description: 'Attendance can only be recorded until 7:00 PM.',
      });
      return;
    }

    // Auto-detect late status and calculate late minutes
    let finalStatus = status;
    let calculatedLateMinutes = 0;

    if (checkIn && (status === 'present' || status === 'late')) {
      try {
        const [hours, minutes] = checkIn.split(':').map(Number);
        const checkInMinutes = hours * 60 + minutes;
        const expectedMinutes = 8 * 60 + 11; // 8:11 AM
        
        calculatedLateMinutes = checkInMinutes - expectedMinutes;
        
        if (calculatedLateMinutes > 0) {
          finalStatus = 'late';
          setMinutesLate(calculatedLateMinutes);
        }
      } catch (error) {
        console.error('Error calculating late minutes:', error);
      }
    }

    const payload = {
      employeeId: employeeId.trim().toUpperCase(),
      employeeName: employeeName.trim(),
      date,
      checkIn: checkIn || null,
      checkOut: checkOut || null,
      status: finalStatus,
      notes: notes.trim() || null,
      qrVerified: false,
      verificationMethod: 'manual',
      lateMinutes: calculatedLateMinutes > 0 ? calculatedLateMinutes : null,
      undertimeMinutes: null,
      overtimeMinutes: null,
    };

    try {
      const response = await apiFetch(`${API_BASE_URL}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add attendance');
      }

      toast({
        title: 'Success',
        description: `Attendance recorded for ${employeeName}${calculatedLateMinutes > 0 ? ` (${calculatedLateMinutes} minutes late)` : ''}`,
      });

      // Reset form
      setEmployeeId('');
      setEmployeeName('');
      setDate(new Date().toISOString().split('T')[0]);
      setCheckIn('');
      setCheckOut('');
      setStatus('present');
      setNotes('');
      setMinutesLate(0);
    } catch (error) {
      console.error('Error adding attendance', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Unable to add attendance record. Please try again.',
      });
    }
  };

  // Check if attendance is still allowed (before 7:00 PM)
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const cutoffHour = 19;
  const cutoffMinute = 0;
  const isAttendanceClosed = currentHour > cutoffHour || (currentHour === cutoffHour && currentMinute > cutoffMinute);

  return (
    <DashboardLayoutNew>
      <Card className="p-6 shadow-lg border-border/70">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Add Attendance</h2>
          {isAttendanceClosed && (
            <Badge variant="destructive" className="px-3 py-1">
              Attendance Closed (After 7:00 PM)
            </Badge>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Employee ID">
              <Input
                placeholder="Example: 25-GPC-12345"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                className="h-12 rounded-xl"
                required
                
              />
              {employeeName && (
                <p className="text-sm text-green-600 font-medium">
                   {employeeName}
                </p>
              )}
            </Field>

            <Field label="Date">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </Field>

            <Field label="Check In Time">
              <Input
                type="time"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="h-12 rounded-xl"
              />
            </Field>

            <Field label="Check Out Time">
              <Input
                type="time"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="h-12 rounded-xl"
              />
            </Field>

            <Field label="Status">
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="half-day">Half Day</SelectItem>
                  <SelectItem value="leave">Leave</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Notes (Optional)">
              <Input
                placeholder="Additional notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-12 rounded-xl"
              />
            </Field>
          </div>

          {minutesLate > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <Clock className="inline w-4 h-4 mr-1" />
                <strong>Late Check-In:</strong> Employee is {minutesLate} minute{minutesLate !== 1 ? 's' : ''} late.
              </p>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              <strong>Tip:</strong> For faster attendance, use QR code scanning from Guard Dashboard or Employee Dashboard.
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              className="rounded-full px-8"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="rounded-full px-8"
              disabled={isAttendanceClosed || !employeeName}
            >
              Submit Attendance
            </Button>
          </div>
        </form>
      </Card>
    </DashboardLayoutNew>
  );
};

export default AddAttendance;
