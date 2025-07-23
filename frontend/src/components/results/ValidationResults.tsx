import React from 'react';
import { ValidationResult } from '@/types/forms';

interface ValidationResultsProps {
  result: ValidationResult;
}

export const ValidationResults: React.FC<ValidationResultsProps> = ({ result }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-6 max-w-xl mx-auto mt-8 text-gray-900">
      <h2 className={`text-2xl font-bold mb-4 ${result.isValid ? 'text-green-600' : 'text-red-600'}`}>{result.isValid ? 'CV Validated Successfully!' : 'Validation Failed'}</h2>
      <p className="mb-2">Confidence Score: <span className="font-semibold">{(result.confidenceScore * 100).toFixed(1)}%</span></p>
      <p className="mb-4">{result.summary}</p>
      {result.mismatchedFields.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Mismatched Fields:</h3>
          <ul className="list-disc pl-6">
            {result.mismatchedFields.map((field, idx) => (
              <li key={idx} className="mb-1">
                <span className="font-medium">{field.fieldName}:</span> <span className="text-red-600">{field.reason}</span> (Form: <span className="font-mono">{field.formValue}</span>, CV: <span className="font-mono">{field.pdfValue ?? 'N/A'}</span>, Confidence: {(field.confidence * 100).toFixed(1)}%)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}; 