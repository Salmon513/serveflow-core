import { Injectable } from '@nestjs/common';

interface HealthStatus {
  status: 'ok';
}

@Injectable()
export class HealthService {
  check(): HealthStatus {
    return { status: 'ok' };
  }
}
