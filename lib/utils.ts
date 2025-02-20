import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getStreakCount(logs: { date: string; status: string }[]): number {
  if (!logs.length) return 0;

  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const log of sortedLogs) {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays !== streak || log.status !== 'completed') {
      break;
    }

    streak++;
    currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
  }

  return streak;
}

export function calculateCompletionRate(logs: { status: string }[]): number {
  if (!logs.length) return 0;
  
  const completedCount = logs.filter(log => log.status === 'completed').length;
  return Math.round((completedCount / logs.length) * 100);
} 