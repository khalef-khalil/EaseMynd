import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ResetDayModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ResetDayModal({ onConfirm, onCancel }: ResetDayModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-500/75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900">Reset Today&apos;s Progress</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to reset all habit logs for today? This will remove all completions and failures recorded today.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="rounded-md bg-yellow-50 p-4">
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• All habit logs for today will be deleted</li>
              <li>• Current streaks may be affected</li>
              <li>• This action cannot be undone</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Reset Day
          </button>
        </div>
      </div>
    </div>
  );
} 