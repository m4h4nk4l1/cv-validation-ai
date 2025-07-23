import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cvFormSchema, CVFormSchema } from '@/utils/validation';
import { Button } from '../ui/Button';

interface CVFormProps {
  onSubmit: (data: CVFormSchema) => void;
  isLoading?: boolean;
}

const sanitizeName = (name: string) => name.replace(/[^a-zA-Z\s]/g, '');

export const CVForm: React.FC<CVFormProps> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CVFormSchema>({
    resolver: zodResolver(cvFormSchema),
    mode: 'onChange',
  });

  // Sanitize name input on change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeName(e.target.value);
    setValue('fullName', sanitized, { shouldValidate: true });
  };

  // File validation
  const validateFile = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return 'File is required';
    const file = fileList[0];
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    if (!allowedTypes.includes(file.type)) {
      return 'Only PDF, DOCX, and DOC files are allowed';
    }
    if (file.size > 5 * 1024 * 1024) {
      return 'File size must be less than 5MB';
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto p-8 bg-white rounded-lg shadow-lg border border-gray-300 text-gray-900">
      <div>
        <label className="block font-medium mb-1" htmlFor="fullName">Full Name *</label>
        <input
          id="fullName"
          type="text"
          {...register('fullName', { onChange: handleNameChange })}
          className="input input-bordered w-full text-gray-900 border-2 border-gray-400 focus:border-blue-600 placeholder-gray-400"
          placeholder="Enter your full name"
          autoComplete="off"
        />
        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="email">Email *</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="input input-bordered w-full text-gray-900 border-2 border-gray-400 focus:border-blue-600 placeholder-gray-400"
          placeholder="Enter your email address"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="text"
          {...register('phone')}
          className="input input-bordered w-full text-gray-900 border-2 border-gray-400 focus:border-blue-600 placeholder-gray-400"
          placeholder="Enter your phone number (optional)"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="yearsExperience">Years of Experience *</label>
        <input
          id="yearsExperience"
          type="number"
          step="0.1"
          min={0}
          max={30}
          {...register('yearsExperience')}
          className="input input-bordered w-full text-gray-900 border-2 border-gray-400 focus:border-blue-600 placeholder-gray-400"
          placeholder="e.g. 2.5"
        />
        {errors.yearsExperience && <p className="text-red-500 text-sm mt-1">{errors.yearsExperience.message}</p>}
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="skills">Skills (comma-separated)</label>
        <input
          id="skills"
          type="text"
          {...register('skills')}
          className="input input-bordered w-full text-gray-900 border-2 border-gray-400 focus:border-blue-600 placeholder-gray-400"
          placeholder="e.g. React, Node.js, Python"
        />
        {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>}
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="file">Upload CV (PDF, DOCX, DOC, max 5MB) *</label>
        <input
          id="file"
          type="file"
          accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
          {...register('file', { validate: validateFile })}
          className="file-input file-input-bordered w-full text-gray-900 border-2 border-gray-400 focus:border-blue-600 placeholder-gray-400"
        />
        {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file.message as string}</p>}
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
}; 