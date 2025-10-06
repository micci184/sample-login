import { NextRequest, NextResponse } from "next/server";
import {
  loginSchema,
  ErrorCode,
  type LoginSuccessResponse,
  type ErrorResponse,
} from "@/lib/schemas/auth";

/**
 * ログインAPI（モック実装）
 * 
 * POST /api/auth/login
 * 
 * ## 実装内容
 * - Zodバリデーション
 * - モック認証ロジック
 * - ステータスコード: 200, 400, 401, 423
 * 
 * ## モック認証ルール
 * - email: test@example.com, password: password123 → 成功
 * - email: locked@example.com → アカウントロック
 * - その他 → 認証失敗
 * 
 * @see openapi.yaml#/paths/~1api~1auth~1login/post
 */
export async function POST(request: NextRequest) {
  try {
    // リクエストボディを取得
    const body = await request.json();

    // Zodバリデーション
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      // バリデーションエラー
      const firstError = result.error.issues[0];
      const errorResponse: ErrorResponse = {
        success: false,
        message: firstError.message,
        code: ErrorCode.VALIDATION_ERROR,
      };

      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { email, password, rememberMe } = result.data;

    // モック認証ロジック
    // 本番環境では実際の認証処理を実装

    // ケース1: アカウントロック
    if (email === "locked@example.com") {
      const errorResponse: ErrorResponse = {
        success: false,
        message: "アカウントがロックされています。サポートにお問い合わせください。",
        code: ErrorCode.ACCOUNT_LOCKED,
      };

      return NextResponse.json(errorResponse, { status: 423 });
    }

    // ケース2: 認証成功（テストユーザー）
    if (email === "test@example.com" && password === "password123") {
      const successResponse: LoginSuccessResponse = {
        success: true,
        message: "ログインに成功しました",
        user: {
          id: "user_12345",
          email: email,
          name: "テストユーザー",
          createdAt: new Date().toISOString(),
        },
      };

      // rememberMeの処理（将来的にCookie設定など）
      // console.log("rememberMe:", rememberMe);

      return NextResponse.json(successResponse, { status: 200 });
    }

    // ケース3: 認証失敗（無効な認証情報）
    const errorResponse: ErrorResponse = {
      success: false,
      message: "メールアドレスまたはパスワードが正しくありません",
      code: ErrorCode.INVALID_CREDENTIALS,
    };

    return NextResponse.json(errorResponse, { status: 401 });
  } catch (error) {
    // 予期しないエラー
    console.error("Login API Error:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      message: "サーバーエラーが発生しました",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
