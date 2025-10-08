import { test, expect } from '@playwright/test';

test.describe('ログインページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test.describe('画面表示テスト', () => {
    test('ログインページが表示される', async ({ page }) => {
      await expect(page).toHaveURL('/login');
      await expect(page).toHaveTitle(/ログイン/);
    });

    test('メールアドレス入力欄が表示される', async ({ page }) => {
      const emailInput = page.getByPlaceholder('メールアドレスを入力');
      await expect(emailInput).toBeVisible();
      await expect(emailInput).toHaveAttribute('type', 'email');
    });

    test('パスワード入力欄が表示される', async ({ page }) => {
      const passwordInput = page.getByPlaceholder('パスワードを入力');
      await expect(passwordInput).toBeVisible();
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('「ログイン状態を保持する」チェックボックスが表示される', async ({ page }) => {
      const checkbox = page.getByRole('checkbox', { name: 'ログイン状態を保持する' });
      await expect(checkbox).toBeVisible();
    });

    test('ログインボタンが表示される', async ({ page }) => {
      const loginButton = page.getByRole('button', { name: 'ログイン' });
      await expect(loginButton).toBeVisible();
    });

    test('パスワード表示/非表示の切り替えボタンが動作する', async ({ page }) => {
      const passwordInput = page.getByPlaceholder('パスワードを入力');
      const toggleButton = page.getByRole('button', { name: /パスワードを(表示|非表示)/ });

      // 初期状態: password type
      await expect(passwordInput).toHaveAttribute('type', 'password');

      // 表示に切り替え
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'text');

      // 非表示に戻す
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  test.describe('バリデーションエラー表示', () => {
    test('空のまま送信するとエラーメッセージが表示される', async ({ page }) => {
      const loginButton = page.getByRole('button', { name: 'ログイン' });
      await loginButton.click();

      // メールアドレスのエラー
      await expect(page.locator('text=/メールアドレス.*必須|入力してください/')).toBeVisible();
    });

    test('不正なメールアドレスでエラーメッセージが表示される', async ({ page }) => {
      await page.getByPlaceholder('メールアドレスを入力').fill('invalid-email');
      await page.getByPlaceholder('パスワードを入力').fill('password123');
      await page.getByRole('button', { name: 'ログイン' }).click();

      await expect(page.locator('text=/有効なメールアドレス/')).toBeVisible();
    });

    test('8文字未満のパスワードでエラーメッセージが表示される', async ({ page }) => {
      await page.getByPlaceholder('メールアドレスを入力').fill('user@example.com');
      await page.getByPlaceholder('パスワードを入力').fill('short');
      await page.getByRole('button', { name: 'ログイン' }).click();

      await expect(page.locator('text=/8文字以上/')).toBeVisible();
    });
  });

  test.describe('ログイン成功フロー', () => {
    test('正しいメール・パスワードでログイン成功', async ({ page }) => {
      await page.getByPlaceholder('メールアドレスを入力').fill('test@example.com');
      await page.getByPlaceholder('パスワードを入力').fill('password123');
      await page.getByRole('button', { name: 'ログイン' }).click();

      // ローディング表示を確認
      await expect(page.getByText('ログイン中')).toBeVisible();

      // ダッシュボードまたはホームページにリダイレクト
      // 実装に応じて URL を調整
      await expect(page).toHaveURL(/\/(dashboard|home|$)/, { timeout: 10000 });
    });

    test('ローディング表示が正しく動作する', async ({ page }) => {
      await page.getByPlaceholder('メールアドレスを入力').fill('test@example.com');
      await page.getByPlaceholder('パスワードを入力').fill('password123');
      
      await page.getByRole('button', { name: 'ログイン' }).click();

      // ローディング中はボタンが無効化される
      const loginButton = page.getByRole('button', { name: /ログイン/ });
      await expect(loginButton).toBeDisabled();

      // ローディングテキストが表示される
      await expect(page.getByText('ログイン中')).toBeVisible();
    });
  });

  test.describe('ログイン失敗フロー', () => {
    test('間違ったパスワードでエラーメッセージが表示される', async ({ page }) => {
      await page.getByPlaceholder('メールアドレスを入力').fill('test@example.com');
      await page.getByPlaceholder('パスワードを入力').fill('wrongpassword');
      await page.getByRole('button', { name: 'ログイン' }).click();

      await expect(
        page.locator('text=/メールアドレスまたはパスワードが正しくありません/')
      ).toBeVisible({ timeout: 5000 });
    });

    test('存在しないメールアドレスでエラーメッセージが表示される', async ({ page }) => {
      await page.getByPlaceholder('メールアドレスを入力').fill('nonexistent@example.com');
      await page.getByPlaceholder('パスワードを入力').fill('password123');
      await page.getByRole('button', { name: 'ログイン' }).click();

      await expect(
        page.locator('text=/メールアドレスまたはパスワードが正しくありません/')
      ).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('「ログイン状態を保持する」機能', () => {
    test('チェックボックスのON/OFF動作確認', async ({ page }) => {
      const checkbox = page.getByRole('checkbox', { name: 'ログイン状態を保持する' });

      // 初期状態は未チェック
      await expect(checkbox).not.toBeChecked();

      // チェックを入れる
      await checkbox.check();
      await expect(checkbox).toBeChecked();

      // チェックを外す
      await checkbox.uncheck();
      await expect(checkbox).not.toBeChecked();
    });

    test('rememberMe を ON にしてログイン', async ({ page }) => {
      await page.getByPlaceholder('メールアドレスを入力').fill('test@example.com');
      await page.getByPlaceholder('パスワードを入力').fill('password123');
      
      // チェックボックスを ON
      const checkbox = page.getByRole('checkbox', { name: 'ログイン状態を保持する' });
      await checkbox.check();
      
      await page.getByRole('button', { name: 'ログイン' }).click();

      // ログイン成功を確認
      await expect(page).toHaveURL(/\/(dashboard|home|$)/, { timeout: 10000 });
    });
  });

  test.describe('キーボード操作', () => {
    test('Enter キーでフォーム送信', async ({ page }) => {
      await page.getByPlaceholder('メールアドレスを入力').fill('test@example.com');
      await page.getByPlaceholder('パスワードを入力').fill('password123');
      
      // Enter キーを押す
      await page.getByPlaceholder('パスワードを入力').press('Enter');

      // ローディング表示を確認
      await expect(page.getByText('ログイン中')).toBeVisible();
    });

    test('Tab キーでフォーカス移動', async ({ page }) => {
      await page.getByPlaceholder('メールアドレスを入力').focus();
      
      // Tab でパスワードに移動
      await page.keyboard.press('Tab');
      await expect(page.getByPlaceholder('パスワードを入力')).toBeFocused();
      
      // Tab でチェックボックスに移動
      await page.keyboard.press('Tab');
      await expect(page.getByRole('checkbox', { name: 'ログイン状態を保持する' })).toBeFocused();
      
      // Tab でボタンに移動
      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: 'ログイン' })).toBeFocused();
    });
  });
});
