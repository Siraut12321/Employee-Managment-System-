'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center p-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="text-muted-foreground max-w-sm text-sm">{error.message || 'An unexpected error occurred.'}</p>
          </div>
          <Button onClick={reset}>Try again</Button>
        </div>
      </body>
    </html>
  );
}
