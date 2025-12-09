import type { RowDataPacket } from 'mysql2';

export interface DbUser extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  employee_id: string | null;
  full_name: string;
  role: 'admin' | 'employee' | 'guard';
  password_hash: string;
  password_reset_required: boolean;
}

export interface DbEmployee extends RowDataPacket {
  id: number;
  employee_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  full_name: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  date_of_birth: string | null;
  address: string | null;
  gender: string | null;
  civil_status: string | null;
  date_hired: string;
  date_of_leaving: string | null;
  employment_type: string;
  role: string | null;
  sss_number: string | null;
  pagibig_number: string | null;
  tin_number: string | null;
  emergency_contact: string | null;
  educational_background: string | null;
  signature_file: string | null;
  pds_file: string | null;
  service_record_file: string | null;
  qr_code_data: string | null;
  qr_code_secret: string | null;
  qr_code_generated_at: string | null;
  password_hash: string | null;
  status: 'active' | 'inactive';
  archived_reason: string | null;
  archived_at: string | null;
  employment_count?: number | null;
  current_employment_period?: number | null;
  created_at: string;
  updated_at: string;
}

export interface DbAttendance extends RowDataPacket {
  id: number;
  employee_id: string;
  employee_name: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'leave';
  notes: string | null;
  qr_verified: boolean;
  verification_method: 'qr' | 'manual' | 'guard_qr';
  late_minutes: number | null;
  undertime_minutes: number | null;
  overtime_minutes: number | null;
  created_at: string;
  updated_at: string;
}

export interface DbLeaveType extends RowDataPacket {
  id: number;
  name: string;
  code: string;
  days_per_year: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbLeaveBalance extends RowDataPacket {
  id: number;
  employee_id: string;
  leave_type_id: number;
  school_year: string;
  total_days: number;
  used_days: number;
  pending_days: number;
  remaining_days: number;
  created_at: string;
  updated_at: string;
}

export interface DbLeaveRequest extends RowDataPacket {
  id: number;
  employee_id: string;
  employee_name: string;
  employee_department: string;
  leave_type_id: number;
  leave_type: 'vacation' | 'sick' | 'emergency' | 'unpaid' | 'other';
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string | null;
  status: 'pending' | 'department_approved' | 'approved' | 'rejected';
  department_head_comment: string | null;
  department_head_approved_by: string | null;
  department_head_approved_at: string | null;
  admin_comment: string | null;
  decided_by: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  appeal_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbCertificateTemplate extends RowDataPacket {
  id: number;
  name: string;
  type: 'active_employment' | 'inactive_employment' | 'service_record' | 'clearance';
  template_content: string;
  variables: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbGeneratedCertificate extends RowDataPacket {
  id: number;
  employee_id: string;
  employee_name: string;
  template_id: number;
  certificate_type: 'active_employment' | 'inactive_employment' | 'service_record' | 'clearance';
  generated_by: string;
  issue_date: string;
  certificate_data: string;
  verification_code: string;
  created_at: string;
}

export interface DbProfileUpdateHistory extends RowDataPacket {
  id: number;
  employee_id: string;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  updated_by: string;
  update_source: 'employee_self' | 'admin' | 'system';
  created_at: string;
}

