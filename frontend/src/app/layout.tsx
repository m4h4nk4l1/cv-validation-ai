import './globals.css';
import React from 'react';
import { TRPCProvider } from '@/utils/trpc';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-50 min-h-screen">
        <TRPCProvider>
          {children}
        </TRPCProvider>
      </body>
    </html>
  );
}
