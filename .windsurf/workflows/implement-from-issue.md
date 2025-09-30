---
description: 
auto_execution_mode: 1
---

# implement-from-issue.md

## Issue 駆動実装ワークフロー

選択した issue に基づいてブランチを作成し、実装から PR 作成まで完全自動化します。

### 前提条件:

- GitHub MCP が設定済み
- Figma MCP が設定済み
- Playwright MCP が設定済み
- tokens.json が frontend ディレクトリに存在
- Next.js プロジェクトがセットアップ済み


### ステップ:

1. **実装対象 Issue 選択**

   - GitHub MCP で「status:ready」ラベルの issue を取得
   - 優先度順にリスト表示
   - ユーザーに選択を促す
   - 選択された issue の詳細を取得
   - issue のステータスを「status:in-progress」に更新

2. **ブランチ作成**

   - main ブランチから最新を取得
   - issue 番号とタイトルからブランチ名を生成
   - 例: feat/issue-2-button-component
   - ブランチ作成を issue にコメント

3. **Figma デザイン詳細取得**

   - issue に記載された Figma リンクから情報取得
   - Figma MCP でコンポーネントの詳細を分析
   - サイズ、カラー、スペーシング、タイポグラフィを抽出
   - Variants は目視確認で補完

4. **トークンマッピング確認**

   - frontend/tokens.json を読み込み
   - Figma から抽出した値とトークンをマッピング
   - マッピングできない値を警告表示

5. **コンポーネント実装**

   - ファイル構造を生成
   - Figma のデザイン仕様に基づいて実装
   - TypeScript 型定義を追加
   - 必要な props と variants を実装
   - 実装をコミット

6. **開発サーバー起動と初期確認**

   - npm run dev を実行
   - localhost:3000 で表示確認
   - 基本的な動作を検証

7. **Playwright MCP でビジュアル検証**

   - 実装したコンポーネントのスクリーンショット取得
   - Figma からエクスポートした画像と比較
   - 差分検出と一致率を報告
   - レスポンシブ各サイズで検証

8. **ビジュアル検証結果に基づく修正**

   - 検出された差分を修正
   - 再度ビジュアル検証を実行
   - 修正内容をコミット

9. **テスト作成と実行**

   - 基本的なテストを作成
   - npm run test を実行
   - npm run lint を実行
   - npm run type-check を実行
   - テストファイルをコミット

10. **ブランチをプッシュ**

    - 作成したブランチをリモートにプッシュ
    - git push origin [branch-name]

11. **PR 作成**

    - GitHub MCP で PR を作成
    - PR テンプレートに従って記載
    - スクリーンショットを添付
    - Figma との一致率を記載
    - レビュー依頼

12. **Issue 更新とクローズ準備**
    - PR リンクを issue に追加
    - ステータスを「status:review」に更新
    - マージ後の自動クローズ設定
