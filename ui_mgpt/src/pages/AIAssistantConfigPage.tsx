// 参照: openspec/changes/add-chatbot-customization/specs/ai-assistant-configuration/spec.md

import { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  Typography,
  Breadcrumb,
  Switch,
  message,
  Divider,
  ColorPicker,
  Upload,
  Tooltip,
  Popover,
} from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { CopyOutlined, PlusOutlined, QuestionCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MarkdownEditor } from '@ant-design/agentic-ui';
import { AIAssistant } from '@/types';
import {
  getAIAssistantById,
  updateAIAssistant,
  getKnowledgeBase,
  validateImageType,
  encodeFileToBase64,
} from '@/utils/storage';
import { ChatPreview } from '@/components/ChatPreview';

const { Title, Paragraph } = Typography;

// Default greeting text
const DEFAULT_GREETING = "こんにちは！どのようにお手伝いできますか？\nMarkdown記法にも対応していますので、お気軽にお試しくださいね。\n例えば：\n\n- **太字**\n- *斜体*\n- `コード`\n- [リンク](https://example.com)";

function AIAssistantConfigPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [assistant, setAssistant] = useState<AIAssistant | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state for real-time preview sync
  const [formValues, setFormValues] = useState({
    name: '',
    greeting: DEFAULT_GREETING, // Start with default greeting
    knowledgeIds: [] as string[],
    systemPrompt: '',
    primaryColor: '#1677ff',
    botAvatarUrl: '',
    bubbleIconUrl: '',
    footerText: 'Prompted by CONFERENCE PARK',
  });

  // Upload state
  const [botAvatarFileList, setBotAvatarFileList] = useState<UploadFile[]>([]);
  const [bubbleIconFileList, setBubbleIconFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (!id) {
      message.error('アシスタントIDが見つかりません');
      navigate('/ai-assistants');
      return;
    }

    const data = getAIAssistantById(id);
    if (!data) {
      message.error('アシスタントが見つかりません');
      navigate('/ai-assistants');
      return;
    }

    setAssistant(data);

    // State values (all fields for preview)
    const stateInitialValues = {
      name: data.name,
      greeting: data.greeting || DEFAULT_GREETING, // Use default if empty
      knowledgeIds: data.knowledgeIds,
      systemPrompt: data.systemPrompt || '',
      primaryColor: data.primaryColor || '#1677ff',
      botAvatarUrl: data.botAvatarUrl || '',
      bubbleIconUrl: data.bubbleIconUrl || '',
      footerText: data.footerText || 'Prompted by CONFERENCE PARK',
    };

    setFormValues(stateInitialValues);

    // Set form fields for controlled components (delay to ensure Form is mounted)
    setTimeout(() => {
      form.setFieldsValue({
        name: data.name,
        greeting: data.greeting || DEFAULT_GREETING,
        knowledgeIds: data.knowledgeIds,
      });
    }, 0);

    // Set upload file lists if images exist
    if (data.botAvatarUrl) {
      setBotAvatarFileList([{
        uid: '-1',
        name: 'avatar.png',
        status: 'done',
        url: data.botAvatarUrl,
      }]);
    }
    if (data.bubbleIconUrl) {
      setBubbleIconFileList([{
        uid: '-1',
        name: 'bubble.png',
        status: 'done',
        url: data.bubbleIconUrl,
      }]);
    }

    setLoading(false);
  }, [id, navigate, form]);

  // Sync formValues.greeting to form when it changes
  useEffect(() => {
    if (formValues.greeting) {
      form.setFieldValue('greeting', formValues.greeting);
    }
  }, [formValues.greeting, form]);

  const handleToggle = (checked: boolean) => {
    if (!id) return;
    const newStatus = checked ? 'active' : 'inactive';
    updateAIAssistant(id, { status: newStatus });
    if (assistant) {
      setAssistant({ ...assistant, status: newStatus });
    }
  };

  const handleSave = async () => {
    if (!id) return;

    try {
      const values = await form.validateFields();
      updateAIAssistant(id, {
        name: values.name,
        greeting: values.greeting,
        knowledgeIds: values.knowledgeIds || [],
        systemPrompt: formValues.systemPrompt,
        primaryColor: formValues.primaryColor,
        botAvatarUrl: formValues.botAvatarUrl,
        bubbleIconUrl: formValues.bubbleIconUrl,
        footerText: formValues.footerText,
      });
      message.success('AIアシスタントを更新しました！');
      navigate('/ai-assistants');
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCopyEmbed = async () => {
    if (!assistant) return;
    const embedCode = `<script src="https://tomosia-mgpt.com/embed.js" data-assistant-id="${assistant.id}"></script>`;
    try {
      await navigator.clipboard.writeText(embedCode);
      message.success('埋め込みコードをコピーしました');
    } catch (error) {
      message.error('コピーに失敗しました');
    }
  };

  // Image upload handlers
  const handleImageUpload = async (file: File, type: 'avatar' | 'bubble'): Promise<boolean> => {
    // Validate file type
    if (!validateImageType(file)) {
      message.error('画像形式が無効です。JPG、PNG、SVGのみ対応しています。');
      return false;
    }

    // File size validation removed as per feedback

    try {
      const base64 = await encodeFileToBase64(file);
      if (type === 'avatar') {
        setFormValues({ ...formValues, botAvatarUrl: base64 });
      } else {
        setFormValues({ ...formValues, bubbleIconUrl: base64 });
      }
      return true;
    } catch (error) {
      message.error('画像のアップロードに失敗しました');
      return false;
    }
  };

  const botAvatarUploadProps: UploadProps = {
    listType: 'picture-card',
    fileList: botAvatarFileList,
    maxCount: 1,
    beforeUpload: async (file) => {
      const success = await handleImageUpload(file, 'avatar');
      if (success) {
        setBotAvatarFileList([{
          uid: file.uid,
          name: file.name,
          status: 'done',
          url: URL.createObjectURL(file),
        }]);
      }
      return false; // Prevent auto upload
    },
    onRemove: () => {
      setBotAvatarFileList([]);
      setFormValues({ ...formValues, botAvatarUrl: '' });
    },
  };

  const bubbleIconUploadProps: UploadProps = {
    listType: 'picture-card',
    fileList: bubbleIconFileList,
    maxCount: 1,
    beforeUpload: async (file) => {
      const success = await handleImageUpload(file, 'bubble');
      if (success) {
        setBubbleIconFileList([{
          uid: file.uid,
          name: file.name,
          status: 'done',
          url: URL.createObjectURL(file),
        }]);
      }
      return false; // Prevent auto upload
    },
    onRemove: () => {
      setBubbleIconFileList([]);
      setFormValues({ ...formValues, bubbleIconUrl: '' });
    },
  };

  if (loading || !assistant) {
    return <div>読み込み中...</div>;
  }

  const knowledgeBases = getKnowledgeBase();
  const embedCode = `<script src="https://tomosia-mgpt.com/embed.js" data-assistant-id="${assistant.id}"></script>`;

  return (
    <div style={{ padding: '24px', background: '#fff', minHeight: '100vh' }}>
      {/* Header with Breadcrumb and Action Buttons */}
      <div style={{ marginBottom: 24 }}>
        <Breadcrumb
          style={{ marginBottom: 16 }}
          items={[
            {
              title: <Link to="/ai-assistants">AIアシスタント</Link>,
            },
            {
              title: `設定: ${assistant.name}`,
            },
          ]}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>アシスタント設定</Title>
          <Space size="large">
            <Space>
              <span>ステータス:</span>
              <Switch
                checked={assistant.status === 'active'}
                onChange={handleToggle}
                checkedChildren="有効"
                unCheckedChildren="無効"
              />
            </Space>

            <Button type="primary" onClick={handleSave} icon={<SaveOutlined />}>
              設定を保存
            </Button>
          </Space>
        </div>
      </div>

      {/* 3-column layout */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Column 1: Basic Settings (35%) */}
        <div style={{ flex: '0 0 35%' }}>
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
          >
            <Title level={4}>基本設定</Title>

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
              <Input
                placeholder="例: テクニカルサポート"
                value={formValues.name}
                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
              />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  システム指示{' '}
                  <Popover
                    content={
                      <div style={{ maxWidth: 300 }}>
                        <p style={{ margin: 0, marginBottom: 8, fontWeight: 'bold' }}>システム指示とは？</p>
                        <p style={{ margin: 0, marginBottom: 8 }}>
                          AIアシスタントの振る舞いや口調を制御するための指示です。
                        </p>
                        <p style={{ margin: 0, marginBottom: 8 }}>
                          <strong>例:</strong>
                        </p>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          <li>「あなたは親切なカスタマーサポート担当者です」</li>
                          <li>「専門的な技術用語を使って説明してください」</li>
                          <li>「簡潔に要点だけを答えてください」</li>
                        </ul>
                      </div>
                    }
                    title="システム指示"
                    trigger="click"
                  >
                    <QuestionCircleOutlined style={{ color: '#1677ff', cursor: 'pointer' }} />
                  </Popover>
                </span>
              }
            >
              <Input.TextArea
                rows={4}
                placeholder="例: あなたは親切なカスタマーサポート担当者です。"
                value={formValues.systemPrompt}
                onChange={(e) => setFormValues({ ...formValues, systemPrompt: e.target.value })}
              />
            </Form.Item>

            <div style={{ marginBottom: 24 }}>
              <Space direction="vertical" size={4} style={{ width: '100%', marginBottom: 8 }}>
                <Title level={5} style={{ margin: 0 }}>デフォルトの挨拶 <span style={{ color: '#ff4d4f' }}>*</span></Title>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Markdown形式で入力できます（見出し、太字、リスト、リンクなど）
                </Typography.Text>
              </Space>
              <Form.Item
                name="greeting"
                rules={[
                  {
                    required: true,
                    message: 'デフォルトの挨拶を入力してください',
                  },
                ]}
                style={{ marginBottom: 0 }}
              >
                <MarkdownEditor
                  onChange={(value) => {
                    setFormValues({ ...formValues, greeting: value || '' });
                    form.setFieldValue('greeting', value);
                  }}
                  initValue={formValues.greeting || DEFAULT_GREETING || ''}
                  style={{
                    minHeight: 200,
                    maxHeight: 400,
                    overflow: 'auto',
                    border: '1px solid #d9d9d9',
                    borderRadius: 4,
                    backgroundColor: '#ffffff',
                  }}
                />
              </Form.Item>
            </div>

            <Divider />

            <Title level={4}>ナレッジベース連携</Title>

            <Form.Item
              name="knowledgeIds"
              label="連携済みナレッジベース"
            >
              <Select
                mode="multiple"
                allowClear
                placeholder="トレーニング用のナレッジベースを選択してください..."
                value={formValues.knowledgeIds}
                onChange={(value) => setFormValues({ ...formValues, knowledgeIds: value })}
                options={knowledgeBases.map((kb) => ({
                  label: kb.name,
                  value: kb.id,
                }))}
              />
            </Form.Item>

            <Divider />

            <Title level={4}>Webサイトへの埋め込み</Title>

            <Paragraph>
              以下のコードをあなたのWebサイトに貼り付けることで、AIアシスタントを埋め込むことができます。
            </Paragraph>
            <Paragraph type="secondary">
              （注：MVP版のため、このコードはプレースホルダーです）
            </Paragraph>

            <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
              <Input
                readOnly
                value={embedCode}
                style={{ flex: 1 }}
              />
              <Button
                type="primary"
                icon={<CopyOutlined />}
                onClick={handleCopyEmbed}
              >
                コピー
              </Button>
            </Space.Compact>
          </Form>
        </div>

        {/* Column 2: UI Customization (30%) */}
        <div style={{ flex: '0 0 30%' }}>
          <Title level={4}>UIカスタマイズ</Title>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ marginBottom: '8px', fontSize: '14px' }}>テーマカラー</div>
              <ColorPicker
                value={formValues.primaryColor}
                onChange={(color) => {
                  setFormValues({ ...formValues, primaryColor: color.toHexString() });
                }}
                showText
              />
            </div>

            <div>
              <div style={{ marginBottom: '8px', fontSize: '14px' }}>フッターテキスト</div>
              <Input
                placeholder="例: Prompted by CONFERENCE PARK"
                value={formValues.footerText}
                onChange={(e) => setFormValues({ ...formValues, footerText: e.target.value })}
              />
            </div>

            <div>
              <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                <Tooltip title="推奨サイズ: 32x32px">
                  <span>アシスタントアイコン</span>
                </Tooltip>
              </div>
              <Upload {...botAvatarUploadProps}>
                {botAvatarFileList.length === 0 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>アップロード</div>
                  </div>
                )}
              </Upload>
            </div>

            <div>
              <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                <Tooltip title="推奨サイズ: 60x60px">
                  <span>バブルアイコン</span>
                </Tooltip>
              </div>
              <Upload {...bubbleIconUploadProps}>
                {bubbleIconFileList.length === 0 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>アップロード</div>
                  </div>
                )}
              </Upload>
            </div>
          </div>
        </div>

        {/* Column 3: Live Preview (35%) */}
        <div style={{ flex: '0 0 35%' }}>
          <ChatPreview
            assistantName={formValues.name}
            greeting={formValues.greeting}
            knowledgeBaseCount={formValues.knowledgeIds.length}
            primaryColor={formValues.primaryColor}
            botAvatarUrl={formValues.botAvatarUrl}
            bubbleIconUrl={formValues.bubbleIconUrl}
            footerText={formValues.footerText}
          />
        </div>
      </div>
    </div>
  );
}

export default AIAssistantConfigPage;
