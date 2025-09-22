// components/charts/activity-chart.tsx
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#16a34a', '#f97316', '#3b82f6', '#6366f1', '#ec4899'];

// The fix is to define the 'data' prop type inline like this,
// instead of using a separate interface.
export function ActivityChart({ data }: { data: { name: string; value: number }[] }) {
  if (!data || data.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-gray-500">No activity data to display.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}