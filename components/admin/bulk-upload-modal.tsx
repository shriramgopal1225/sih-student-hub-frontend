// components/admin/bulk-upload-modal.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { Upload, Download, AlertCircle, CheckCircle, Users } from 'lucide-react';
import { useState } from 'react';
import {
  generateStudentCSVTemplate,
  generateFacultyCSVTemplate,
  downloadCSVTemplate,
  parseCSV,
  validateStudentCSVData,
  validateFacultyCSVData,
  type StudentCSVRow,
  type FacultyCSVRow
} from '@/lib/csv-utils';
import { bulkCreateUsers } from '@/app/(platform)/admin/user-management/actions';

type BulkUploadModalProps = {
  role: 'student' | 'faculty';
};

export function BulkUploadModal({ role }: BulkUploadModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [validData, setValidData] = useState<(StudentCSVRow | FacultyCSVRow)[]>([]);
  const [errors, setErrors] = useState<Array<{ row: number; errors: string[] }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success?: string; error?: string } | null>(null);

  const handleDownloadTemplate = () => {
    const template = role === 'student' 
      ? generateStudentCSVTemplate() 
      : generateFacultyCSVTemplate();
    const filename = `${role}_template.csv`;
    downloadCSVTemplate(template, filename);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    setValidData([]);
    setErrors([]);
    setUploadResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvContent = e.target?.result as string;
      const rows = parseCSV(csvContent);

      if (rows.length < 2) {
        setErrors([{ row: 1, errors: ['CSV file must contain at least one data row'] }]);
        return;
      }

      if (role === 'student') {
        const result = validateStudentCSVData(rows);
        setValidData(result.valid);
        setErrors(result.errors);
      } else {
        const result = validateFacultyCSVData(rows);
        setValidData(result.valid);
        setErrors(result.errors);
      }
    };

    reader.readAsText(file);
  };

  const handleBulkUpload = async () => {
    if (validData.length === 0) return;

    setIsProcessing(true);
    setUploadResult(null);

    try {
      const result = await bulkCreateUsers(validData, role);
      setUploadResult(result);
      
      if (result.success) {
        // Reset form on success
        setCsvFile(null);
        setValidData([]);
        setErrors([]);
        // Close modal after a short delay
        setTimeout(() => setIsOpen(false), 2000);
      }
    } catch (error) {
      setUploadResult({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setCsvFile(null);
    setValidData([]);
    setErrors([]);
    setUploadResult(null);
    setIsProcessing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetModal();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Bulk Upload {role === 'student' ? 'Students' : 'Faculty'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bulk Upload {role === 'student' ? 'Students' : 'Faculty'}
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file to create multiple {role} accounts at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download Section */}
          <div className="space-y-2">
            <Label>Step 1: Download Template</Label>
            <div className="flex items-center gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadTemplate}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download CSV Template
              </Button>
              <span className="text-sm text-muted-foreground">
                Use this template to format your data correctly
              </span>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-2">
            <Label>Step 2: Upload Your CSV File</Label>
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
          </div>

          {/* Validation Results */}
          {csvFile && (validData.length > 0 || errors.length > 0) && (
            <div className="space-y-3">
              <Label>Validation Results</Label>
              
              {validData.length > 0 && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <span className="font-medium">{validData.length} valid records</span> ready to be uploaded
                  </AlertDescription>
                </Alert>
              )}

              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <span className="font-medium">{errors.length} rows have errors:</span>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {errors.slice(0, 5).map((error, index) => (
                          <div key={index} className="text-sm">
                            <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-2">
                              Row {error.row}
                            </span>
                            {error.errors.join(', ')}
                          </div>
                        ))}
                        {errors.length > 5 && (
                          <div className="text-sm text-muted-foreground">
                            ... and {errors.length - 5} more errors
                          </div>
                        )}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <Alert variant={uploadResult.success ? "default" : "destructive"}>
              {uploadResult.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {uploadResult.success || uploadResult.error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleBulkUpload}
            disabled={validData.length === 0 || isProcessing}
            className="gap-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload {validData.length} {role}s
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}