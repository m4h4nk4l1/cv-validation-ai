import React from 'react';

interface SkillsInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const SkillsInput: React.FC<SkillsInputProps> = ({ value, onChange, error }) => (
  <div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input input-bordered w-full"
      placeholder="e.g. React, Node.js, Python"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
); 