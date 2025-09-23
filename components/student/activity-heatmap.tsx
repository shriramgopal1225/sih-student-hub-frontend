// components/student/activity-heatmap.tsx
'use client';

import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import React from 'react';

type HeatmapData = {
  date: string;
  count: number;
};

export function ActivityHeatmap({ data }: { data: HeatmapData[] }) {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const today = new Date();

  return (
    <div>
      <CalendarHeatmap
        startDate={oneYearAgo}
        endDate={today}
        values={data}
        classForValue={(value) => {
          if (!value) { return 'color-empty'; }
          const intensity = Math.min(value.count, 4);
          return `color-scale-${intensity}`;
        }}
        // This is the most reliable way to add tooltips without errors
        // transformDayElement={(element, value) => {
        //   if (value) {
        //     return React.cloneElement(element as React.ReactElement, {
        //       'data-tooltip-id': 'heatmap-tooltip',
        //       'data-tooltip-content': `${value.count} activities on ${value.date}`,
        //     });
        //   }
        //   return element as React.ReactElement;
        // }}
      />
      {/* This component provides the actual tooltip pop-up */}
      <ReactTooltip id="heatmap-tooltip" />
    </div>
  );
}