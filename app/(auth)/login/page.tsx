"use client";

import { useState, useRef, FormEvent } from "react";
import { Building2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Input, Button, Checkbox } from "@/components/ui";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth";

export default function LoginPage() {
  // フォーム状態
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  // UI状態
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  
  // ref for focus management
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
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
    
    // TODO: Issue #4 でAPI呼び出し実装
    setLoading(true);
    console.log("ログイン試行:", result.data);
    
    // モックローディング
    setTimeout(() => {
      setLoading(false);
      alert("TODO: API実装待ち（Issue #4）");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-[448px]">
        {/* ヘッダー */}
        <div className="flex flex-col items-center gap-8">
          {/* アイコン背景 */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#155DFC] p-4">
            <Building2 className="h-8 w-8 text-white" strokeWidth={2.67} />
          </div>
          
          {/* タイトル */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold leading-[1.33] text-[#101828]">
              HR Management System
            </h1>
          </div>
          
          {/* サブタイトル */}
          <div className="text-center">
            <p className="text-base font-light leading-[1.5] text-[#4A5565]">
              人事労務管理システムにログイン
            </p>
          </div>
        </div>

        {/* ログインカード */}
        <div className="mt-8 rounded-[10px] bg-white px-6 pb-4 pt-6 shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]">
          {/* カード見出し */}
          <h2 className="mb-8 text-center text-xl font-light leading-[1.4] text-[#101828]">
            ログイン
          </h2>

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* メールアドレス */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-light leading-[1.43] text-[#364153]"
              >
                メールアドレス
              </label>
              <Input
                ref={emailRef}
                id="email"
                type="email"
                placeholder="メールアドレスを入力"
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
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-light leading-[1.43] text-[#364153]"
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
            <div className="flex items-center justify-between py-2">
              <Checkbox
                id="remember-me"
                label="ログイン状態を保持する"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <a
                href="#"
                className="text-sm font-light text-[#6A7282] hover:underline focus:outline-none focus:ring-2 focus:ring-[#155DFC] focus:ring-offset-2"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Issue #10 でパスワード再設定実装
                  alert("TODO: パスワード再設定機能（別Issue）");
                }}
              >
                パスワードをお忘れの方
              </a>
            </div>

            {/* ログインボタン */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full"
              >
                ログイン
              </Button>
            </div>
          </form>

          {/* 区切り線 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#D1D5DC]"></div>
            </div>
          </div>

          {/* 初めてご利用の方 */}
          <div className="text-center">
            <a
              href="#"
              className="text-sm font-light text-[#6A7282] hover:underline focus:outline-none focus:ring-2 focus:ring-[#155DFC] focus:ring-offset-2"
              onClick={(e) => {
                e.preventDefault();
                // TODO: 別Issueで新規登録実装
                alert("TODO: 新規登録機能（別Issue）");
              }}
            >
              初めてご利用の方
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
