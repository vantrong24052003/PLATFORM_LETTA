import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Table,
  Tag,
  Space,
  Empty,
  Modal,
  message,
} from 'antd';
import {
  PlusOutlined,
  FileTextOutlined,
  FileOutlined,
  GlobalOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { KnowledgeBase, KnowledgeSourceType, KnowledgeBaseStatus } from '@/types';
import { getKnowledgeBase, deleteKnowledgeBase } from '@/utils/storage';

const { Title } = Typography;

const getTypeIcon = (type: KnowledgeSourceType) => {
  switch (type) {
    case 'text':
      return <FileTextOutlined />;
    case 'file':
      return <FileOutlined />;
    case 'website':
      return <GlobalOutlined />;
  }
};

const getTypeTag = (type: KnowledgeSourceType) => {
  const labels = {
    text: 'テキスト',
    file: 'ファイル',
    website: 'ウェブサイト',
  };
  const colors = {
    text: 'blue',
    file: 'green',
    website: 'orange',
  };
  return (
    <Tag icon={getTypeIcon(type)} color={colors[type]}>
      {labels[type]}
    </Tag>
  );
};

const getStatusTag = (status: KnowledgeBaseStatus) => {
  const configs = {
    processing: {
      icon: <LoadingOutlined />,
      color: 'processing',
      text: '処理中',
    },
    success: {
      icon: <CheckCircleOutlined />,
      color: 'success',
      text: '成功',
    },
    error: {
      icon: <CloseCircleOutlined />,
      color: 'error',
      text: 'エラー',
    },
  };
  const config = configs[status];
  return (
    <Tag icon={config.icon} color={config.color}>
      {config.text}
    </Tag>
  );
};

const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

function KnowledgeBasePage() {
  const navigate = useNavigate();
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    try {
      const data = getKnowledgeBase();
      setKnowledgeBases(data);
    } catch (error) {
      message.error('データの読み込みに失敗しました');
      console.error('Failed to load knowledge bases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = () => {
    navigate('/knowledge-base/new');
  };

  const handleEdit = (id: string) => {
    navigate(`/knowledge-base/${id}`);
  };

  const handleDelete = (record: KnowledgeBase) => {
    Modal.confirm({
      title: '削除確認',
      content: `「${record.name}」を削除してもよろしいですか？この操作は取り消せません。`,
      okText: '削除',
      okType: 'danger',
      cancelText: 'キャンセル',
      onOk: () => {
        try {
          deleteKnowledgeBase(record.id);
          message.success('削除しました');
          loadData();
        } catch (error) {
          message.error('削除に失敗しました');
          console.error('Failed to delete knowledge base:', error);
        }
      },
    });
  };

  const columns: ColumnsType<KnowledgeBase> = [
    {
      title: '名前',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record) => (
        <Button
          type="link"
          onClick={() => handleEdit(record.id)}
          style={{ padding: 0, height: 'auto' }}
        >
          {name}
        </Button>
      ),
    },
    {
      title: 'ソース',
      key: 'sources',
      width: 200,
      render: (_, record) => {
        const sourceTypes = [...new Set(record.sources.map(s => s.type))];
        return (
          <Space size="small" wrap>
            {sourceTypes.map(type => (
              <span key={type}>{getTypeTag(type)}</span>
            ))}
          </Space>
        );
      },
    },
    {
      title: '合計文字数',
      dataIndex: 'totalCharacterCount',
      key: 'totalCharacterCount',
      width: 150,
      render: (count: number) => `${count.toLocaleString()} 文字`,
    },
    {
      title: 'ステータス',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: KnowledgeBaseStatus) => getStatusTag(status),
    },
    {
      title: '更新日時',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (updatedAt: string) => formatDateTime(updatedAt),
    },
    {
      title: 'アクション',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
            title="編集"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            title="削除"
          />
        </Space>
      ),
    },
  ];

  if (!loading && knowledgeBases.length === 0) {
    return (
      <Empty
        description="まだナレッジベースがありません。最初のナレッジベースを作成しましょう！"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      >
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新規作成
        </Button>
      </Empty>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>ナレッジベース</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新規作成
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={knowledgeBases}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `全${total}件`,
        }}
      />
    </div>
  );
}

export default KnowledgeBasePage;

