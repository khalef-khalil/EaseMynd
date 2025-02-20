import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface DeleteModalProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ title, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-500/75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-sm w-full p-4 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
            <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900">Delete {title}?</h3>
            <p className="mt-1 text-sm text-gray-500">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 