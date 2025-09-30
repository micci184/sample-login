---
trigger: always_on
---

## 重要：使用バージョン

- **Tailwind CSS v4.1+（設定ファイル不要）**
- **Next.js 15（App Router）**
- **React 19**
- Zod 4.1.11

## Tailwind v4 の注意事項

- tailwind.config.ts/js は作成しない
- @import "tailwindcss" を使用
- CSS 内で設定を行う

## ページ構築ルール

- 既存のコンポーネントは削除しない
- 新規コンポーネントは適切な位置に追加
- TODO コメントで未実装部分を明示
- コンポーネント追加時は必ず git diff で確認
