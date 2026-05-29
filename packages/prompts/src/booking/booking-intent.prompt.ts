import type { PromptDefinition } from '../types';
import { BASE_JSON_CONSTRAINTS } from '../shared/constraints';

export const BOOKING_INTENT_PROMPT: PromptDefinition = {
  name: 'booking-intent',
  systemRole: 'Restaurant booking intent extraction engine',
  instructions: [
    'Decide whether the message is a booking request.',
    'Extract only information explicitly present or safely inferable from the message and reference date.',
    'Normalize any resolved booking date into an ISO string.',
    'Return ONLY valid JSON.',
  ],
  expectedJsonStructure: [
    '{',
    '  "intent": "booking",',
    '  "customerName": "string|null",',
    '  "partySize": "number|null",',
    '  "bookingDate": "ISO string|null",',
    '  "specialRequests": "string|null",',
    '  "confidence": 0.0',
    '}',
  ],
  constraints: [
    ...BASE_JSON_CONSTRAINTS,
    'Do not invent missing names, dates, or party sizes.',
    'Use null for any field that cannot be determined confidently.',
    'Set intent to "booking" only when the message is clearly a booking request.',
  ],
};
