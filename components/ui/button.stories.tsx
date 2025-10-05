import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './button';

/**
 * Button コンポーネント
 * 
 * Figma仕様に基づいたボタンコンポーネント。
 * プライマリアクション、セカンダリアクションに使用します。
 * 
 * ## 主な機能
 * - プライマリ/セカンダリバリアント
 * - ローディング状態のサポート
 * - 無効状態のサポート
 * - アクセシビリティ対応
 */
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'ボタンのバリアント',
    },
    loading: {
      control: 'boolean',
      description: 'ローディング状態',
    },
    disabled: {
      control: 'boolean',
      description: '無効状態',
    },
    children: {
      control: 'text',
      description: 'ボタンのテキスト',
    },
  },
  args: {
    onClick: () => console.log('Button clicked'),
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/**
 * プライマリボタン（デフォルト）
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'ログイン',
  },
};

/**
 * セカンダリボタン
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'キャンセル',
  },
};

/**
 * ローディング状態のプライマリボタン
 */
export const PrimaryLoading: Story = {
  args: {
    variant: 'primary',
    children: 'ログイン中...',
    loading: true,
  },
};

/**
 * ローディング状態のセカンダリボタン
 */
export const SecondaryLoading: Story = {
  args: {
    variant: 'secondary',
    children: '処理中...',
    loading: true,
  },
};

/**
 * 無効状態のプライマリボタン
 */
export const PrimaryDisabled: Story = {
  args: {
    variant: 'primary',
    children: 'ログイン',
    disabled: true,
  },
};

/**
 * 無効状態のセカンダリボタン
 */
export const SecondaryDisabled: Story = {
  args: {
    variant: 'secondary',
    children: 'キャンセル',
    disabled: true,
  },
};

/**
 * 長いテキストのボタン
 */
export const LongText: Story = {
  args: {
    variant: 'primary',
    children: 'メールアドレスでログインする',
  },
};

/**
 * ボタンのインタラクティブテスト用
 * （クリックイベントを確認できます）
 */
export const Interactive: Story = {
  args: {
    variant: 'primary',
    children: 'クリックしてください',
  },
  play: async ({ canvasElement, step }) => {
    // この関数は Storybook の interactions アドオンで使用されます
    console.log('Interactive story loaded');
  },
};
