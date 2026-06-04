import { Injectable } from '@nestjs/common';
import type { WorkflowType } from '@serveflow/shared';

const BOOKING_KEYWORDS = [
  'book',
  'reserve',
  'reservation',
  'table',
  'seats',
  'party of',
  'tonight',
  'tomorrow',
  'dinner',
  'lunch',
  'people',
  'guests',
];

const HANDOFF_KEYWORDS = [
  'speak to',
  'talk to',
  'manager',
  'supervisor',
  'complaint',
  'urgent',
  'human',
  'person',
  'problem',
  'issue',
];

@Injectable()
export class WorkflowRouter {
  route(message: string): WorkflowType {
    const lower = message.toLowerCase();

    if (HANDOFF_KEYWORDS.some((kw) => lower.includes(kw))) {
      return 'human_handoff';
    }

    if (BOOKING_KEYWORDS.some((kw) => lower.includes(kw))) {
      return 'booking';
    }

    return 'faq';
  }
}
