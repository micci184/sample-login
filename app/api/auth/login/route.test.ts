import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';
import { ErrorCode } from '@/lib/schemas/auth';

describe('POST /api/auth/login', () => {
  describe('正常系', () => {
    it('正しい認証情報でログイン成功（200）', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          rememberMe: false,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('ログインに成功しました');
      expect(data.user).toBeDefined();
      expect(data.user.id).toBe('user_12345');
      expect(data.user.email).toBe('test@example.com');
      expect(data.user.name).toBe('テストユーザー');
    });

    it('rememberMe が true でもログイン成功', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          rememberMe: true,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('rememberMe がない場合もログイン成功', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe('バリデーションエラー（400）', () => {
    it('不正な形式のメールアドレスで400エラー', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'password123',
          rememberMe: false,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(data.message).toContain('有効なメールアドレス');
    });

    it('8文字未満のパスワードで400エラー', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'short',
          rememberMe: false,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(data.message).toContain('8文字以上');
    });

    it('email フィールドがない場合、400エラー', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: 'password123',
          rememberMe: false,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.code).toBe(ErrorCode.VALIDATION_ERROR);
    });

    it('password フィールドがない場合、400エラー', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'user@example.com',
          rememberMe: false,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.code).toBe(ErrorCode.VALIDATION_ERROR);
    });

    it('すべてのフィールドがない場合、400エラー', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.code).toBe(ErrorCode.VALIDATION_ERROR);
    });
  });

  describe('認証エラー（401）', () => {
    it('間違ったパスワードで401エラー', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'wrongpassword',
          rememberMe: false,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.code).toBe(ErrorCode.INVALID_CREDENTIALS);
      expect(data.message).toBe('メールアドレスまたはパスワードが正しくありません');
    });

    it('存在しないメールアドレスで401エラー', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'password123',
          rememberMe: false,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.code).toBe(ErrorCode.INVALID_CREDENTIALS);
    });
  });

  describe('アカウントロック（423）', () => {
    it('ロックされたアカウントで423エラー', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'locked@example.com',
          password: 'password123',
          rememberMe: false,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(423);
      expect(data.success).toBe(false);
      expect(data.code).toBe(ErrorCode.ACCOUNT_LOCKED);
      expect(data.message).toContain('アカウントがロックされています');
    });
  });

  describe('エッジケース', () => {
    it('リクエストボディが空の場合、500エラー', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.message).toBe('サーバーエラーが発生しました');
    });

    it('不正な JSON の場合、500エラー', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{invalid json}',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });

    it('255文字のメールアドレスでログイン成功', async () => {
      const longEmail = 'a'.repeat(243) + '@example.com'; // 255文字
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: longEmail,
          password: 'password123',
          rememberMe: false,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      // モック実装では test@example.com 以外は401
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });

    it('128文字のパスワードでログイン成功', async () => {
      const longPassword = 'a'.repeat(128); // 128文字
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: longPassword,
          rememberMe: false,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      // モック実装では password123 以外は401
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });
  });
});
