// 参照: openspec/changes/add-ai-assistants-management/specs/ai-assistant-configuration/spec.md

import { Modal, Input, Button, Space, Typography, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { AIAssistant } from '@/types';

const { Paragraph } = Typography;

interface EmbedCodeModalProps {
  open: boolean;
  assistant: AIAssistant | null;
  onClose: () => void;
}

export function EmbedCodeModal({
  open,
  assistant,
  onClose,
}: EmbedCodeModalProps) {
  const embedCode = assistant
    ? `<script src="https://uimgpt.com/embed.js" data-assistant-id="${assistant.id}"></script>`
    : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      message.success('埋め込みコードをコピーしました');
    } catch (error) {
      message.error('コピーに失敗しました');
    }
  };

  return (
    <Modal
      title="埋め込みコード"
      open={open}
      onCancel={onClose}
      footer={false}
      width={600}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Paragraph>
            以下のコードをあなたのWebサイトに貼り付けることで、AIアシスタントを埋め込むことができます。
          </Paragraph>
          <Paragraph>
            （注：MVP版のため、このコードはプレースホルダーです）
          </Paragraph>
        </div>

        <div>
          <Input.TextArea
            value={embedCode}
            readOnly
            rows={3}
            style={{ fontFamily: 'monospace', fontSize: '12px' }}
          />
        </div>

        <div>
          <Button
            type="primary"
            icon={<CopyOutlined />}
            onClick={handleCopy}
            block
          >
            コードをコピー
          </Button>
        </div>
      </Space>
    </Modal>
  );
}

