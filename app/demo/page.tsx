// app/demo/page.tsx
'use client';

import { BulkUploadModal } from '@/components/admin/bulk-upload-modal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CSV Template Test
          </h1>
          <p className="text-gray-600">
            Testing empty CSV templates (headers only)
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Template Test</CardTitle>
              <CardDescription>
                Should download CSV with headers only
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BulkUploadModal role="student" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Faculty Template Test</CardTitle>
              <CardDescription>
                Should download CSV with headers only
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BulkUploadModal role="faculty" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}