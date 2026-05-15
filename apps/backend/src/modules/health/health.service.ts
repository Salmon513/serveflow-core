import { Injectable } from '@nestjs/common';
import { HealthResponse } from '@serveflow/shared';

@Injectable()
export class HealthService {
  check(): HealthResponse {
    return { status: 'ok' };
  }
}
