'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Principle, Question } from '@/types';
import { formatDate } from '@/lib/utils';

export default function PrincipleDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [principle, setPrinciple] = useState<Principle | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);

  useEffect(() => {
    const fetchPrinciple = async () => {
      try {
        const response = await fetch(`/api/principles/${params.id}`);
        const data = await response.json();
        setPrinciple(data);

        // Fetch associated question
        const questionResponse = await fetch(`/api/questions/${data.question_id}`);
        const questionData = await questionResponse.json();
        setQuestion(questionData);
      } catch (error) {
        console.error('Failed to fetch principle:', error);
      }
    };

    fetchPrinciple();
  }, [params.id]);

  if (!principle || !question) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" />
        Back to principles
      </button>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{principle.title}</h1>
              <div className="mt-2 flex items-center gap-x-2 text-sm text-gray-500">
                <span>Added {formatDate(principle.created_at)}</span>
                <span>•</span>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  principle.status === 'tested' 
                    ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' 
                    : 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20'
                }`}>
                  {principle.status === 'tested' ? 'Tested' : 'Testing'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-sm font-medium text-gray-700">Related Question</h2>
              <p className="mt-1 text-sm text-gray-900">{question.title}</p>
              <span className="mt-2 inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
                {question.category}
              </span>
            </div>
          </div>

          {principle.description && (
            <div className="mt-6">
              <h2 className="text-sm font-medium text-gray-900">Description</h2>
              <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                {principle.description}
              </p>
            </div>
          )}

          {principle.examples && (
            <div className="mt-6">
              <h2 className="text-sm font-medium text-gray-900">Examples</h2>
              <div className="mt-2 bg-gray-50 rounded-md p-4">
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {principle.examples}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 