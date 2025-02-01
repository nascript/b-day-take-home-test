export interface ApiResponse<T> {
  status: string;
  code: number;
  message: string;
  data?: T;
}

export interface Pagination {
  page: number;
  total: number;
  per_page: number;
  total_page: number;
}

export function successResponse<T>(
  message: string,
  data?: T,
  code: number = 200
): ApiResponse<T> {
  return {
    status: "success",
    code,
    message,
    data,
  };
}

export function errorResponse(
  message: string,
  code: number = 500
): ApiResponse<null> {
  return {
    status: "error",
    code,
    message,
    data: null,
  };
}

export function paginatedResponse<T>(
  message: string,
  list: T[],
  pagination: Pagination,
  code: number = 200
): ApiResponse<{ list: T[]; pagination: Pagination }> {
  return {
    status: "success",
    code,
    message,
    data: {
      list,
      pagination,
    },
  };
}
