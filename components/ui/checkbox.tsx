import React from "react";
import { Check } from "lucide-react";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /**
   * ラベルテキスト
   */
  label?: string;
}

/**
 * Checkbox コンポーネント
 * 
 * Figma仕様:
 * - サイズ: 16x16px
 * - ボーダー: 1px, #767676
 * - ラベル: Hiragino Kaku Gothic ProN, 14px
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || `checkbox-${generatedId}`;

    return (
      <div className="flex items-center">
        <div className="relative inline-flex items-center">
          {/* 隠しチェックボックス（アクセシビリティ用） */}
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className="sr-only peer"
            {...props}
          />

          {/* カスタムチェックボックス */}
          <label
            htmlFor={checkboxId}
            className={`
              w-4
              h-4
              border
              rounded-none
              cursor-pointer
              flex
              items-center
              justify-center
              transition-colors
              peer-checked:bg-[var(--color-primary)]
              peer-checked:border-[var(--color-primary)]
              peer-focus:ring-2
              peer-focus:ring-offset-2
              peer-focus:ring-[var(--color-primary)]
              peer-disabled:opacity-50
              peer-disabled:cursor-not-allowed
              ${className}
            `}
            style={{
              borderColor: "var(--color-border)",
            }}
          >
            {/* チェックマーク */}
            <Check
              className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
              strokeWidth={3}
            />
          </label>
        </div>

        {/* ラベル */}
        {label && (
          <label
            htmlFor={checkboxId}
            className="ml-2 text-sm font-light leading-5 cursor-pointer select-none"
            style={{
              color: "var(--color-text-label)",
              fontFamily: "Hiragino Kaku Gothic ProN, sans-serif",
              fontWeight: 300,
            }}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
