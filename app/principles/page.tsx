'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Question, Principle, QUESTION_CATEGORIES } from '@/types';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import DeleteModal from '@/components/DeleteModal';

export default function PrinciplesPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [principles, setPrinciples] = useState<Principle[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showPrincipleForm, setShowPrincipleForm] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [isEditMode, setIsEditMode] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'question' | 'principle'; item: Question | Principle } | null>(null);

  useEffect(() => {
    fetchQuestions();
    fetchPrinciples();
  }, []);

  const fetchQuestions = async () => {
    const response = await fetch('/api/questions');
    const data = await response.json();
    setQuestions(data);
  };

  const fetchPrinciples = async () => {
    const response = await fetch('/api/principles');
    const data = await response.json();
    setPrinciples(data);
  };

  const handleQuestionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const question = {
      title: formData.get('title'),
      category: formData.get('category'),
    };

    await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(question),
    });

    form.reset();
    setShowQuestionForm(false);
    fetchQuestions();
  };

  const handlePrincipleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const principle = {
      question_id: selectedQuestion?.id,
      title: formData.get('title'),
      description: formData.get('description') || undefined,
      examples: formData.get('examples') || undefined
    };

    await fetch('/api/principles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(principle),
    });

    form.reset();
    setShowPrincipleForm(false);
    fetchPrinciples();
  };

  const toggleQuestion = (questionId: number) => {
    setExpandedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const filteredQuestions = questions.filter(question => {
    const matchesCategory = !selectedCategory || question.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      question.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getPrinciplesForQuestion = (questionId: number) => {
    return principles.filter(principle => principle.question_id === questionId);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'question') {
      await fetch(`/api/questions/${itemToDelete.item.id}`, {
        method: 'DELETE',
      });
      fetchQuestions();
      fetchPrinciples();
    } else {
      await fetch('/api/principles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemToDelete.item.id }),
      });
      fetchPrinciples();
    }
    setItemToDelete(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Life Questions & Principles</h1>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-700">
            Questions about life and the principles that help answer them.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-3">
          <button
            type="button"
            onClick={() => setIsEditMode(!isEditMode)}
            className={`rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${
              isEditMode
                ? 'bg-gray-600 text-white hover:bg-gray-500'
                : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
            }`}
          >
            {isEditMode ? 'Exit Edit Mode' : 'Edit Mode'}
          </button>
          <button
            type="button"
            onClick={() => setShowQuestionForm(true)}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            <span className="flex items-center">
              <PlusIcon className="h-5 w-5 mr-1" />
              Add Question
            </span>
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="block w-full sm:w-48 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          <option value="">All Categories</option>
          {QUESTION_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div className="mt-8 flow-root">
        <div className="overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          {filteredQuestions.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {filteredQuestions.map((question) => {
                const isExpanded = expandedQuestions.has(question.id);
                const questionPrinciples = getPrinciplesForQuestion(question.id);

                return (
                  <li key={question.id} className="relative">
                    <div className="flex items-center justify-between gap-x-6 px-4 py-4 sm:py-5 hover:bg-gray-50 sm:px-6">
                      <div className="min-w-0">
                        <div className="flex items-start gap-x-3 flex-col sm:flex-row sm:items-center">
                          <p className="text-base sm:text-lg font-semibold leading-6 text-gray-900">
                            {question.title}
                          </p>
                          <span className="mt-1.5 sm:mt-0 inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
                            {question.category}
                          </span>
                        </div>
                        <div className="mt-1.5 sm:mt-1 flex items-center gap-x-2 text-[10px] sm:text-xs leading-5 text-gray-500">
                          <p>Added {formatDate(question.created_at)}</p>
                          <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                            <circle cx={1} cy={1} r={1} />
                          </svg>
                          <p>{questionPrinciples.length} principles</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-x-4">
                        <button
                          onClick={() => {
                            setSelectedQuestion(question);
                            setShowPrincipleForm(true);
                          }}
                          className="rounded-md bg-white px-2 sm:px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          <PlusIcon className="h-5 w-5 sm:hidden" />
                          <span className="hidden sm:inline">Add Principle</span>
                        </button>
                        {isEditMode && (
                          <button
                            onClick={() => setItemToDelete({ type: 'question', item: question })}
                            className="rounded-md bg-red-50 px-2 sm:px-2.5 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        )}
                        <button
                          onClick={() => toggleQuestion(question.id)}
                          className="rounded-full p-1 hover:bg-gray-100"
                        >
                          {isExpanded ? (
                            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    {isExpanded && questionPrinciples.length > 0 && (
                      <div className="bg-gray-50 px-4 py-6 sm:px-6">
                        <ul className="space-y-6">
                          {questionPrinciples.map((principle) => (
                            <li key={principle.id} className="relative">
                              <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5 px-3 sm:px-4 py-2 sm:py-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Link
                                      href={`/principles/${principle.id}`}
                                      className="text-sm sm:text-base font-semibold text-gray-900 hover:text-indigo-600"
                                    >
                                      {principle.title}
                                    </Link>
                                    <span className={`inline-flex items-center rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium ${
                                      principle.status === 'tested' 
                                        ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' 
                                        : 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20'
                                    }`}>
                                      {principle.status === 'tested' ? 'Tested' : 'Testing'}
                                    </span>
                                  </div>
                                  {isEditMode && (
                                    <div className="flex items-center gap-1 sm:gap-2">
                                      {principle.status === 'testing' && (
                                        <button
                                          onClick={async () => {
                                            await fetch('/api/principles', {
                                              method: 'PUT',
                                              headers: { 'Content-Type': 'application/json' },
                                              body: JSON.stringify({
                                                ...principle,
                                                status: 'tested'
                                              }),
                                            });
                                            fetchPrinciples();
                                          }}
                                          className="rounded-md bg-green-50 px-2 sm:px-2.5 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-green-700 hover:bg-green-100"
                                        >
                                          Mark as Tested
                                        </button>
                                      )}
                                      <button
                                        onClick={() => setItemToDelete({ type: 'principle', item: principle })}
                                        className="rounded-md bg-red-50 px-2 sm:px-2.5 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-red-700 hover:bg-red-100"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">No questions found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Question Form Modal */}
      {showQuestionForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Add New Question</h2>
            <form onSubmit={handleQuestionSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Question
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    placeholder="e.g., How to make new friends?"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    id="category"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {QUESTION_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowQuestionForm(false)}
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

      {/* Principle Form Modal */}
      {showPrincipleForm && selectedQuestion && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Add New Principle</h2>
            <p className="text-sm text-gray-600 mb-6">
              For question: {selectedQuestion.title}
            </p>
            <form onSubmit={handlePrincipleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    placeholder="e.g., Smile more often"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description <span className="text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    placeholder="Explain what this principle means..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="examples" className="block text-sm font-medium text-gray-700">
                    Examples <span className="text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    name="examples"
                    id="examples"
                    rows={3}
                    placeholder="Share some examples of applying this principle..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPrincipleForm(false);
                    setSelectedQuestion(null);
                  }}
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

      {itemToDelete && (
        <DeleteModal
          title={itemToDelete.type === 'question' ? 'question and its principles' : 'principle'}
          onConfirm={handleDelete}
          onCancel={() => setItemToDelete(null)}
        />
      )}
    </div>
  );
} 