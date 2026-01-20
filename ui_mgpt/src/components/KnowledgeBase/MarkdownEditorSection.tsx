import { Typography, Space } from 'antd';
import { MarkdownEditor } from '@ant-design/agentic-ui';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const DEFAULT_MARKDOWN_TEXT = "こんにちは！どのようにお手伝いできますか？\nMarkdown記法にも対応していますので、お気軽にお試しくださいね。\n例えば：\n\n- **太字**\n- *斜体*\n- `コード`\n- [リンク](https://example.com)";

interface MarkdownEditorSectionProps {
  value: string;
  onChange: (value: string) => void;
  onCharCountChange: (count: number) => void;
}

function MarkdownEditorSection({ value, onChange, onCharCountChange }: MarkdownEditorSectionProps) {
  const handleChange = (newValue: string) => {
    onChange(newValue);
    onCharCountChange(newValue.length);
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <Space direction="vertical" size={4} style={{ width: '100%', marginBottom: 8 }}>
        <Title level={5} style={{ margin: 0 }}>テキスト</Title>
        <Text type="secondary" style={{ fontSize: 12 }}>
          <InfoCircleOutlined /> Markdown形式で入力できます（見出し、太字、リスト、リンクなど）
        </Text>
      </Space>
      <MarkdownEditor
        onChange={handleChange}
        initValue={value || DEFAULT_MARKDOWN_TEXT || ''}
        style={{
          minHeight: 400,
          maxHeight: 600,
          overflow: 'auto',
          border: '1px solid #d9d9d9',
          borderRadius: 4,
          backgroundColor: '#ffffff',
        }}
      />
    </div>
  );
}

export default MarkdownEditorSection;

