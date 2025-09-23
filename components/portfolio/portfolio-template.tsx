// components/portfolio/portfolio-template.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

// Updated types to be more specific
type ProfileData = {
  full_name: string | null;
  profile_photo_url: string | null;
  students: { course: string; year: number; }[] | null;
};
type Activity = {
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
};
type CategorizedActivities = { [category: string]: Activity[] };

interface PortfolioTemplateProps {
  profileData: ProfileData | null;
  activities: CategorizedActivities | null;
  forwardedRef: React.Ref<HTMLDivElement>;
}

export function PortfolioTemplate({ profileData, activities, forwardedRef }: PortfolioTemplateProps) {
  const studentInfo = profileData?.students?.[0];
  const initials = profileData?.full_name?.split(' ').map(n => n[0]).join('') || 'U';

  return (
    <div ref={forwardedRef} className="p-10 bg-white" style={{ width: '210mm' }}>
      <header className="flex items-center justify-between pb-6 border-b-2">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">{profileData?.full_name}</h1>
          <p className="text-lg text-gray-600">{studentInfo?.course} - Year {studentInfo?.year}</p>
        </div>
        <Avatar className="h-24 w-24">
          {/* FIX: Pass undefined instead of "" to the src attribute */}
          <AvatarImage src={profileData?.profile_photo_url ?? undefined} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </header>
      <main className="mt-8">
        {activities && Object.entries(activities).map(([category, activityList]) => (
          <div key={category} className="mb-8 break-inside-avoid">
            <h3 className="text-xl font-bold text-green-700 border-b pb-2 mb-4">{category}</h3>
            {activityList.map((activity, index) => (
              <div key={index} className="mb-4 text-sm">
                <p className="font-semibold text-base">{activity.title}</p>
                <p className="text-gray-500">{activity.description}</p>
              </div>
            ))}
          </div>
        ))}
      </main>
    </div>
  );
}