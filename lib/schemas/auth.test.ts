import { describe, it, expect } from 'vitest';
import { loginSchema, ErrorCode } from './auth';

describe('loginSchema', () => {
  describe('正常系', () => {
    it('正常なメールアドレスとパスワードを受け入れる', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
        rememberMe: false,
      });
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('user@example.com');
        expect(result.data.password).toBe('password123');
        expect(result.data.rememberMe).toBe(false);
      }
    });

    it('rememberMe がない場合、デフォルト値 false が設定される', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
      });
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.rememberMe).toBe(false);
      }
    });

    it('rememberMe が true の場合も受け入れる', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
        rememberMe: true,
      });
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.rememberMe).toBe(true);
      }
    });

    it('最小文字数のメールアドレスとパスワードを受け入れる', () => {
      const result = loginSchema.safeParse({
        email: 'a@b.co', // 6文字（最小3文字以上、有効な形式）
        password: '12345678', // 8文字（最小）
        rememberMe: false,
      });
      
      expect(result.success).toBe(true);
    });
  });

  describe('メールアドレスのバリデーション', () => {
    it('不正な形式のメールアドレスを拒否する', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
        rememberMe: false,
      });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('有効なメールアドレス');
      }
    });

    it('@がないメールアドレスを拒否する', () => {
      const result = loginSchema.safeParse({
        email: 'invalidemail.com',
        password: 'password123',
        rememberMe: false,
      });
      
      expect(result.success).toBe(false);
    });

    it('3文字未満のメールアドレスを拒否する', () => {
      const result = loginSchema.safeParse({
        email: 'ab',
        password: 'password123',
        rememberMe: false,
      });
      
      expect(result.success).toBe(false);
      // メール形式エラーが先に検出される
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('有効なメールアドレス');
      }
    });

    it('255文字を超えるメールアドレスを拒否する', () => {
      const longEmail = 'a'.repeat(250) + '@example.com'; // 256文字
      const result = loginSchema.safeParse({
        email: longEmail,
        password: 'password123',
        rememberMe: false,
      });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('255文字以内');
      }
    });

    it('空文字のメールアドレスを拒否する', () => {
      const result = loginSchema.safeParse({
        email: '',
        password: 'password123',
        rememberMe: false,
      });
      
      expect(result.success).toBe(false);
    });
  });

  describe('パスワードのバリデーション', () => {
    it('8文字未満のパスワードを拒否する', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'short',
        rememberMe: false,
      });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('8文字以上');
      }
    });

    it('7文字のパスワードを拒否する', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: '1234567', // 7文字
        rememberMe: false,
      });
      
      expect(result.success).toBe(false);
    });

    it('128文字を超えるパスワードを拒否する', () => {
      const longPassword = 'a'.repeat(129); // 129文字
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: longPassword,
        rememberMe: false,
      });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('128文字以内');
      }
    });

    it('空文字のパスワードを拒否する', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: '',
        rememberMe: false,
      });
      
      expect(result.success).toBe(false);
    });
  });

  describe('必須フィールドのバリデーション', () => {
    it('email フィールドがない場合、エラーになる', () => {
      const result = loginSchema.safeParse({
        password: 'password123',
        rememberMe: false,
      });
      
      expect(result.success).toBe(false);
    });

    it('password フィールドがない場合、エラーになる', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        rememberMe: false,
      });
      
      expect(result.success).toBe(false);
    });

    it('すべてのフィールドがない場合、エラーになる', () => {
      const result = loginSchema.safeParse({});
      
      expect(result.success).toBe(false);
    });
  });

  describe('rememberMe のバリデーション', () => {
    it('rememberMe が文字列の場合、エラーになる', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
        rememberMe: 'true', // 文字列
      });
      
      expect(result.success).toBe(false);
    });

    it('rememberMe が数値の場合、エラーになる', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
        rememberMe: 1, // 数値
      });
      
      expect(result.success).toBe(false);
    });
  });
});

describe('ErrorCode', () => {
  it('定義されたエラーコードが正しい', () => {
    expect(ErrorCode.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
    expect(ErrorCode.INVALID_CREDENTIALS).toBe('INVALID_CREDENTIALS');
    expect(ErrorCode.ACCOUNT_LOCKED).toBe('ACCOUNT_LOCKED');
    expect(ErrorCode.RATE_LIMIT_EXCEEDED).toBe('RATE_LIMIT_EXCEEDED');
  });
});
