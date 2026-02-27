import { z } from 'zod';

export interface ApiMeta {
  page?: number;
  pageSize?: number;
  total?: number;
  totalPage?: number;
  timestamp?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export const ApiResponseZod = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error:z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
    }).optional(),
  meta: z.object({
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
    totalPage: z.number(),
    timestamp: z.string().optional(),
  }).optional()})



export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const;

export type HttpStatusCode = (typeof HttpStatus)[keyof typeof HttpStatus];

// export class ApiSuccessResponse<T = any, M = ApiMeta> implements ApiResponse<T> {
//   success = true;
//   data: T;
//   meta?: M;
//   error?: ApiError;

//   constructor(data: T, meta?: M) {
//     this.data = data;
//     if (meta) {
//       this.meta = meta;
//     }
//   }
// }

// export class ApiErrorResponse implements ApiResponse {
//   success = false;
//   data?: any;
//   error: ApiError;
//   meta?: ApiMeta;

//   constructor(code: string, message: string, details?: any) {
//     this.error = { code, message, details };
//   }

