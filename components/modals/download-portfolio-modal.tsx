// components/modals/download-portfolio-modal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from '@/lib/supabase/client';
import { Download } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { PortfolioTemplate } from '@/components/portfolio/portfolio-template';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

type Category = { category_id: string; name: string; };
type ProfileData = {
  full_name: string | null;
  profile_photo_url: string | null;
  students: { course: string; year: number; }[] | null;
};
type ActivityForPortfolio = {
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
};
type CategorizedActivities = { [category: string]: ActivityForPortfolio[] };
type PortfolioDataToPrint = {
  profileData: ProfileData | null;
  categorizedActivities: CategorizedActivities | null;
}

export function DownloadPortfolioModal() {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataToPrint, setDataToPrint] = useState<PortfolioDataToPrint | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    const fetchCategories = async () => {
      const { data } = await supabase.from('activity_categories').select('*');
      if (data) {
        setAllCategories(data);
        setSelectedCategories(data.map(c => c.category_id));
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (dataToPrint && printRef.current) {
      const element = printRef.current;
      html2canvas(element, { scale: 2 }).then(canvas => {
        const dataUrl = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('student-portfolio.pdf');

        setIsLoading(false);
        setDataToPrint(null);
      });
    }
  }, [dataToPrint]);

  const handleCheckboxChange = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleGeneratePdf = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("You must be logged in."); setIsLoading(false); return; }

    try {
      const { data: profileData } = await supabase.from('profiles').select(`full_name, profile_photo_url, students(course, year)`).eq('id', user.id).single();
      const { data: verifiedActivities } = await supabase.from('activities').select(`*, activity_categories(name)`).eq('student_id', user.id).eq('approval_status', 'APPROVED').in('category_id', selectedCategories);
      
      const categorizedActivities = verifiedActivities?.reduce((acc, activity) => {
        // --- THIS IS THE FIX ---
        // Cast to an array `[]` and then access the first element `[0]`
        const category = (activity.activity_categories as { name: string }[])?.[0]?.name || 'Uncategorized';
        
        if (!acc[category]) { acc[category] = []; }
        acc[category].push(activity);
        return acc;
      }, {} as CategorizedActivities) || null;
      
      setDataToPrint({ profileData, categorizedActivities });
    } catch (error) {
      console.error(error);
      alert("Failed to fetch data for portfolio.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="group bg-blue-500 hover:bg-blue-600 rounded-full h-16 w-16 hover:w-56 transition-all duration-300 ease-in-out flex items-center justify-center shadow-lg">
            <Download className="h-7 w-7" /><span className="w-0 overflow-hidden group-hover:w-auto group-hover:ml-2">Download Portfolio</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Download Your Portfolio</DialogTitle><DialogDescription>Select the categories to include.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <p className="font-medium">Categories to Include:</p>
            <div className="grid grid-cols-2 gap-4">
              {allCategories.map((category) => (
                <div key={category.category_id} className="flex items-center space-x-2">
                  <Checkbox id={category.category_id} checked={selectedCategories.includes(category.category_id)} onCheckedChange={() => handleCheckboxChange(category.category_id)} />
                  <Label htmlFor={category.category_id} className="cursor-pointer">{category.name}</Label>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={handleGeneratePdf} disabled={isLoading || selectedCategories.length === 0} className="w-full">
            {isLoading ? 'Generating...' : 'Generate PDF'}
          </Button>
        </DialogContent>
      </Dialog>
      <div className="absolute left-[-9999px] top-0">
        <PortfolioTemplate forwardedRef={printRef} profileData={dataToPrint?.profileData || null} activities={dataToPrint?.categorizedActivities || null} />
      </div>
    </>
  );
}