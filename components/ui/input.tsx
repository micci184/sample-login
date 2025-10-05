import React from "react";
import { LucideIcon } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * 左側に表示するアイコン
   */
  icon?: LucideIcon;
  /**
   * エラー状態
   */
  error?: boolean;
  /**
   * エラーメッセージID（aria-describedby用）
   */
  errorId?: string;
}

/**
 * Input コンポーネント
 * 
 * Figma仕様:
 * - 高さ: 43px (email), 48px (password)
 * - ボーダー: 1px, #D1D5DC
 * - アイコン: 20x20px, #99A1AF
 * - パディング: 左12px（アイコン部分）
 * - フォント: SF Pro Text 16px
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", icon: Icon, error, errorId, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {/* アイコン（左側） */}
        {Icon && (
          <div className="absolute left-0 top-0 h-full flex items-center pl-[12px] pointer-events-none">
            <Icon className="w-5 h-5" style={{ color: "var(--color-icon)" }} />
          </div>
        )}

        {/* 入力フィールド */}
        <input
          ref={ref}
          className={`
            w-full
            h-[43px]
            px-[13px]
            ${Icon ? "pl-[41px]" : ""}
            border
            rounded-none
            text-base
            font-normal
            leading-[1.19]
            placeholder:opacity-50
            focus:outline-none
            focus:ring-2
            focus:ring-offset-0
            disabled:opacity-50
            disabled:cursor-not-allowed
            ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-[var(--color-primary)]"
            }
            ${className}
          `}
          style={{
            borderColor: error ? undefined : "var(--color-border)",
            color: "var(--color-text-heading)",
            fontFamily:
              "SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif",
          }}
          aria-invalid={error}
          aria-describedby={errorId}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
