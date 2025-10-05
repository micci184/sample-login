import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Mail, Lock } from 'lucide-react';
import { Input } from './input';

/**
 * Input コンポーネント
 * 
 * Figma仕様に基づいた入力フィールドコンポーネント。
 * メールアドレスやパスワードなどの入力に使用します。
 * 
 * ## 主な機能
 * - アイコン表示（左側）
 * - エラー状態の表示
 * - 無効状態のサポート
 * - アクセシビリティ対応
 */
const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'プレースホルダーテキスト',
    },
    error: {
      control: 'boolean',
      description: 'エラー状態',
    },
    disabled: {
      control: 'boolean',
      description: '無効状態',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password'],
      description: '入力タイプ',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

/**
 * デフォルトの入力フィールド（アイコンなし）
 */
export const Default: Story = {
  args: {
    placeholder: 'テキストを入力',
    type: 'text',
  },
};

/**
 * メールアイコン付き入力フィールド
 */
export const WithMailIcon: Story = {
  args: {
    placeholder: 'メールアドレスを入力',
    type: 'email',
    icon: Mail,
  },
};

/**
 * ロックアイコン付き入力フィールド（パスワード用）
 */
export const WithLockIcon: Story = {
  args: {
    placeholder: 'パスワードを入力',
    type: 'password',
    icon: Lock,
  },
};

/**
 * エラー状態の入力フィールド
 */
export const ErrorState: Story = {
  args: {
    placeholder: 'メールアドレスを入力',
    type: 'email',
    icon: Mail,
    error: true,
    defaultValue: 'invalid-email',
  },
};

/**
 * 無効状態の入力フィールド
 */
export const Disabled: Story = {
  args: {
    placeholder: 'メールアドレスを入力',
    type: 'email',
    icon: Mail,
    disabled: true,
    defaultValue: 'user@example.com',
  },
};

/**
 * 入力済みの状態
 */
export const Filled: Story = {
  args: {
    placeholder: 'メールアドレスを入力',
    type: 'email',
    icon: Mail,
    defaultValue: 'user@example.com',
  },
};
