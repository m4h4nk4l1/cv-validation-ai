"use client";
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useRef } from 'react';
// Make sure this path matches where you export AppRouter in your backend
import type { AppRouter } from '../../../backend/src/routers';

export const trpc = createTRPCReact<AppRouter>();

export function getBaseUrl() {
  // Always use the env variable, even in the browser
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClientRef = useRef<QueryClient>(new QueryClient());
  const trpcClientRef = useRef<ReturnType<typeof trpc.createClient>>(trpc.createClient({
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/trpc`,
      }),
    ],
  }));
  return (
    <trpc.Provider client={trpcClientRef.current} queryClient={queryClientRef.current}>
      <QueryClientProvider client={queryClientRef.current}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
} 