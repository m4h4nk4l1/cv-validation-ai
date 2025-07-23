"use client";
import React, { useState } from 'react';
import { CVForm } from '@/components/forms/CVForm';
import { ValidationResults } from '@/components/results/ValidationResults';
import { SuccessMessage } from '@/components/results/SuccessMessage';
import { ErrorMessage } from '@/components/results/ErrorMessage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CVFormSchema } from '@/utils/validation';
import { ValidationResult } from '@/types/forms';
import axios from 'axios';
import { trpc } from '@/utils/trpc';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const createUser = trpc.user.createUser.useMutation();
  const validateCV = trpc.validation.validateCV.useMutation();

  const handleSubmit = async (data: CVFormSchema) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSuccess(null);
    try {
      // 1. Create user via tRPC
      const user = await createUser.mutateAsync({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        yearsExperience: data.yearsExperience,
        skills: data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      });
      if (!user?.id) throw new Error('User creation failed');

      // 2. Upload file (still use axios)
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('file', data.file[0]);
      const uploadRes = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const upload = uploadRes.data;
      if (!upload?.filePath) throw new Error('File upload failed');

      // 3. Validate CV via tRPC (use extracted pdfText from backend)
      const validation = await validateCV.mutateAsync({
        formData: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          yearsExperience: data.yearsExperience,
          skills: data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        },
        pdfText: upload.pdfText || '',
      });
      setResult(validation);
      if (validation.isValid) setSuccess('Your CV was validated successfully!');
    } catch (err: unknown) {
      let errorMsg = 'An error occurred';
      if (typeof err === 'object' && err !== null) {
        if ('message' in err && typeof (err as any).message === 'string') {
          errorMsg = (err as any).message;
        } else if ('data' in err && (err as any).data?.zodError) {
          errorMsg = JSON.stringify((err as any).data.zodError.issues || (err as any).data.zodError);
        }
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-200 py-10">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 drop-shadow">CV Validation App</h1>
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}
      {loading && <LoadingSpinner />}
      {!result && <CVForm onSubmit={handleSubmit} isLoading={loading} />}
      {result && <ValidationResults result={result} />}
    </main>
  );
}
