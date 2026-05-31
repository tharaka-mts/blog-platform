export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    pageSize: number;
  };
  errors?: { msg: string; path: string }[];
}
