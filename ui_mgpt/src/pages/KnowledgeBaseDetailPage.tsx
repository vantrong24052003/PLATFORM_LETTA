import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Breadcrumb, Tabs, Modal, message, Typography } from 'antd';
import { KnowledgeSource, AssetAttachment } from '@/types';
import {
  getKnowledgeBaseById,
  addKnowledgeBase,
  updateKnowledgeBase,
  deleteKnowledgeBase,
} from '@/utils/storage';
import {
  MarkdownEditorSection,
  DEFAULT_MARKDOWN_TEXT,
  FileUploadSection,
  WebsiteCrawlSection,
  AssetAttachmentsTab,
  SummaryCard,
} from '@/components/KnowledgeBase';

const { Title } = Typography;

function KnowledgeBaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'knowledge' | 'assets'>('knowledge');

  // Form data
  const [name, setName] = useState('');
  const [textContent, setTextContent] = useState('');
  const [textCharCount, setTextCharCount] = useState(0);
  const [files, setFiles] = useState<KnowledgeSource[]>([]);
  const [fileCharCount, setFileCharCount] = useState(0);
  const [websites, setWebsites] = useState<KnowledgeSource[]>([]);
  const [websiteCharCount, setWebsiteCharCount] = useState(0);
  const [assets, setAssets] = useState<AssetAttachment[]>([]);

  const isEditMode = id && id !== 'new';

  // Calculate totals
  const fileCount = files.length;
  const activeWebsiteCount = websites.filter(w => w.isActive && w.status === 'success').length;
  const totalCharCount = useMemo(() => {
    return textCharCount + fileCharCount + websiteCharCount;
  }, [textCharCount, fileCharCount, websiteCharCount]);

  // Load existing data in edit mode
  useEffect(() => {
    if (isEditMode) {
      const kb = getKnowledgeBaseById(id);
      if (kb) {
        setName(kb.name);

        // Set form field (delay to ensure Form is mounted)
        setTimeout(() => {
          form.setFieldValue('name', kb.name);
        }, 0);

        // Load sources
        const textSources = kb.sources.filter(s => s.type === 'text');
        const fileSources = kb.sources.filter(s => s.type === 'file');
        const websiteSources = kb.sources.filter(s => s.type === 'website');

        if (textSources.length > 0) {
          setTextContent(textSources[0].content);
          setTextCharCount(textSources[0].characterCount);
        } else {
          // No text source in edit mode, keep empty or set default
          setTextContent('');
          setTextCharCount(0);
        }

        setFiles(fileSources);
        setFileCharCount(fileSources.reduce((sum, f) => sum + f.characterCount, 0));

        setWebsites(websiteSources);
        const activeWebsiteChars = websiteSources
          .filter(w => w.isActive && w.status === 'success')
          .reduce((sum, w) => sum + w.characterCount, 0);
        setWebsiteCharCount(activeWebsiteChars);

        // Load assets
        setAssets(kb.assets);
      } else {
        message.error('ナレッジベースが見つかりません');
        navigate('/knowledge-base');
      }
    } else {
      // Create mode: set default text
      setTextContent(DEFAULT_MARKDOWN_TEXT);
      setTextCharCount(DEFAULT_MARKDOWN_TEXT.length);
    }

    setLoading(false);
  }, [id, isEditMode, form, navigate]);

  const handleSave = async () => {
    try {
      // Validate name
      const values = await form.validateFields(['name']);

      // Collect all sources
      const sources: KnowledgeSource[] = [];

      // Add text source if not empty
      if (textContent.trim()) {
        sources.push({
          id: crypto.randomUUID(),
          type: 'text',
          content: textContent,
          characterCount: textCharCount,
          isActive: true,
          status: 'success',
          createdAt: new Date().toISOString(),
        });
      }

      // Add file sources
      sources.push(...files);

      // Add website sources
      sources.push(...websites);

      // Validate: at least one source
      if (sources.length === 0) {
        message.error('少なくとも1つのデータソースを入力してください');
        return;
      }

      setSaving(true);

      if (isEditMode) {
        // Update existing
        updateKnowledgeBase(id, {
          name: values.name,
          sources,
          assets,
          status: 'processing',
        });
        message.success('更新しました');
      } else {
        // Create new
        addKnowledgeBase({
          name: values.name,
          sources,
          assets,
        });
        message.success('作成しました');
      }

      // Mock training process (2 seconds)
      setTimeout(() => {
        if (isEditMode) {
          updateKnowledgeBase(id, { status: 'success' });
        }
        message.success('トレーニングが完了しました');
      }, 2000);

      // Navigate to list
      setTimeout(() => {
        navigate('/knowledge-base');
      }, 500);
    } catch (error) {
      console.error('Save failed:', error);
      message.error('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: '削除確認',
      content: 'このナレッジベースを削除してもよろしいですか？この操作は取り消せません。',
      okText: '削除',
      okType: 'danger',
      cancelText: 'キャンセル',
      onOk: () => {
        if (isEditMode) {
          deleteKnowledgeBase(id);
          message.success('削除しました');
          navigate('/knowledge-base');
        }
      },
    });
  };

  const handleCancel = () => {
    navigate('/knowledge-base');
  };

  const breadcrumbItems = [
    {
      title: 'ナレッジベース',
      href: '/knowledge-base',
    },
    {
      title: isEditMode ? '編集' : '新規作成',
    },
  ];

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: 24 }}>
      <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 16 }} />
      <Title level={2} style={{ margin: 0, marginBottom: 24 }}>
        {isEditMode ? 'ナレッジベース編集' : 'ナレッジベース新規作成'}
      </Title>

      {/* 2-Column Layout */}
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Left Column (70%) - Form */}
        <div style={{ flex: '0 0 70%' }}>
          <Form form={form} layout="vertical">
            {/* Name field */}
            <Form.Item
              label="名前"
              name="name"
              rules={[
                { required: true, message: '名前を入力してください' },
                { max: 100, message: '名前は100文字以内で入力してください' },
              ]}
            >
              <Input
                placeholder="ナレッジベース名を入力してください"
                size="large"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>

            {/* 2 High-Level Tabs */}
            <Tabs
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key as 'knowledge' | 'assets')}
              items={[
                {
                  key: 'knowledge',
                  label: 'ナレッジソース',
                  children: (
                    <div>
                      {/* Markdown Editor */}
                      <MarkdownEditorSection
                        value={textContent}
                        onChange={setTextContent}
                        onCharCountChange={setTextCharCount}
                      />

                      {/* File Upload */}
                      <FileUploadSection
                        files={files}
                        onFilesChange={setFiles}
                        onCharCountChange={setFileCharCount}
                      />

                      {/* Website Crawl */}
                      <WebsiteCrawlSection
                        websites={websites}
                        onWebsitesChange={setWebsites}
                        onCharCountChange={setWebsiteCharCount}
                      />
                    </div>
                  ),
                },
                {
                  key: 'assets',
                  label: 'アセット添付',
                  children: (
                    <AssetAttachmentsTab
                      assets={assets}
                      onAssetsChange={setAssets}
                    />
                  ),
                },
              ]}
            />
          </Form>
        </div>

        {/* Right Column (30%) - Summary Card */}
        <div style={{ flex: '0 0 30%' }}>
          <SummaryCard
            textCharCount={textCharCount}
            fileCount={fileCount}
            fileTotalChars={fileCharCount}
            websiteCount={activeWebsiteCount}
            websiteTotalChars={websiteCharCount}
            totalCharCount={totalCharCount}
            isEditMode={!!isEditMode}
            saving={saving}
            onSave={handleSave}
            onDelete={handleDelete}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}

export default KnowledgeBaseDetailPage;
