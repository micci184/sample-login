import { z } from "zod";

/**
 * ログインリクエストスキーマ
 * OpenAPI定義の LoginRequest と完全に整合
 *
 * @see openapi.yaml#/components/schemas/LoginRequest
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email("有効なメールアドレスを入力してください")
    .min(3, "メールアドレスは3文字以上である必要があります")
    .max(255, "メールアドレスは255文字以内である必要があります"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上である必要があります")
    .max(128, "パスワードは128文字以内である必要があります"),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * ユーザースキーマ
 * OpenAPI定義の User と完全に整合
 *
 * @see openapi.yaml#/components/schemas/User
 */
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  createdAt: z.string().datetime().optional(),
});

export type User = z.infer<typeof userSchema>;

/**
 * ログイン成功レスポンススキーマ
 * OpenAPI定義の LoginSuccessResponse と完全に整合
 *
 * @see openapi.yaml#/components/schemas/LoginSuccessResponse
 */
export const loginSuccessResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  user: userSchema,
});

export type LoginSuccessResponse = z.infer<typeof loginSuccessResponseSchema>;

/**
 * エラーコード enum
 * OpenAPI定義の ErrorResponse.code と完全に整合
 */
export const ErrorCode = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  ACCOUNT_LOCKED: "ACCOUNT_LOCKED",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * エラーレスポンススキーマ
 * OpenAPI定義の ErrorResponse と完全に整合
 *
 * @see openapi.yaml#/components/schemas/ErrorResponse
 */
export const errorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  code: z
    .enum([
      ErrorCode.VALIDATION_ERROR,
      ErrorCode.INVALID_CREDENTIALS,
      ErrorCode.ACCOUNT_LOCKED,
      ErrorCode.RATE_LIMIT_EXCEEDED,
    ])
    .optional(),
  details: z.record(z.string(), z.any()).optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
