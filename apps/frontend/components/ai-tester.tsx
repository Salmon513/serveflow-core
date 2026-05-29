'use client';

import { useEffect, useState } from 'react';
import type {
  ApiResponse,
  BookingIntentRequest,
  BookingIntentResponse,
  FaqRequest,
  FaqResponse,
  HealthResponse,
} from '@serveflow/shared';

const DEFAULT_API_BASE_URL = 'http://localhost:3000';

async function postJson<TResponse>(
  baseUrl: string,
  path: string,
  body: unknown,
): Promise<TResponse> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json()) as TResponse;

  if (!response.ok) {
    throw new Error(JSON.stringify(payload));
  }

  return payload;
}

export function AiTester() {
  const [apiBaseUrl, setApiBaseUrl] = useState(DEFAULT_API_BASE_URL);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);

  const [faqInput, setFaqInput] = useState<FaqRequest>({
    question: 'Do you have vegan options available for dinner?',
    restaurantContext:
      'We are a casual restaurant open daily from 12:00 to 22:00.',
    menuContext:
      'Available vegan items: grilled vegetable bowl, tomato pasta, chickpea salad.',
  });
  const [faqResponse, setFaqResponse] = useState<ApiResponse<FaqResponse> | null>(
    null,
  );
  const [faqError, setFaqError] = useState<string | null>(null);
  const [faqLoading, setFaqLoading] = useState(false);

  const [bookingInput, setBookingInput] = useState<BookingIntentRequest>({
    message:
      'Hi, this is John. I need a table for 4 tomorrow night. A quiet corner would be great.',
    referenceDate: '2026-05-28',
    timezone: 'Asia/Kolkata',
  });
  const [bookingResponse, setBookingResponse] =
    useState<ApiResponse<BookingIntentResponse> | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadHealth() {
      setHealthError(null);

      try {
        const response = await fetch(`${apiBaseUrl}/health`);
        if (!response.ok) {
          throw new Error(`Health check failed with status ${response.status}`);
        }

        const payload = (await response.json()) as HealthResponse;
        if (active) {
          setHealth(payload);
        }
      } catch (error) {
        if (active) {
          setHealth(null);
          setHealthError(error instanceof Error ? error.message : 'Unknown error');
        }
      }
    }

    void loadHealth();

    return () => {
      active = false;
    };
  }, [apiBaseUrl]);

  async function submitFaq() {
    setFaqLoading(true);
    setFaqError(null);

    try {
      const payload = await postJson<ApiResponse<FaqResponse>>(
        apiBaseUrl,
        '/ai/faq',
        faqInput,
      );
      setFaqResponse(payload);
    } catch (error) {
      setFaqResponse(null);
      setFaqError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setFaqLoading(false);
    }
  }

  async function submitBookingIntent() {
    setBookingLoading(true);
    setBookingError(null);

    try {
      const payload = await postJson<ApiResponse<BookingIntentResponse>>(
        apiBaseUrl,
        '/ai/booking-intent',
        bookingInput,
      );
      setBookingResponse(payload);
    } catch (error) {
      setBookingResponse(null);
      setBookingError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setBookingLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 text-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Phase 7
          </p>
          <h1 className="mt-2 text-3xl font-semibold">ServeFlow AI Foundation</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">
            Minimal operator UI for testing the first structured AI endpoints:
            FAQ answering and booking intent extraction.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Connection</h2>
            <label className="mt-4 block text-sm font-medium text-gray-700">
              Backend API Base URL
            </label>
            <input
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
              value={apiBaseUrl}
              onChange={(event) => setApiBaseUrl(event.target.value)}
            />

            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-700">Health</p>
              <p className="mt-2 text-sm text-gray-600">
                {health
                  ? `Backend ${health.status} / DB ${health.db ?? 'unknown'}`
                  : healthError ?? 'Checking backend...'}
              </p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">FAQ Tester</h2>
              <div className="mt-4 space-y-4">
                <textarea
                  className="min-h-28 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                  value={faqInput.question}
                  onChange={(event) =>
                    setFaqInput((current) => ({
                      ...current,
                      question: event.target.value,
                    }))
                  }
                />
                <textarea
                  className="min-h-24 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                  value={faqInput.restaurantContext ?? ''}
                  onChange={(event) =>
                    setFaqInput((current) => ({
                      ...current,
                      restaurantContext: event.target.value,
                    }))
                  }
                />
                <textarea
                  className="min-h-24 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                  value={faqInput.menuContext ?? ''}
                  onChange={(event) =>
                    setFaqInput((current) => ({
                      ...current,
                      menuContext: event.target.value,
                    }))
                  }
                />
                <button
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                  disabled={faqLoading}
                  onClick={() => void submitFaq()}
                >
                  {faqLoading ? 'Generating...' : 'Run FAQ'}
                </button>
                <pre className="overflow-x-auto rounded-xl bg-gray-950 p-4 text-xs text-gray-100">
                  {faqError
                    ? faqError
                    : JSON.stringify(faqResponse, null, 2) ?? 'No response yet.'}
                </pre>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Booking Intent Tester</h2>
              <div className="mt-4 space-y-4">
                <textarea
                  className="min-h-28 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                  value={bookingInput.message}
                  onChange={(event) =>
                    setBookingInput((current) => ({
                      ...current,
                      message: event.target.value,
                    }))
                  }
                />
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                  value={bookingInput.referenceDate ?? ''}
                  onChange={(event) =>
                    setBookingInput((current) => ({
                      ...current,
                      referenceDate: event.target.value,
                    }))
                  }
                />
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                  value={bookingInput.timezone ?? ''}
                  onChange={(event) =>
                    setBookingInput((current) => ({
                      ...current,
                      timezone: event.target.value,
                    }))
                  }
                />
                <button
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                  disabled={bookingLoading}
                  onClick={() => void submitBookingIntent()}
                >
                  {bookingLoading ? 'Extracting...' : 'Run Booking Intent'}
                </button>
                <pre className="overflow-x-auto rounded-xl bg-gray-950 p-4 text-xs text-gray-100">
                  {bookingError
                    ? bookingError
                    : JSON.stringify(bookingResponse, null, 2) ??
                      'No response yet.'}
                </pre>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
