import React from 'react';

export const SuccessMessage: React.FC<{ message?: string }> = ({ message }) => (
  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4 max-w-xl mx-auto">
    <strong className="font-bold">Success!</strong>
    <span className="block sm:inline ml-2">{message || 'Your CV was validated successfully.'}</span>
  </div>
); 