export interface HealthResponse {
  status: 'ok';
  db?: 'connected' | 'disconnected' | 'not configured';
}
