import React from 'react';

export const ErrorMessage: React.FC<{ message?: string }> = ({ message }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 max-w-xl mx-auto">
    <strong className="font-bold">Error!</strong>
    <span className="block sm:inline ml-2">{message || 'An error occurred. Please try again.'}</span>
  </div>
); 