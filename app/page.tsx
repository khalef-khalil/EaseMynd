'use client';

import { useState, useEffect } from 'react';
import { Habit, HabitLog, Task, FocusSession, Principle } from '@/types';
import { getStreakCount } from '@/lib/utils';
import { 
  FireIcon, 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrophyIcon,
  ListBulletIcon,
  CheckIcon,
  ClockIcon,
  BookOpenIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [bestStreaks, setBestStreaks] = useState<Record<number, number>>({});
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [principles, setPrinciples] = useState<Principle[]>([]);

  useEffect(() => {
    fetchHabits();
    fetchLogs();
    fetchTasks();
    fetchSessions();
    fetchPrinciples();
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

  const fetchTasks = async () => {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    setTasks(data);
  };

  const fetchSessions = async () => {
    const response = await fetch('/api/focus-sessions');
    const data = await response.json();
    setSessions(data);
  };

  const fetchPrinciples = async () => {
    const response = await fetch('/api/principles');
    const data = await response.json();
    setPrinciples(data);
  };

  const getHabitStats = (habit: Habit) => {
    const habitLogs = logs.filter(log => log.habit_id === habit.id);
    const totalDays = habitLogs.length;
    const successfulDays = habitLogs.filter(log => 
      (habit.type === 'good' && log.status === 'completed') ||
      (habit.type === 'bad' && log.status !== 'failed')
    ).length;
    
    return {
      streak: getStreakCount(habitLogs),
      bestStreak: bestStreaks[habit.id] || 0,
      successRate: totalDays ? Math.round((successfulDays / totalDays) * 100) : 0,
      totalDays,
      successfulDays,
    };
  };

  const getTodayProgress = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayLogs = logs.filter(log => {
      const logDate = new Date(log.date + 'T00:00:00');
      return logDate.getTime() === today.getTime();
    });

    const goodHabits = habits.filter(h => h.type === 'good');
    const badHabits = habits.filter(h => h.type === 'bad');
    
    const completedGoodHabits = todayLogs.filter(log => 
      goodHabits.some(h => h.id === log.habit_id) && log.status === 'completed'
    ).length;

    // For bad habits, we start with total count and subtract failed ones
    const failedBadHabits = todayLogs.filter(log => 
      badHabits.some(h => h.id === log.habit_id) && log.status === 'failed'
    ).length;

    const avoidedBadHabits = badHabits.length - failedBadHabits;

    return {
      goodHabits: {
        total: goodHabits.length,
        completed: completedGoodHabits,
        percentage: goodHabits.length ? Math.round((completedGoodHabits / goodHabits.length) * 100) : 0,
      },
      badHabits: {
        total: badHabits.length,
        avoided: avoidedBadHabits,
        failed: failedBadHabits,
        percentage: badHabits.length ? Math.round((avoidedBadHabits / badHabits.length) * 100) : 0,
      },
    };
  };

  const todayProgress = getTodayProgress();
  const goodHabits = habits.filter(h => h.type === 'good');
  const badHabits = habits.filter(h => h.type === 'bad');
  const ongoingTasks = tasks.filter(task => task.status === 'ongoing');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Principles Overview */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Principles Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-gray-900">Total Principles</h3>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-50">
                <BookOpenIcon className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{principles.length}</p>
                <p className="ml-2 text-sm text-gray-500">principles</p>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <ListBulletIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                <span>Life guidelines tracked</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-gray-900">Testing Status</h3>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-50">
                <BeakerIcon className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {principles.filter(p => p.status === 'testing').length}
                </p>
                <p className="ml-2 text-sm text-gray-500">in testing</p>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1.5" />
                <span>{principles.filter(p => p.status === 'tested').length} tested</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-gray-900">Recent Activity</h3>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-50">
                <CalendarIcon className="h-5 w-5 text-pink-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {principles.filter(p => {
                    const date = new Date(p.created_at);
                    const now = new Date();
                    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
                    return diffDays < 7;
                  }).length}
                </p>
                <p className="ml-2 text-sm text-gray-500">new this week</p>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <ArrowTrendingUpIcon className="h-4 w-4 text-pink-500 mr-1.5" />
                <span>Recently added principles</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Sessions Overview */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Focus Sessions Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-gray-900">Total Focus Time</h3>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                <ClockIcon className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {sessions.reduce((acc, session) => acc + session.duration_minutes, 0)}
                </p>
                <p className="ml-2 text-sm text-gray-500">minutes</p>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                <span>{sessions.length} total sessions</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-gray-900">Success Rate</h3>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50">
                <CheckIcon className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {sessions.length ? Math.round((sessions.filter(s => s.achieved).length / sessions.length) * 100) : 0}%
                </p>
                <p className="ml-2 text-sm text-gray-500">completion rate</p>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1.5" />
                <span>{sessions.filter(s => s.achieved).length} goals achieved</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-gray-900">Recent Activity</h3>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {sessions.filter(s => {
                    const date = new Date(s.created_at);
                    const now = new Date();
                    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
                    return diffDays < 7;
                  }).length}
                </p>
                <p className="ml-2 text-sm text-gray-500">this week</p>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <ArrowTrendingUpIcon className="h-4 w-4 text-blue-500 mr-1.5" />
                <span>Recent focus sessions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Overview */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tasks Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-gray-900">Ongoing Tasks</h3>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-50">
                <ClockIcon className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{ongoingTasks.length}</p>
                <p className="ml-2 text-sm text-gray-500">tasks pending</p>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <ListBulletIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                <span>
                  {Math.round((ongoingTasks.length / (tasks.length || 1)) * 100)}% of total tasks
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-gray-900">Completed Tasks</h3>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50">
                <CheckIcon className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{completedTasks.length}</p>
                <p className="ml-2 text-sm text-gray-500">tasks done</p>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1.5" />
                <span>
                  {Math.round((completedTasks.length / (tasks.length || 1)) * 100)}% completion rate
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium text-gray-900">Recent Activity</h3>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                <CalendarIcon className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {tasks.filter(t => {
                    const date = new Date(t.created_at);
                    const now = new Date();
                    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
                    return diffDays < 7;
                  }).length}
                </p>
                <p className="ml-2 text-sm text-gray-500">new this week</p>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <ListBulletIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                <span>{tasks.length} total tasks tracked</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Habit Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">Good Habits</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                todayProgress.goodHabits.percentage === 100 ? 'bg-green-100 text-green-800' :
                todayProgress.goodHabits.percentage > 0 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {todayProgress.goodHabits.percentage}%
              </span>
            </div>
            <div className="flex items-center text-2xl font-semibold text-gray-900">
              <CheckCircleIcon className={`h-8 w-8 mr-2 ${
                todayProgress.goodHabits.percentage === 100 ? 'text-green-500' :
                todayProgress.goodHabits.percentage > 0 ? 'text-yellow-500' :
                'text-red-500'
              }`} />
              {todayProgress.goodHabits.completed} / {todayProgress.goodHabits.total}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">Bad Habits Avoided</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                todayProgress.badHabits.avoided === todayProgress.badHabits.total ? 'bg-green-100 text-green-800' :
                todayProgress.badHabits.avoided > 0 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {todayProgress.badHabits.percentage}%
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center text-2xl font-semibold text-gray-900">
                <XCircleIcon className={`h-8 w-8 mr-2 ${
                  todayProgress.badHabits.avoided === todayProgress.badHabits.total ? 'text-green-500' :
                  todayProgress.badHabits.avoided > 0 ? 'text-yellow-500' :
                  'text-red-500'
                }`} />
                {todayProgress.badHabits.avoided} / {todayProgress.badHabits.total}
              </div>
              {todayProgress.badHabits.failed > 0 && (
                <p className={`text-sm mt-2 ${
                  todayProgress.badHabits.failed === todayProgress.badHabits.total ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  Failed today: {todayProgress.badHabits.failed}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Good Habits Overview */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Good Habits Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goodHabits.map(habit => {
            const stats = getHabitStats(habit);
            return (
              <div key={habit.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">{habit.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Current Streak</span>
                    <div className="flex items-center">
                      <FireIcon className="h-4 w-4 text-orange-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{stats.streak} days</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Best Streak</span>
                    <div className="flex items-center">
                      <TrophyIcon className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{stats.bestStreak} days</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Success Rate</span>
                    <div className="flex items-center">
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{stats.successRate}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Total Days</span>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{stats.totalDays} days</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bad Habits Overview */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bad Habits Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badHabits.map(habit => {
            const stats = getHabitStats(habit);
            return (
              <div key={habit.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">{habit.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Clean Streak</span>
                    <div className="flex items-center">
                      <FireIcon className="h-4 w-4 text-orange-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{stats.streak} days</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Best Clean Streak</span>
                    <div className="flex items-center">
                      <TrophyIcon className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{stats.bestStreak} days</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Avoidance Rate</span>
                    <div className="flex items-center">
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{stats.successRate}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Total Days</span>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{stats.totalDays} days</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
