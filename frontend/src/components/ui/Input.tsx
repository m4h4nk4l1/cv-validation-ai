import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => (
  <input
    className={`input input-bordered w-full ${className}`}
    {...props}
  />
); 