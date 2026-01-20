// 参照: openspec/changes/add-ai-assistants-management/specs/ai-assistants-list/spec.md

import { Card, Avatar, Switch, Space, Tooltip } from 'antd';
import {
  RobotOutlined,
  SettingOutlined,
  CodeOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { AIAssistant } from '@/types';

interface AIAssistantCardProps {
  assistant: AIAssistant;
  onToggle: (id: string, status: 'active' | 'inactive') => void;
  onConfigure: (id: string) => void;
  onEmbed: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AIAssistantCard({
  assistant,
  onToggle,
  onConfigure,
  onEmbed,
  onDelete,
}: AIAssistantCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleToggle = (checked: boolean) => {
    onToggle(assistant.id, checked ? 'active' : 'inactive');
  };

  return (
    <Card
      hoverable
      extra={
        <Switch
          checked={assistant.status === 'active'}
          onChange={handleToggle}
          checkedChildren="有効"
          unCheckedChildren="無効"
        />
      }
      actions={[
        <Tooltip title="設定" key="config">
          <SettingOutlined onClick={() => onConfigure(assistant.id)} />
        </Tooltip>,
        <Tooltip title="埋め込みコード" key="embed">
          <CodeOutlined onClick={() => onEmbed(assistant.id)} />
        </Tooltip>,
        <Tooltip title="削除" key="delete">
          <DeleteOutlined onClick={() => onDelete(assistant.id)} />
        </Tooltip>,
      ]}
    >
      <Card.Meta
        avatar={
          <Avatar
            size={64}
            src={assistant.botAvatarUrl}
            style={{ backgroundColor: '#1890ff' }}
            icon={<RobotOutlined />}
          />
        }
        title={assistant.name}
        description={`最終更新: ${formatDate(assistant.updatedAt)}`}
      />
      <div style={{ marginTop: 16 }}>
        <Space direction="vertical" size="small">
          <div>
            ナレッジベース連携数: {assistant.knowledgeIds.length}
          </div>
        </Space>
      </div>
    </Card>
  );
}

