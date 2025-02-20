'use client';

import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { HabitLog } from '@/types';

interface HabitCalendarProps {
  logs: HabitLog[];
  type: 'good' | 'bad';
}

export default function HabitCalendar({ logs, type }: HabitCalendarProps) {
  // Get start and end dates (1 year range)
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const startDate = new Date(now);
  startDate.setFullYear(now.getFullYear() - 1);

  // Convert logs to the format expected by CalendarHeatmap
  const values = logs
    .filter(log => {
      const logDate = new Date(log.date + 'T00:00:00');
      return logDate <= now;
    })
    .map(log => ({
      date: log.date,
      count: (type === 'good' && log.status === 'completed') ||
             (type === 'bad' && log.status !== 'failed') ? 2 : 1
    }));

  return (
    <div className="w-full">
      <style jsx global>{`
        .react-calendar-heatmap .color-empty { fill: #ebedf0; }
        .react-calendar-heatmap .color-scale-1 { fill: ${type === 'bad' ? '#ff4d4d' : '#ebedf0'}; }
        .react-calendar-heatmap .color-scale-2 { fill: #40c463; }
        .react-calendar-heatmap text {
          font-size: 6px;
          fill: #767676;
        }
        .react-calendar-heatmap rect {
          rx: 2;
        }
      `}</style>
      <CalendarHeatmap
        startDate={startDate}
        endDate={now}
        values={values}
        classForValue={(value) => {
          if (!value) {
            return 'color-empty';
          }
          return `color-scale-${value.count}`;
        }}
        showMonthLabels
        gutterSize={2}
      />
    </div>
  );
} 