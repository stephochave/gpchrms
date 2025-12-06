-- Add file_201 column to employees table if not exists
ALTER TABLE employees
  ADD COLUMN IF NOT EXISTS file_201 LONGTEXT NULL AFTER service_record_file;
