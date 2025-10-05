import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Checkbox } from './checkbox';

/**
 * Checkbox コンポーネント
 * 
 * Figma仕様に基づいたチェックボックスコンポーネント。
 * 利用規約の同意やオプション選択に使用します。
 * 
 * ## 主な機能
 * - カスタムデザインのチェックボックス
 * - ラベルテキストのサポート
 * - 無効状態のサポート
 * - アクセシビリティ対応（キーボード操作可能）
 */
const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'ラベルテキスト',
    },
    checked: {
      control: 'boolean',
      description: 'チェック状態',
    },
    disabled: {
      control: 'boolean',
      description: '無効状態',
    },
  },
  args: {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
      console.log('Checkbox changed:', e.target.checked),
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

/**
 * デフォルトのチェックボックス（ラベルなし）
 */
export const Default: Story = {
  args: {
    defaultChecked: false,
  },
};

/**
 * チェック済みの状態
 */
export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

/**
 * ラベル付きチェックボックス（未チェック）
 */
export const WithLabel: Story = {
  args: {
    label: 'ログイン状態を保持する',
    defaultChecked: false,
  },
};

/**
 * ラベル付きチェックボックス（チェック済み）
 */
export const WithLabelChecked: Story = {
  args: {
    label: 'ログイン状態を保持する',
    defaultChecked: true,
  },
};

/**
 * 無効状態（未チェック）
 */
export const DisabledUnchecked: Story = {
  args: {
    label: 'ログイン状態を保持する',
    defaultChecked: false,
    disabled: true,
  },
};

/**
 * 無効状態（チェック済み）
 */
export const DisabledChecked: Story = {
  args: {
    label: 'ログイン状態を保持する',
    defaultChecked: true,
    disabled: true,
  },
};

/**
 * 利用規約同意のユースケース
 */
export const TermsOfService: Story = {
  args: {
    label: '利用規約に同意する',
    defaultChecked: false,
  },
};

/**
 * プライバシーポリシー同意のユースケース
 */
export const PrivacyPolicy: Story = {
  args: {
    label: 'プライバシーポリシーに同意する',
    defaultChecked: false,
  },
};

/**
 * 複数のチェックボックスの例
 */
export const MultipleCheckboxes: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox label="ログイン状態を保持する" defaultChecked />
      <Checkbox label="利用規約に同意する" defaultChecked />
      <Checkbox label="プライバシーポリシーに同意する" />
      <Checkbox label="メールマガジンを受け取る" />
    </div>
  ),
};
