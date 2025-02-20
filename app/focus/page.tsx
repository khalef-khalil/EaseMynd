'use client';

import { useState, useEffect, useRef } from 'react';
import { FocusSession } from '@/types';
import { formatDate } from '@/lib/utils';
import { PlayIcon, PauseIcon, StopIcon, ArrowPathIcon, TrashIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function FocusPage() {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState(25); // Default 25 minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showAchievementDialog, setShowAchievementDialog] = useState(false);
  const [showStopConfirmation, setShowStopConfirmation] = useState(false);
  const [showCleanConfirmation, setShowCleanConfirmation] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setShowAchievementDialog(true);
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/focus-sessions');
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  const handleStartTimer = () => {
    if (!goal.trim()) {
      alert('Please set a goal for this focus session');
      return;
    }
    setIsRunning(true);
  };

  const handlePauseTimer = () => {
    setIsRunning(false);
  };

  const handleStopTimer = () => {
    setShowStopConfirmation(true);
  };

  const confirmStop = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
    setShowStopConfirmation(false);
    setShowAchievementDialog(true);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
    setGoal('');
  };

  const handleAchievementSubmit = async (achieved: boolean) => {
    try {
      await fetch('/api/focus-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration_minutes: duration,
          goal,
          achieved,
        }),
      });

      setShowAchievementDialog(false);
      setTimeLeft(duration * 60);
      setGoal('');
      fetchSessions();
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const handleCleanHistory = async () => {
    try {
      await fetch('/api/focus-sessions', {
        method: 'DELETE',
      });
      setSessions([]);
      setShowCleanConfirmation(false);
    } catch (error) {
      console.error('Failed to clean session history:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Focus Timer</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col items-center">
          {/* Timer Circle */}
          <div className="relative w-64 h-64 mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="#4f46e5"
                strokeWidth="8"
                fill="none"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-semibold text-gray-900">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Duration Selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {[15, 25, 45, 60, 90].map((mins) => (
              <button
                key={mins}
                onClick={() => {
                  setDuration(mins);
                  setTimeLeft(mins * 60);
                }}
                disabled={isRunning}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  duration === mins
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                {mins}m
              </button>
            ))}
          </div>

          {/* Goal Input */}
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="What do you want to achieve?"
            disabled={isRunning}
            className="w-full max-w-md mb-6 rounded-lg border-gray-300 disabled:bg-gray-50"
          />

          {/* Control Buttons */}
          <div className="flex gap-3">
            {!isRunning ? (
              <button
                onClick={handleStartTimer}
                disabled={!goal.trim()}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50"
              >
                <PlayIcon className="h-5 w-5 mr-2" />
                Start
              </button>
            ) : (
              <button
                onClick={handlePauseTimer}
                className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500"
              >
                <PauseIcon className="h-5 w-5 mr-2" />
                Pause
              </button>
            )}
            <button
              onClick={handleStopTimer}
              disabled={!isRunning && timeLeft === duration * 60}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 disabled:opacity-50"
            >
              <StopIcon className="h-5 w-5 mr-2" />
              Stop
            </button>
            <button
              onClick={handleResetTimer}
              disabled={isRunning}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 disabled:opacity-50"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Session History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Session History</h2>
          {sessions.length > 0 && (
            <button
              onClick={() => setShowCleanConfirmation(true)}
              className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Clean History
            </button>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <ul className="divide-y divide-gray-100">
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <li key={session.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{session.goal}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {session.duration_minutes} minutes on {formatDate(session.created_at)}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        session.achieved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {session.achieved ? 'Achieved' : 'Not Achieved'}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-gray-500">No sessions yet</li>
            )}
          </ul>
        </div>
      </div>

      {/* Stop Confirmation Dialog */}
      {showStopConfirmation && (
        <div className="fixed inset-0 bg-gray-500/75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Stop Session</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Are you sure you want to stop the current focus session? You still have {formatTime(timeLeft)} remaining.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setShowStopConfirmation(false)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmStop}
                    className="px-3 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
                  >
                    Stop Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clean History Confirmation Dialog */}
      {showCleanConfirmation && (
        <div className="fixed inset-0 bg-gray-500/75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Clean Session History</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Are you sure you want to delete all session history? This action cannot be undone.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setShowCleanConfirmation(false)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCleanHistory}
                    className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Delete All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Dialog */}
      {showAchievementDialog && (
        <div className="fixed inset-0 bg-gray-500/75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Session Complete</h3>
                <div className="mt-2 space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-700">Goal</p>
                    <p className="text-sm text-gray-600 mt-1">{goal}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-700">Duration</p>
                    <p className="text-sm text-gray-600 mt-1">{duration} minutes</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Did you achieve what you set out to do in this session?
                  </p>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => handleAchievementSubmit(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                  >
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1.5 text-yellow-500" />
                    Not Yet
                  </button>
                  <button
                    onClick={() => handleAchievementSubmit(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                    Yes, Completed
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 