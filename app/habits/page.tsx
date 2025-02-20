'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, CheckIcon, XMarkIcon, FireIcon, ArrowPathIcon, TrashIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { Habit, HabitLog } from '@/types';
import { getStreakCount } from '@/lib/utils';
import HabitCalendar from '@/components/HabitCalendar';
import DeleteHabitModal from '@/components/DeleteHabitModal';
import ResetDayModal from '@/components/ResetDayModal';

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showBadHabits, setShowBadHabits] = useState(false);
  const [bestStreaks, setBestStreaks] = useState<Record<number, number>>({});
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    fetchHabits();
    fetchLogs();
  }, []);

  useEffect(() => {
    // Calculate best streaks whenever logs change
    const newBestStreaks: Record<number, number> = {};
    habits.forEach(habit => {
      const habitLogs = logs.filter(log => log.habit_id === habit.id);
      let maxStreak = 0;
      let currentStreak = 0;
      let prevDate: Date | null = null;

      habitLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      habitLogs.forEach(log => {
        const currentDate = new Date(log.date);
        const isSuccess = (habit.type === 'good' && log.status === 'completed') ||
                         (habit.type === 'bad' && log.status !== 'failed');

        if (isSuccess) {
          if (prevDate === null || 
              (prevDate.getTime() + 24 * 60 * 60 * 1000) === currentDate.getTime()) {
            currentStreak++;
          } else {
            currentStreak = 1;
          }
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
        prevDate = currentDate;
      });

      newBestStreaks[habit.id] = maxStreak;
    });
    setBestStreaks(newBestStreaks);
  }, [logs, habits]);

  const fetchHabits = async () => {
    const response = await fetch('/api/habits');
    const data = await response.json();
    setHabits(data);
  };

  const fetchLogs = async () => {
    const response = await fetch('/api/habits/logs');
    const data = await response.json();
    setLogs(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const habit = {
      name: formData.get('name'),
      type: formData.get('type'),
    };

    await fetch('/api/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(habit),
    });

    form.reset();
    setShowForm(false);
    fetchHabits();
  };

  const handleLogStatus = async (habitId: number, status: 'completed' | 'failed') => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      // Find if there's already a log for today
      const existingLog = logs.find(log => {
        const logDate = new Date(log.date + 'T00:00:00');
        logDate.setHours(0, 0, 0, 0);
        return log.habit_id === habitId && logDate.getTime() === today.getTime();
      });

      if (existingLog) {
        // If there's an existing log, delete it (unlog)
        const response = await fetch(`/api/habits/logs/${existingLog.id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const error = await response.json();
          console.error('Failed to delete log:', error);
          return;
        }
        
        // Update local state immediately
        setLogs(prevLogs => {
          const newLogs = prevLogs.filter(log => log.id !== existingLog.id);
          return newLogs;
        });
      } else {
        // No existing log, create a new one
        const response = await fetch('/api/habits/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            habit_id: habitId,
            status,
            date: todayStr,
          }),
        });
        
        if (!response.ok) {
          const error = await response.json();
          console.error('Failed to create log:', error);
          return;
        }

        await fetchLogs();
      }
    } catch (error) {
      console.error('Error handling log status:', error);
    }
  };

  const getHabitStats = (habitId: number) => {
    const habitLogs = logs.filter(log => log.habit_id === habitId);
    return {
      streak: getStreakCount(habitLogs),
      bestStreak: bestStreaks[habitId] || 0,
    };
  };

  const getTodayStatus = (habitId: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayLog = logs.find(log => {
      const logDate = new Date(log.date + 'T00:00:00');
      logDate.setHours(0, 0, 0, 0);
      return log.habit_id === habitId && logDate.getTime() === today.getTime();
    });
    
    return todayLog?.status;
  };

  const filteredHabits = habits.filter(h => h.type === (showBadHabits ? 'bad' : 'good'));

  const handleResetDay = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Find all logs for today
      const todayLogs = logs.filter(log => {
        const logDate = new Date(log.date + 'T00:00:00');
        return logDate.getTime() === today.getTime();
      });

      // Delete all today's logs
      const deletePromises = todayLogs.map(log => 
        fetch(`/api/habits/logs/${log.id}`, {
          method: 'DELETE',
        })
      );

      await Promise.all(deletePromises);
      
      // Update local state immediately
      setLogs(prevLogs => prevLogs.filter(log => {
        const logDate = new Date(log.date + 'T00:00:00');
        return logDate.getTime() !== today.getTime();
      }));

      setShowResetConfirm(false);
    } catch (error) {
      console.error('Error resetting day:', error);
      // Refresh logs from server in case of error
      await fetchLogs();
    }
  };

  const handleDeleteHabit = async (habit: Habit) => {
    if (!habit?.id) return;

    try {
      const response = await fetch(`/api/habits/${habit.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete habit');

      // Update local state
      setHabits(prev => prev.filter(h => h.id !== habit.id));
      setLogs(prev => prev.filter(log => log.habit_id !== habit.id));
      setHabitToDelete(null);
    } catch (error) {
      console.error('Failed to delete habit:', error);
      // You might want to show an error toast here
    }
  };

  return (
    <div>
      <div className="flex flex-col space-y-6 mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Habits</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2.5 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Reset Day
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="hidden sm:flex items-center px-4 py-2.5 rounded-lg bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Habit
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="sm:hidden p-2.5 flex items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowBadHabits(false)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              !showBadHabits
                ? 'bg-green-100 text-green-800 shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Good Habits
          </button>
          <button
            onClick={() => setShowBadHabits(true)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              showBadHabits
                ? 'bg-red-100 text-red-800 shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Bad Habits
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Add New Habit</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Habit Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    name="type"
                    id="type"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="good">Good Habit</option>
                    <option value="bad">Bad Habit</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {filteredHabits.length > 0 ? (
          filteredHabits.map((habit) => {
            const stats = getHabitStats(habit.id);
            const habitLogs = logs.filter(log => log.habit_id === habit.id);
            const todayStatus = getTodayStatus(habit.id);
            const hasLogToday = todayStatus !== undefined;

            return (
              <div key={habit.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col space-y-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold text-gray-900 truncate">{habit.name}</h3>
                          <button
                            onClick={() => setHabitToDelete(habit)}
                            className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete habit"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-4">
                          <div className="flex items-center gap-1.5">
                            <FireIcon className="h-4 w-4 text-orange-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600">
                              {showBadHabits ? 'Clean streak' : 'Current streak'}: {stats.streak} days
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <TrophyIcon className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600">
                              Best: {stats.bestStreak} days
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleLogStatus(habit.id, showBadHabits ? 'failed' : 'completed')}
                        className={`h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-full transition-all transform active:scale-95 ${
                          hasLogToday
                            ? showBadHabits
                              ? 'bg-red-500 text-white hover:bg-red-600'
                              : 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        } shadow-lg`}
                      >
                        {showBadHabits ? (
                          <XMarkIcon className="h-7 w-7" />
                        ) : (
                          <CheckIcon className="h-7 w-7" />
                        )}
                      </button>
                    </div>
                    <div className="pt-4">
                      <HabitCalendar logs={habitLogs} type={habit.type} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16">
            <p className="text-center text-gray-500">
              No {showBadHabits ? 'bad' : 'good'} habits added yet.
            </p>
          </div>
        )}
      </div>

      {habitToDelete && (
        <DeleteHabitModal
          habit={habitToDelete}
          onConfirm={() => handleDeleteHabit(habitToDelete)}
          onCancel={() => setHabitToDelete(null)}
        />
      )}

      {showResetConfirm && (
        <ResetDayModal
          onConfirm={handleResetDay}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
    </div>
  );
} 

