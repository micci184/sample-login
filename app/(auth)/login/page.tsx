"use client";

import { useState, useRef, FormEvent } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Input, Button, Checkbox } from "@/components/ui";
import { BuildingIcon } from "@/components/ui/BuildingIcon";
import { loginSchema, type LoginInput, type ErrorResponse } from "@/lib/schemas/auth";

export default function LoginPage() {
  // フォーム状態
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  // UI状態
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  const [apiError, setApiError] = useState<string>("");
  
  // ref for focus management
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setApiError("");
    
    // Zodバリデーション
    const result = loginSchema.safeParse({ email, password, rememberMe });
    
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginInput, string>> = {};
      
      // 最初のエラーを各フィールドに設定
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginInput;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      
      setErrors(fieldErrors);
      
      // 最初の無効フィールドにフォーカス
      if (fieldErrors.email) {
        emailRef.current?.focus();
      } else if (fieldErrors.password) {
        passwordRef.current?.focus();
      }
      
      return;
    }
    
    // API呼び出し
    setLoading(true);
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // ログイン成功
        console.log("ログイン成功:", data.user);
        // TODO: リダイレクトや状態管理の実装（将来のIssue）
        alert(`ログインに成功しました\n\nユーザー: ${data.user.name}\nEmail: ${data.user.email}`);
      } else {
        // ログイン失敗
        const errorData = data as ErrorResponse;
        setApiError(errorData.message);
        
        // メールアドレスフィールドにフォーカス
        emailRef.current?.focus();
      }
    } catch (error) {
      console.error("ログインエラー:", error);
      setApiError("ネットワークエラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="w-full" style={{ maxWidth: '448px' }}>
        {/* ヘッダー */}
        <div className="flex flex-col items-center">
          {/* アイコン背景 */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#155DFC]">
            <BuildingIcon />
          </div>
          
          {/* タイトル */}
          <div className="mt-4 text-center">
            <h1 className="text-2xl font-semibold leading-[1.33] text-[#101828]" style={{ fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              HR Management System
            </h1>
          </div>
          
          {/* サブタイトル */}
          <div className="mt-6 text-center">
            <p className="text-base font-light leading-[1.5] text-[#4A5565]" style={{ fontFamily: 'Hiragino Kaku Gothic ProN, sans-serif' }}>
              人事労務管理システムにログイン
            </p>
          </div>
        </div>

        {/* ログインカード */}
        <div className="mt-8 rounded-[10px] bg-white px-6 pb-4 pt-6 shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]">
          {/* カード見出し */}
          <h2 className="mb-8 text-center text-xl font-light leading-[1.4] text-[#101828]" style={{ fontFamily: 'Hiragino Kaku Gothic ProN, sans-serif' }}>
            ログイン
          </h2>

          {/* APIエラーメッセージ */}
          {apiError && (
            <div
              role="alert"
              className="rounded-md bg-red-50 p-3 text-sm text-red-800"
              style={{ fontFamily: 'Hiragino Kaku Gothic ProN, sans-serif' }}
            >
              {apiError}
            </div>
          )}

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* メールアドレス */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="block text-sm font-light leading-[1.43] text-[#364153]"
                style={{ fontFamily: 'Hiragino Kaku Gothic ProN, sans-serif' }}
              >
                メールアドレス
              </label>
              <Input
                ref={emailRef}
                id="email"
                type="email"
                placeholder="your-email@company.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                errorId="email-error"
                disabled={loading}
                autoComplete="email"
              />
              {errors.email && (
                <p
                  id="email-error"
                  role="alert"
                  className="text-sm text-red-600"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* パスワード */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="block text-sm font-light leading-[1.43] text-[#364153]"
                style={{ fontFamily: 'Hiragino Kaku Gothic ProN, sans-serif' }}
              >
                パスワード
              </label>
              <div className="relative">
                <Input
                  ref={passwordRef}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="パスワードを入力"
                  icon={Lock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  errorId="password-error"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#99A1AF] hover:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#155DFC] focus:ring-offset-2 disabled:opacity-50"
                  disabled={loading}
                  aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="text-sm text-red-600"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* ログイン状態を保持 & パスワードを忘れた */}
            <div className="flex items-center justify-between">
              <Checkbox
                id="remember-me"
                label="ログイン状態を保持する"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <a
                href="#"
                className="text-sm font-light text-[#155DFC] hover:underline focus:outline-none focus:ring-2 focus:ring-[#155DFC] focus:ring-offset-2"
                style={{ fontFamily: 'Hiragino Kaku Gothic ProN, sans-serif' }}
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Issue #10 でパスワード再設定実装
                  alert("TODO: パスワード再設定機能（別Issue）");
                }}
              >
                パスワードを忘れた方
              </a>
            </div>

            {/* ログインボタン */}
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full"
            >
              ログイン
            </Button>
          </form>

          {/* 区切り線（または） */}
          <div className="relative my-6">
            <div className="w-full border-t border-[#D1D5DC]"></div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4">
              <span className="text-sm font-light text-[#6A7282]" style={{ fontFamily: 'Hiragino Kaku Gothic ProN, sans-serif' }}>
                または
              </span>
            </div>
          </div>

          {/* デモアカウントでログイン */}
          <div className="text-center">
            <a
              href="#"
              className="text-sm font-light text-[#6A7282] hover:underline focus:outline-none focus:ring-2 focus:ring-[#155DFC] focus:ring-offset-2"
              style={{ fontFamily: 'Hiragino Kaku Gothic ProN, sans-serif' }}
              onClick={(e) => {
                e.preventDefault();
                // TODO: 別Issueでデモアカウント実装
                alert("TODO: デモアカウント機能（別Issue）");
              }}
            >
              デモアカウントでログイン
            </a>
          </div>
        </div>

        {/* カード外のサポート案内 */}
        <div className="mt-4 text-center text-xs font-light text-[#6A7282]" style={{ fontFamily: 'Hiragino Kaku Gothic ProN, sans-serif' }}>
          <p>
            お困りの場合は、システム管理者にお問い合わせください。
          </p>
        </div>
      </div>
    </div>
  );
}
