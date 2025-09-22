// components/modals/add-activity-modal.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { createActivity } from "./actions";

// Define types for our fetched data
type Category = {
  category_id: string;
  name: string;
};

type Faculty = {
  id: string;
  full_name: string | null;
};

export function AddActivityModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);

  useEffect(() => {
    const supabase = createClient();
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("activity_categories").select("*");
      if (data) setCategories(data);
    };
    const fetchFaculty = async () => {
      const { data, error } = await supabase.from("profiles").select("id, full_name").eq("role", "faculty");
      if (data) setFaculty(data);
    };
    fetchCategories();
    fetchFaculty();
  }, []);

  const handleFormAction = async (formData: FormData) => {
    if (startDate) formData.append('start_date', startDate.toISOString());
    if (endDate) formData.append('end_date', endDate.toISOString());
    const result = await createActivity(formData);
    if (result.error) {
      alert(result.error);
    } else {
      alert(result.success);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* --- THIS IS THE UPDATED BUTTON WITH THE HOVER EFFECT --- */}
        <Button className="group bg-green-500 hover:bg-green-600 rounded-full h-16 w-16 hover:w-48 transition-all duration-300 ease-in-out flex items-center justify-center shadow-lg">
          <Plus className="h-8 w-8 transition-transform duration-300 group-hover:rotate-90" />
          <span className="w-0 overflow-hidden transition-all duration-300 ease-in-out group-hover:w-auto group-hover:ml-2">
            Add Activity
          </span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[625px]">
        <form action={handleFormAction}>
          <DialogHeader>
            <DialogTitle>Add a New Activity</DialogTitle>
            <DialogDescription>
              Submit your activity for faculty verification. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Activity Title</Label>
              <Input id="title" name="title" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Select name="category" required>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.category_id} value={category.category_id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Dates</Label>
              <div className="col-span-3 grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild><Button variant={"outline"} className={cn("justify-start font-normal", !startDate && "text-muted-foreground")}> <CalendarIcon className="mr-2 h-4 w-4" />{startDate ? format(startDate, "PPP") : <span>Start date</span>}</Button></PopoverTrigger>
                  <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus /></PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild><Button variant={"outline"} className={cn("justify-start font-normal", !endDate && "text-muted-foreground")}> <CalendarIcon className="mr-2 h-4 w-4" />{endDate ? format(endDate, "PPP") : <span>End date</span>}</Button></PopoverTrigger>
                  <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={endDate} onSelect={setEndDate} /></PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="faculty" className="text-right">Verifying Faculty</Label>
              <Select name="faculty" required>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Choose faculty member" /></SelectTrigger>
                <SelectContent>
                  {faculty.map((prof) => (<SelectItem key={prof.id} value={prof.id}>{prof.full_name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proof" className="text-right">Proof</Label>
              <Input id="proof" name="proof" type="file" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="description" className="text-right">Description</Label>
               <Textarea id="description" name="description" placeholder="Describe your activity and key learnings." className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-green-500 hover:bg-green-600">Submit Activity</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}