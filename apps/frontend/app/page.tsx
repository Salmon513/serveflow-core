import type { HealthResponse } from '@serveflow/shared';

// Phase 6: replace with live API data from GET /health
const systemStatus: HealthResponse | null = null;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-lg w-full space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ServeFlow</h1>
          <p className="mt-2 text-gray-500">
            AI-powered restaurant operations platform
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-700">System Status</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gray-300" />
            <span className="text-sm text-gray-500">
              Backend — {systemStatus?.status ?? 'not connected'}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
