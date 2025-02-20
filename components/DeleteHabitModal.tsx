import { useState } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Habit } from '@/types';

interface DeleteHabitModalProps {
  habit: Habit;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteHabitModal({ habit, onConfirm, onCancel }: DeleteHabitModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const isConfirmEnabled = confirmText === habit.name;

  return (
    <div className="fixed inset-0 bg-gray-500/75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900">Delete Habit</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete &ldquo;{habit.name}&rdquo;? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="rounded-md bg-red-50 p-4">
            <ul className="text-sm text-red-700 space-y-1">
              <li>• All tracking history will be permanently deleted</li>
              <li>• Your streak records will be lost</li>
              <li>• This action is irreversible</li>
            </ul>
          </div>

          <div className="mt-4">
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-900">
              Type &ldquo;{habit.name}&rdquo; to confirm
            </label>
            <input
              type="text"
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={habit.name}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!isConfirmEnabled}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:hover:bg-red-600 disabled:cursor-not-allowed"
          >
            Delete Habit
          </button>
        </div>
      </div>
    </div>
  );
} 