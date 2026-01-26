// 参照: openspec/changes/add-ai-assistants-management/specs/ai-assistants-list/spec.md

import { useState, useEffect } from 'react';
import { Button, Empty, List, Typography, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AIAssistant, CreateAIAssistantInput } from '@/types';
import {
  getAIAssistants,
  addAIAssistant,
  updateAIAssistant,
  deleteAIAssistant,
} from '@/utils/storage';
import { AIAssistantCard } from '@/components/AIAssistantCard';
import { CreateAssistantModal } from '@/components/CreateAssistantModal';
import { EmbedCodeModal } from '@/components/EmbedCodeModal';

const { Title } = Typography;

function AIAssistantsPage() {
  const navigate = useNavigate();
  const [assistants, setAssistants] = useState<AIAssistant[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [embedModalOpen, setEmbedModalOpen] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState<AIAssistant | null>(null);

  const loadAssistants = () => {
    const data = getAIAssistants();
    setAssistants(data);
  };

  useEffect(() => {
    loadAssistants();
  }, []);

  const handleCreate = (values: CreateAIAssistantInput) => {
    addAIAssistant({
      ...values,
      status: 'inactive',
      knowledgeIds: [],
    });
    loadAssistants();
    setCreateModalOpen(false);
  };

  const handleToggle = (id: string, status: 'active' | 'inactive') => {
    updateAIAssistant(id, { status });
    loadAssistants();
  };

  const handleConfigure = (id: string) => {
    navigate(`/ai-assistants/${id}`);
  };

  const handleEmbed = (id: string) => {
    const assistant = assistants.find(a => a.id === id);
    if (assistant) {
      setSelectedAssistant(assistant);
      setEmbedModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '削除の確認',
      content: 'このAIアシスタントを削除してもよろしいですか？',
      okText: '削除',
      okType: 'danger',
      cancelText: 'キャンセル',
      onOk: () => {
        deleteAIAssistant(id);
        loadAssistants();
        message.success('AIアシスタントを削除しました');
      },
    });
  };

  return (
    <div>
      {assistants.length > 0 && (
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2}>私のAIアシスタント</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalOpen(true)}
          >
            新しいアシスタントを作成
          </Button>
        </div>
      )}

      {assistants.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
                まだAIアシスタントがありません
              </div>
              <div style={{ color: '#8c8c8c' }}>
                AIアシスタントを作成して、ナレッジベースを活用した質問応答を始めましょう
              </div>
            </div>
          }
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalOpen(true)}
          >
            最初のアシスタントを作成
          </Button>
        </Empty>
      ) : (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 3,
            xxl: 4,
          }}
          dataSource={assistants}
          renderItem={(assistant) => (
            <List.Item>
              <AIAssistantCard
                assistant={assistant}
                onToggle={handleToggle}
                onConfigure={handleConfigure}
                onEmbed={handleEmbed}
                onDelete={handleDelete}
              />
            </List.Item>
          )}
        />
      )}

      <CreateAssistantModal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onCreate={handleCreate}
      />

      <EmbedCodeModal
        open={embedModalOpen}
        assistant={selectedAssistant}
        onClose={() => {
          setEmbedModalOpen(false);
          setSelectedAssistant(null);
        }}
      />
    </div>
  );
}

export default AIAssistantsPage;
