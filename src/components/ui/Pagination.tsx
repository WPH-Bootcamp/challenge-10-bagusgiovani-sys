// components/ui/Pagination.tsx
'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 5) {
      // Show all pages if 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 py-6">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          flex items-center gap-1 px-4 py-2 text-sm font-medium 
          text-gray-700 bg-white border border-gray-300 rounded-lg
          hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm
          active:scale-95 active:bg-gray-100
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-none
          transition-all duration-200 ease-in-out
        "
      >
        <svg 
          className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-sm text-gray-500"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`
                relative w-10 h-10 rounded-full text-sm font-semibold
                transition-all duration-200 ease-in-out
                ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50 scale-110 ring-2 ring-blue-200'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 hover:scale-110 hover:shadow-md active:scale-95 active:bg-blue-100'
                }
              `}
            >
              <span className="relative z-10">{pageNum}</span>
              {isActive && (
                <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          flex items-center gap-1 px-4 py-2 text-sm font-medium 
          text-gray-700 bg-white border border-gray-300 rounded-lg
          hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm
          active:scale-95 active:bg-gray-100
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-none
          transition-all duration-200 ease-in-out
        "
      >
        Next
        <svg 
          className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}