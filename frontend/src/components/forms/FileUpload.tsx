import React, { useRef } from 'react';

interface FileUploadProps {
  onFileChange: (file: FileList | null) => void;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, error }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`border-2 border-dashed rounded p-4 text-center cursor-pointer ${error ? 'border-red-500' : 'border-gray-300'}`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={handleClick}
    >
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => onFileChange(e.target.files)}
      />
      <p>Drag and drop your PDF here, or click to select a file</p>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}; 