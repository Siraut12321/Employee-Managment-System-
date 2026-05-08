import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center p-4">
      <div className="space-y-2">
        <h1 className="text-8xl font-bold text-muted-foreground/30">404</h1>
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <p className="text-muted-foreground max-w-sm">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 h-8 text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
