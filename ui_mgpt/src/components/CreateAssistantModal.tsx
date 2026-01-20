// 参照: openspec/changes/add-ai-assistants-management/specs/ai-assistants-list/spec.md

import { Modal, Form, Input, message } from 'antd';
import { CreateAIAssistantInput } from '@/types';

interface CreateAssistantModalProps {
  open: boolean;
  onCancel: () => void;
  onCreate: (values: CreateAIAssistantInput) => void;
}

export function CreateAssistantModal({
  open,
  onCancel,
  onCreate,
}: CreateAssistantModalProps) {
  const [form] = Form.useForm<CreateAIAssistantInput>();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onCreate(values);
      form.resetFields();
      message.success('AIアシスタントを作成しました');
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="新しいAIアシスタントを作成"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="作成"
      cancelText="キャンセル"
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="name"
          label="アシスタント名"
          rules={[
            {
              required: true,
              message: 'アシスタント名を入力してください',
            },
          ]}
        >
          <Input placeholder="例: テクニカルサポート" />
        </Form.Item>

        <Form.Item
          name="greeting"
          label="デフォルトの挨拶"
        >
          <Input.TextArea
            rows={3}
            placeholder="例: こんにちは！どのようにお手伝いできますか？（後で設定できます）"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

