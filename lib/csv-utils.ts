// lib/csv-utils.ts

export type StudentCSVRow = {
  full_name: string;
  email: string;
  password: string;
  enrollment_no: string;
  course: string;
  year: number;
  gpa?: number;
  cgpa?: number;
};

export type FacultyCSVRow = {
  full_name: string;
  email: string;
  password: string;
  department: string;
  designation: string;
};

// Generate CSV template for students
export function generateStudentCSVTemplate(): string {
  const headers = ['full_name', 'email', 'password', 'enrollment_no', 'course', 'year', 'gpa', 'cgpa'];
  
  return headers.join(',');
}

// Generate CSV template for faculty
export function generateFacultyCSVTemplate(): string {
  const headers = ['full_name', 'email', 'password', 'department', 'designation'];
  
  return headers.join(',');
}

// Download CSV template file
export function downloadCSVTemplate(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Parse CSV content into rows
export function parseCSV(csvContent: string): string[][] {
  const lines = csvContent.trim().split('\n');
  return lines.map(line => {
    // Simple CSV parsing - handles basic cases
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  });
}

// Validate student CSV data
export function validateStudentCSVData(rows: string[][]): {
  valid: StudentCSVRow[];
  errors: Array<{ row: number; errors: string[] }>;
} {
  const valid: StudentCSVRow[] = [];
  const errors: Array<{ row: number; errors: string[] }> = [];
  
  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rowErrors: string[] = [];
    
    if (row.length < 6) {
      rowErrors.push('Missing required columns');
      errors.push({ row: i + 1, errors: rowErrors });
      continue;
    }
    
    const [full_name, email, password, enrollment_no, course, yearStr, gpaStr, cgpaStr] = row;
    
    // Validate required fields
    if (!full_name?.trim()) rowErrors.push('Full name is required');
    if (!email?.trim()) rowErrors.push('Email is required');
    if (!password?.trim()) rowErrors.push('Password is required');
    if (!enrollment_no?.trim()) rowErrors.push('Enrollment number is required');
    if (!course?.trim()) rowErrors.push('Course is required');
    if (!yearStr?.trim()) rowErrors.push('Year is required');
    
    // Validate email format
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      rowErrors.push('Invalid email format');
    }
    
    // Validate year
    const year = parseInt(yearStr);
    if (isNaN(year) || year < 1 || year > 6) {
      rowErrors.push('Year must be between 1 and 6');
    }
    
    // Validate optional GPA/CGPA
    let gpa: number | undefined;
    let cgpa: number | undefined;
    
    if (gpaStr?.trim()) {
      gpa = parseFloat(gpaStr);
      if (isNaN(gpa) || gpa < 0 || gpa > 10) {
        rowErrors.push('GPA must be between 0 and 10');
      }
    }
    
    if (cgpaStr?.trim()) {
      cgpa = parseFloat(cgpaStr);
      if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
        rowErrors.push('CGPA must be between 0 and 10');
      }
    }
    
    if (rowErrors.length > 0) {
      errors.push({ row: i + 1, errors: rowErrors });
    } else {
      valid.push({
        full_name: full_name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        enrollment_no: enrollment_no.trim(),
        course: course.trim(),
        year,
        gpa,
        cgpa
      });
    }
  }
  
  return { valid, errors };
}

// Validate faculty CSV data
export function validateFacultyCSVData(rows: string[][]): {
  valid: FacultyCSVRow[];
  errors: Array<{ row: number; errors: string[] }>;
} {
  const valid: FacultyCSVRow[] = [];
  const errors: Array<{ row: number; errors: string[] }> = [];
  
  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rowErrors: string[] = [];
    
    if (row.length < 5) {
      rowErrors.push('Missing required columns');
      errors.push({ row: i + 1, errors: rowErrors });
      continue;
    }
    
    const [full_name, email, password, department, designation] = row;
    
    // Validate required fields
    if (!full_name?.trim()) rowErrors.push('Full name is required');
    if (!email?.trim()) rowErrors.push('Email is required');
    if (!password?.trim()) rowErrors.push('Password is required');
    if (!department?.trim()) rowErrors.push('Department is required');
    if (!designation?.trim()) rowErrors.push('Designation is required');
    
    // Validate email format
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      rowErrors.push('Invalid email format');
    }
    
    if (rowErrors.length > 0) {
      errors.push({ row: i + 1, errors: rowErrors });
    } else {
      valid.push({
        full_name: full_name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        department: department.trim(),
        designation: designation.trim()
      });
    }
  }
  
  return { valid, errors };
}