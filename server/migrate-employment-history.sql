-- Create employment_history table to track multiple employment periods
CREATE TABLE IF NOT EXISTS employment_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(20) NOT NULL,
  employment_period INT NOT NULL DEFAULT 1,
  date_hired DATE NOT NULL,
  date_ended DATE,
  employment_type VARCHAR(50),
  department VARCHAR(255),
  position VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
  UNIQUE KEY unique_employment_period (employee_id, employment_period),
  INDEX idx_employee_id (employee_id),
  INDEX idx_dates (date_hired, date_ended)
);

-- Add employment_count column to employees table if it doesn't exist
ALTER TABLE employees ADD COLUMN IF NOT EXISTS employment_count INT DEFAULT 1;

-- Add current_employment_period column to employees table if it doesn't exist
ALTER TABLE employees ADD COLUMN IF NOT EXISTS current_employment_period INT DEFAULT 1;
