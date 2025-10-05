# HR Management System - Login

人事労務管理システムのログイン機能実装プロジェクト

## 技術スタック

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS v4.1+** (設定ファイル不要、@import方式)
- **TypeScript**
- **Zod 4.1.11** (バリデーション)
- **Lucide React** (アイコン)
- **Storybook 9** (コンポーネント開発環境)

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

### 6. Storybook起動

```bash
npm run storybook
```

コンポーネントカタログが [http://localhost:6006](http://localhost:6006) で起動します。

### 7. Prismモックサーバー起動

```bash
npm run mock
```

モックAPIサーバーが [http://localhost:4010](http://localhost:4010) で起動します。

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

## Prismモックサーバー

### 🎯 概要

PrismはOpenAPI定義から自動でモックAPIサーバーを生成するツールです。  
コード実装なしで、`openapi.yaml`に定義されたエンドポイントが即座に動作します。

### 🚀 使用方法

#### 基本的な起動

```bash
npm run mock
```

- デフォルトポート: `http://localhost:4010`
- OpenAPI定義の`examples`に基づいたレスポンスを返却
- リクエストのバリデーション自動実行

#### 動的レスポンス生成

```bash
npm run mock:dynamic
```

- `-d`フラグで動的にランダムなデータを生成
- テストデータのバリエーションを増やしたい場合に有用

#### ポート指定

```bash
npm run mock:port
```

- ポート4010を明示的に指定
- 環境変数`NEXT_PUBLIC_MOCK_API_URL`と一致

### 📝 開発ワークフロー

**推奨: 2つのターミナルで並行実行**

```bash
# ターミナル1: Next.js開発サーバー
npm run dev
# → http://localhost:3000

# ターミナル2: Prismモックサーバー
npm run mock
# → http://localhost:4010
```

フロントエンドから`http://localhost:4010/api/auth/login`にリクエストを送信できます。

### 🧪 動作確認

#### ログインAPI（成功）

```bash
curl -X POST http://localhost:4010/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "rememberMe": false
  }'
```

**レスポンス:**
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

#### バリデーションエラー（400）

```bash
curl -X POST http://localhost:4010/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "short"
  }'
```

**レスポンス:**
```json
{
  "success": false,
  "message": "有効なメールアドレスを入力してください",
  "code": "VALIDATION_ERROR"
}
```

### ⚙️ 環境変数

`.env.local.example`をコピーして`.env.local`を作成：

```bash
cp .env.local.example .env.local
```

**設定例:**
```env
# Prismモックサーバー（開発時）
NEXT_PUBLIC_MOCK_API_URL=http://localhost:4010

# Next.js APIルート（本番時）
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 📚 Prismコマンドオプション

| オプション | 説明 |
|-----------|------|
| `-d, --dynamic` | 動的にランダムデータを生成 |
| `-p, --port <port>` | ポート番号を指定 |
| `--host <host>` | ホスト名を指定 |
| `-h, --help` | ヘルプ表示 |

### ⚠️ 注意事項

- **開発用途のみ**: 本番環境では使用しない
- **データ永続化なし**: リクエスト間でデータは保持されない
- **認証なし**: すべてのリクエストが`examples`に基づいて返却される

### 💡 利点

1. ✅ **即座にAPI動作確認**: コード実装前にフロントエンド開発開始
2. ✅ **OpenAPI定義の検証**: 定義ミスを即座に発見
3. ✅ **バックエンド待ちなし**: フロントエンドとバックエンドの並行開発
4. ✅ **自動バリデーション**: リクエストが仕様に準拠しているか自動チェック

## Storybook

### 🎨 概要

Storybookは各UIコンポーネントを独立した環境で開発・テスト・ドキュメント化するツールです。

### 🚀 使用方法

#### 起動

```bash
npm run storybook
```

ブラウザで [http://localhost:6006](http://localhost:6006) を開くと、コンポーネントカタログが表示されます。

#### ビルド

```bash
npm run build-storybook
```

静的HTMLとして `storybook-static/` にビルドされます。

### 📚 実装済みコンポーネント

| コンポーネント | ファイル | ストーリー数 |
|--------------|---------|------------|
| **Input** | `components/ui/input.tsx` | 6 stories |
| **Button** | `components/ui/button.tsx` | 8 stories |
| **Checkbox** | `components/ui/checkbox.tsx` | 9 stories |

### ✨ 機能

1. **インタラクティブコントロール**: propsをGUIで操作して動作確認
2. **自動ドキュメント生成**: 型定義とpropsを自動抽出
3. **アクセシビリティチェック**: a11yアドオンで自動検証
4. **アクションログ**: イベントハンドラーの呼び出しを確認
5. **レスポンシブビュー**: 各デバイスサイズでの表示確認

### 📖 ストーリーの例

各コンポーネントは以下のようなストーリーを持ちます:

- **Input**
  - Default（アイコンなし）
  - WithMailIcon（メールアイコン）
  - WithLockIcon（ロックアイコン）
  - ErrorState（エラー状態）
  - Disabled（無効状態）
  - Filled（入力済み）

- **Button**
  - Primary（プライマリボタン）
  - Secondary（セカンダリボタン）
  - PrimaryLoading（ローディング状態）
  - Disabled（無効状態）

- **Checkbox**
  - Default（未チェック）
  - Checked（チェック済み）
  - WithLabel（ラベル付き）
  - Disabled（無効状態）
  - TermsOfService（利用規約同意）

### 💡 開発ワークフロー

**推奨: コンポーネント単位で開発**

1. `components/ui/` にコンポーネントを作成
2. `components/ui/*.stories.tsx` でストーリーを作成
3. Storybookで動作確認
4. 実際のページで統合

### ⚙️ 設定ファイル

| ファイル | 説明 |
|---------|------|
| `.storybook/main.ts` | Storybookの基本設定、アドオン |
| `.storybook/preview.ts` | グローバルスタイル、パラメータ |

### 🎯 利点

1. ✅ **独立した開発環境**: アプリ全体を起動せずにコンポーネント確認
2. ✅ **全パターンを一覧表示**: 様々なstateを簡単に確認
3. ✅ **自動ドキュメント**: Props、型定義を自動抽出
4. ✅ **デザイナーとの共有が簡単**: URLを共有するだけ
5. ✅ **アクセシビリティ**: a11yアドオンで自動検証

## Issues

実装状況は [GitHub Issues](https://github.com/micci184/sample-login/issues) を参照