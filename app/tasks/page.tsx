'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, CheckIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Task } from '@/types';
import { formatDate } from '@/lib/utils';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showCleanConfirm, setShowCleanConfirm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    setTasks(data);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle.trim() }),
      });

      if (!response.ok) throw new Error('Failed to create task');

      setNewTaskTitle('');
      fetchTasks();
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, status: 'completed' | 'cancelled') => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status }),
      });

      if (!response.ok) throw new Error('Failed to update task');

      fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId }),
      });

      if (!response.ok) throw new Error('Failed to delete task');

      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleCleanTasks = async () => {
    try {
      const deletePromises = completedTasks.map(task =>
        fetch('/api/tasks', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: task.id }),
        })
      );

      await Promise.all(deletePromises);
      setShowCleanConfirm(false);
      fetchTasks();
    } catch (error) {
      console.error('Failed to clean tasks:', error);
    }
  };

  const ongoingTasks = tasks.filter(task => task.status === 'ongoing');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
        {completedTasks.length > 0 && (
          <button
            onClick={() => setShowCleanConfirm(true)}
            className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Clean Tasks
          </button>
        )}
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!newTaskTitle.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Ongoing Tasks */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Ongoing</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <ul className="divide-y divide-gray-100">
            {ongoingTasks.length > 0 ? (
              ongoingTasks.map((task) => (
                <li key={task.id} className="p-4 flex items-center justify-between gap-4">
                  <span className="text-gray-900">{task.title}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                      className="p-1.5 rounded-full text-gray-400 hover:text-green-500 hover:bg-green-50"
                      title="Mark as completed"
                    >
                      <CheckIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleUpdateTaskStatus(task.id, 'cancelled')}
                      className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
                      title="Cancel task"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-gray-500">No ongoing tasks</li>
            )}
          </ul>
        </div>
      </div>

      {/* Completed Tasks */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Completed</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <ul className="divide-y divide-gray-100">
            {completedTasks.length > 0 ? (
              completedTasks.map((task) => (
                <li key={task.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-gray-500 line-through">{task.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Completed {formatDate(task.completed_at!)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete task"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-gray-500">No completed tasks</li>
            )}
          </ul>
        </div>
      </div>

      {/* Clean Tasks Confirmation Modal */}
      {showCleanConfirm && (
        <div className="fixed inset-0 bg-gray-500/75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Clean Completed Tasks</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete all completed tasks? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowCleanConfirm(false)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCleanTasks}
                className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 