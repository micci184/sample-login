import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * ローディング状態
   */
  loading?: boolean;
  /**
   * ボタンのバリアント
   */
  variant?: "primary" | "secondary";
}

/**
 * Button コンポーネント
 * 
 * Figma仕様:
 * - フォント: Hiragino Kaku Gothic ProN, 16px, weight 300
 * - パディング: 適切な内部余白
 * - プライマリカラー: #155DFC
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", loading = false, variant = "primary", children, disabled, ...props },
    ref
  ) => {
    const baseStyles = `
      w-full
      px-4
      py-3
      text-base
      font-light
      leading-6
      rounded-[10px]
      transition-colors
      focus:outline-none
      focus:ring-2
      focus:ring-offset-2
      disabled:opacity-50
      disabled:cursor-not-allowed
    `;

    const variantStyles = {
      primary: `
        text-white
        focus:ring-[var(--color-primary)]
        ${
          !disabled && !loading
            ? "hover:opacity-90"
            : ""
        }
      `,
      secondary: `
        bg-white
        border
        text-[var(--color-text-heading)]
        focus:ring-gray-300
        ${
          !disabled && !loading
            ? "hover:bg-gray-50"
            : ""
        }
      `,
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        style={
          variant === "primary"
            ? {
                backgroundColor: "var(--color-primary)",
                fontFamily: "Hiragino Kaku Gothic ProN, sans-serif",
                fontWeight: 300,
              }
            : {
                borderColor: "var(--color-border)",
                fontFamily: "Hiragino Kaku Gothic ProN, sans-serif",
                fontWeight: 300,
              }
        }
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{children}</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
