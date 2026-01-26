import { useState, useRef, useEffect } from 'react';
import { Typography, Input, Button, Collapse, Tag, Switch, Modal, Spin, message, Card, Space } from 'antd';
import { GlobalOutlined, DeleteOutlined, LoadingOutlined, CheckCircleOutlined, LinkOutlined } from '@ant-design/icons';
import { KnowledgeSource } from '@/types';
import { validateURL } from '@/utils/storage';

const { Title } = Typography;
const { TextArea } = Input;

interface WebsiteCrawlSectionProps {
  websites: KnowledgeSource[];
  onWebsitesChange: (websites: KnowledgeSource[]) => void;
  onCharCountChange: (totalChars: number) => void;
}

function WebsiteCrawlSection({ websites, onWebsitesChange, onCharCountChange }: WebsiteCrawlSectionProps) {
  const [url, setUrl] = useState('');
  const [suggestedLinks, setSuggestedLinks] = useState<string[]>([]);
  const websitesRef = useRef<KnowledgeSource[]>(websites);

  // Keep ref in sync with prop
  useEffect(() => {
    websitesRef.current = websites;
  }, [websites]);

  // Generate suggested links based on crawled URL (mock)
  const generateSuggestedLinks = (baseUrl: string): string[] => {
    try {
      const url = new URL(baseUrl);
      const domain = url.origin;

      // Generate mock suggested links
      const suggestions = [
        `${domain}/about`,
        `${domain}/products`,
        `${domain}/services`,
        `${domain}/contact`,
        `${domain}/blog`,
      ];

      return suggestions;
    } catch {
      return [];
    }
  };


  // Mock crawl website (for demo on Vercel)
  const crawlWebsite = async (targetUrl: string, websiteId: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // Generate mock content based on URL
      const mockContent = `${targetUrl} からクロールされたコンテンツのサンプル

## 概要
これはデモ用のモックデータです。実際の本番環境では、サーバーサイドでのクロール実装が推奨されます。

## 主な内容
${targetUrl} に関する詳細情報がここに表示されます。

### セクション1: イントロダクション
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

### セクション2: 詳細情報
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### セクション3: まとめ
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.

## 技術スタック
- React
- TypeScript
- Ant Design
- Vite

## 関連リンク
- Documentation
- API Reference
- GitHub Repository

---
注: これはデモ用のサンプルコンテンツです。実際のウェブサイトからクロールされたものではありません。
`.repeat(3); // Repeat for more content

      const completedWebsite: KnowledgeSource = {
        id: websiteId,
        type: 'website',
        url: targetUrl,
        content: mockContent,
        characterCount: mockContent.length,
        isActive: true,
        status: 'success',
        createdAt: new Date().toISOString(),
      };

      // Update website in list
      const currentWebsites = websitesRef.current;
      const finalWebsites = currentWebsites.map(w =>
        w.id === websiteId ? completedWebsite : w
      );

      onWebsitesChange(finalWebsites);

      // Recalculate total after completion
      const totalChars = finalWebsites
        .filter(w => w.isActive && w.status === 'success')
        .reduce((sum, w) => sum + w.characterCount, 0);
      onCharCountChange(totalChars);

      message.success(`${targetUrl} のクロールが完了しました (${mockContent.length}文字) - デモモード`);

      // Generate suggested links and filter out already crawled ones
      const suggestions = generateSuggestedLinks(targetUrl);
      const currentWebsitesUrls = websitesRef.current.map(w => w.url);
      const filteredSuggestions = suggestions.filter(s => !currentWebsitesUrls.includes(s));
      setSuggestedLinks(filteredSuggestions);
    } catch (error) {
      console.error('Crawl error:', error);

      // Mark as failed
      const currentWebsites = websitesRef.current;
      const failedWebsites = currentWebsites.map(w =>
        w.id === websiteId
          ? { ...w, status: 'error' as const, content: 'クロールに失敗しました' }
          : w
      );

      onWebsitesChange(failedWebsites);
      message.error(`${targetUrl} のクロールに失敗しました`);
    }
  };

  const handleAddAndCrawl = (urlToAdd?: string) => {
    const trimmedUrl = (urlToAdd || url).trim();

    // Validate URL
    if (!trimmedUrl) {
      message.error('URLを入力してください');
      return;
    }

    if (!validateURL(trimmedUrl)) {
      message.error('有効なURLを入力してください');
      return;
    }

    // Check for duplicates
    if (websites.some(w => w.url === trimmedUrl)) {
      message.error('このURLは既に追加されています');
      return;
    }

    // Create new website source with processing status
    const newWebsite: KnowledgeSource = {
      id: crypto.randomUUID(),
      type: 'website',
      content: '',
      url: trimmedUrl,
      characterCount: 0,
      isActive: true,
      status: 'processing',
      createdAt: new Date().toISOString(),
    };

    // Immediately add to list (non-blocking)
    const updatedWebsites = [...websites, newWebsite];
    onWebsitesChange(updatedWebsites);

    // Clear input only if it's from manual input (not from suggested link)
    if (!urlToAdd) {
      setUrl('');
    }

    message.info(`${trimmedUrl} をクロールキューに追加しました`);

    // Start async crawl in background (non-blocking)
    const websiteId = newWebsite.id;
    crawlWebsite(trimmedUrl, websiteId);
  };

  const handleToggle = (websiteId: string, checked: boolean) => {
    const updatedWebsites = websites.map(w =>
      w.id === websiteId ? { ...w, isActive: checked } : w
    );
    onWebsitesChange(updatedWebsites);

    // Recalculate total character count
    const totalChars = updatedWebsites
      .filter(w => w.isActive && w.status === 'success')
      .reduce((sum, w) => sum + w.characterCount, 0);
    onCharCountChange(totalChars);
  };

  const handleDelete = (websiteId: string) => {
    Modal.confirm({
      title: '削除確認',
      content: 'このURLを削除してもよろしいですか？',
      okText: '削除',
      okType: 'danger',
      cancelText: 'キャンセル',
      onOk: () => {
        const updatedWebsites = websites.filter(w => w.id !== websiteId);
        onWebsitesChange(updatedWebsites);

        // Recalculate total character count
        const totalChars = updatedWebsites
          .filter(w => w.isActive && w.status === 'success')
          .reduce((sum, w) => sum + w.characterCount, 0);
        onCharCountChange(totalChars);

        message.success('URLを削除しました');
      },
    });
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <Title level={5}>ウェブサイト</Title>
      <div style={{ marginBottom: 8 }}>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          複数のURLを連続して追加できます。クロールは自動的にバックグラウンドで実行されます。（デモモード: サンプルデータを生成します）
        </Typography.Text>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <Input
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          prefix={<GlobalOutlined />}
          size="large"
          onPressEnter={() => handleAddAndCrawl()}
        />
        <Button
          type="primary"
          onClick={() => handleAddAndCrawl()}
          size="large"
        >
          追加＆クロール
        </Button>
      </div>

      {/* Suggested Links */}
      {suggestedLinks.length > 0 && (
        <Card
          size="small"
          title={
            <Space>
              <LinkOutlined />
              <span>検出されたリンク（クリックして追加）</span>
            </Space>
          }
          style={{ marginBottom: 16 }}
        >
          <Space wrap>
            {suggestedLinks.map((link, index) => (
              <Tag
                key={index}
                color="blue"
                style={{ cursor: 'pointer', marginBottom: 4 }}
                onClick={() => {
                  // Check if not already added
                  if (!websites.some(w => w.url === link)) {
                    handleAddAndCrawl(link);
                  } else {
                    message.info('このURLは既に追加されています');
                  }
                }}
              >
                {link}
              </Tag>
            ))}
          </Space>
        </Card>
      )}

      {websites.length > 0 && (
        <Collapse
          items={websites.map((website) => ({
            key: website.id,
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                <span style={{ flex: 1 }}>{website.url}</span>
                {website.status === 'processing' && (
                  <Tag icon={<LoadingOutlined />} color="processing">クロール中...</Tag>
                )}
                {website.status === 'error' && (
                  <Tag color="error">エラー</Tag>
                )}
                {website.status === 'success' && website.isActive && (
                  <Tag icon={<CheckCircleOutlined />} color="success">
                    完了 ({website.characterCount}文字)
                  </Tag>
                )}
                {website.status === 'success' && !website.isActive && (
                  <Tag>オフ</Tag>
                )}
                {website.status === 'success' && (
                  <div style={{ display: 'flex', gap: 8 }} onClick={(e) => e.stopPropagation()}>
                    <Switch
                      checked={website.isActive}
                      onChange={(checked) => handleToggle(website.id, checked)}
                      size="small"
                    />
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={() => handleDelete(website.id)}
                    />
                  </div>
                )}
              </div>
            ),
            children: (
              <>
                {website.status === 'processing' && (
                  <div style={{ textAlign: 'center', padding: 24 }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 16, color: '#8c8c8c' }}>
                      クロール中です。しばらくお待ちください...
                    </div>
                  </div>
                )}
                {website.status === 'error' && (
                  <div style={{ padding: 16, color: '#ff4d4f' }}>
                    <p>クロールに失敗しました。</p>
                    <p style={{ fontSize: 12, color: '#8c8c8c', marginTop: 8 }}>
                      考えられる原因：
                    </p>
                    <ul style={{ fontSize: 12, color: '#8c8c8c', marginLeft: 20 }}>
                      <li>ウェブサイトがCORSを許可していない</li>
                      <li>ネットワークエラー</li>
                      <li>URLが正しくない</li>
                    </ul>
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(website.id)}
                      style={{ padding: 0, marginTop: 8 }}
                    >
                      削除して再試行
                    </Button>
                  </div>
                )}
                {website.status === 'success' && (
                  <TextArea
                    value={website.content}
                    readOnly
                    rows={10}
                    style={{ backgroundColor: '#f5f5f5' }}
                  />
                )}
              </>
            ),
          }))}
        />
      )}
    </div>
  );
}

export default WebsiteCrawlSection;

