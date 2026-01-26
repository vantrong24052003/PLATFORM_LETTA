import { Card, Space, Button, Divider, Typography } from 'antd';
import { SaveOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface SummaryCardProps {
  textCharCount: number;
  fileCount: number;
  fileTotalChars: number;
  websiteCount: number;
  websiteTotalChars: number;
  totalCharCount: number;
  isEditMode: boolean;
  saving: boolean;
  onSave: () => void;
  onDelete: () => void;
  onCancel: () => void;
}

function SummaryCard({
  textCharCount,
  fileCount,
  fileTotalChars,
  websiteCount,
  websiteTotalChars,
  totalCharCount,
  isEditMode,
  saving,
  onSave,
  onDelete,
  onCancel,
}: SummaryCardProps) {
  return (
    <Card
      title={<Title level={4} style={{ margin: 0 }}>ソースサマリー</Title>}
      styles={{ body: { padding: 24 } }}
      style={{
        position: 'sticky',
        top: 24,
        border: 'none',
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* Character count summary */}
        <div>
          <div style={{ marginBottom: 8 }}>
            テキスト: <Text type="secondary">{textCharCount}</Text> 文字
          </div>
          <div style={{ marginBottom: 8 }}>
            ファイル: <Text type="secondary">{fileCount} 件 ({fileTotalChars} 文字)</Text>
          </div>
          <div style={{ marginBottom: 8 }}>
            ウェブサイト: <Text type="secondary">{websiteCount} リンク ({websiteTotalChars} 文字)</Text>
          </div>
        </div>

        <Divider style={{ margin: 0 }} />

        {/* Total count */}
        <div>
          <Text strong style={{ fontSize: 16 }}>
            合計（アクティブ）: {totalCharCount} 文字
          </Text>
        </div>

        <Divider style={{ margin: 0 }} />

        {/* Action buttons - single row */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={onSave}
            loading={saving}
            disabled={saving}
            style={{ flex: 2 }}
          >
            {saving ? '保存中...' : '保存＆トレーニング'}
          </Button>

          <Button
            onClick={onCancel}
            disabled={saving}
            style={{ flex: 1 }}
          >
            キャンセル
          </Button>

          {isEditMode && (
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={onDelete}
              disabled={saving}
              style={{ flex: 1 }}
            >
              削除
            </Button>
          )}
        </div>
      </Space>
    </Card>
  );
}

export default SummaryCard;

