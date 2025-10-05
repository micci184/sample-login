# HR Management System - Login

人事労務管理システムのログイン機能実装プロジェクト

## 技術スタック

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS v4.1+** (設定ファイル不要、@import方式)
- **TypeScript**
- **Zod 4.1.11** (バリデーション)
- **Lucide React** (アイコン)

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバー起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

### 3. ビルド

```bash
npm run build
```

### 4. 型チェック

```bash
npm run type-check
```

### 5. Lint

```bash
npm run lint
```

## プロジェクト構造

```
sample-login/
├── app/
│   ├── (auth)/
│   │   └── login/          # ログインページ
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # ホームページ
│   └── globals.css         # Tailwind v4設定
├── components/
│   └── ui/                 # UIコンポーネント
├── lib/
│   └── schemas/            # Zodスキーマ
│       └── auth.ts         # 認証関連スキーマ
├── openapi.yaml            # API仕様
└── package.json
```

## Tailwind v4 の注意事項

- `tailwind.config.ts/js` は作成しない
- `@import "tailwindcss"` を使用
- CSS内で設定を行う（`app/globals.css`参照）

## 開発ルール

詳細は `.windsurf/rules/` を参照：

- `project-rule.md` - プロジェクト全体のルール
- `coding-rule.md` - コーディング規約

## API仕様

### OpenAPI定義

API仕様は `openapi.yaml` に定義されています。

#### 📖 仕様の確認方法

**1. Swagger EditorでYAMLを開く**
```bash
# オンラインエディタにコピー＆ペースト
https://editor.swagger.io/
```

**2. VS Code拡張機能を使用**
- [OpenAPI (Swagger) Editor](https://marketplace.visualstudio.com/items?itemName=42Crunch.vscode-openapi)
- `openapi.yaml` を開いてプレビュー

**3. Redocでドキュメント生成**
```bash
npx @redocly/cli build-docs openapi.yaml
```

### スキーマと型定義の整合性

OpenAPI定義とZodスキーマは完全に整合しています：

| OpenAPI Schema | Zod Schema | TypeScript Type |
|---------------|------------|-----------------|
| `LoginRequest` | `loginSchema` | `LoginInput` |
| `User` | `userSchema` | `User` |
| `LoginSuccessResponse` | `loginSuccessResponseSchema` | `LoginSuccessResponse` |
| `ErrorResponse` | `errorResponseSchema` | `ErrorResponse` |

詳細は `lib/schemas/auth.ts` を参照してください。

### エンドポイント一覧

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | ログイン認証 |

### レスポンス例

**成功時 (200)**
```json
{
  "success": true,
  "message": "ログインに成功しました",
  "user": {
    "id": "user_12345",
    "email": "user@example.com"
  }
}
```

**エラー時 (401)**
```json
{
  "success": false,
  "message": "メールアドレスまたはパスワードが正しくありません",
  "code": "INVALID_CREDENTIALS"
}
```

## Issues

実装状況は [GitHub Issues](https://github.com/micci184/sample-login/issues) を参照