export interface BaseResponseService<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  message?: string | null;
  statusCode: number;
  meta?: {
    requestId: string;
    timestamp: string;
  };
}
