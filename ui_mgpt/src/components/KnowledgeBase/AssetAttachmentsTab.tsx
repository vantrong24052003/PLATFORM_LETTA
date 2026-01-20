import { Upload, List, Image, Button, Input, Empty, Modal, message, Typography } from 'antd';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { AssetAttachment } from '@/types';
import { validateFileSize, encodeFileToBase64 } from '@/utils/storage';

const { TextArea } = Input;
const { Text } = Typography;

interface AssetAttachmentsTabProps {
  assets: AssetAttachment[];
  onAssetsChange: (assets: AssetAttachment[]) => void;
}

function AssetAttachmentsTab({ assets, onAssetsChange }: AssetAttachmentsTabProps) {
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: 'image/*,video/*',
    fileList: [],
    beforeUpload: async (file) => {
      // Validate file size (max 2MB)
      if (!validateFileSize(file.size, 2)) {
        message.error('ファイルサイズは2MB以下にしてください');
        return Upload.LIST_IGNORE;
      }

      // Validate file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        message.error('画像または動画ファイルをアップロードしてください');
        return Upload.LIST_IGNORE;
      }

      // Check max assets limit
      if (assets.length >= 20) {
        message.error('アセットは最大20個までです');
        return Upload.LIST_IGNORE;
      }

      try {
        // Encode to Base64
        const base64 = await encodeFileToBase64(file);

        // Create new asset
        const newAsset: AssetAttachment = {
          id: crypto.randomUUID(),
          type: file.type.startsWith('image/') ? 'image' : 'video',
          fileName: file.name,
          fileUrl: base64,
          aiDescription: '',
          thumbnail: base64, // For images, same as fileUrl; for videos, could generate
          createdAt: new Date().toISOString(),
        };

        onAssetsChange([...assets, newAsset]);
        message.success(`${file.name} をアップロードしました`);
      } catch (error) {
        message.error('ファイルの読み込みに失敗しました');
        console.error('Asset upload error:', error);
      }

      return false; // Prevent auto upload
    },
  };

  const handleDescriptionChange = (assetId: string, description: string) => {
    const updatedAssets = assets.map(asset =>
      asset.id === assetId ? { ...asset, aiDescription: description } : asset
    );
    onAssetsChange(updatedAssets);
  };

  const handleDelete = (assetId: string) => {
    Modal.confirm({
      title: '削除確認',
      content: 'このアセットを削除してもよろしいですか？',
      okText: '削除',
      okType: 'danger',
      cancelText: 'キャンセル',
      onOk: () => {
        const updatedAssets = assets.filter(asset => asset.id !== assetId);
        onAssetsChange(updatedAssets);
        message.success('アセットを削除しました');
      },
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 16, color: '#8c8c8c' }}>
        AIが参照して、エンドユーザーに提供できる画像・動画ファイルをアップロードしてください。
      </div>

      <Upload.Dragger {...uploadProps} style={{ marginBottom: 24 }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          クリックまたはドラッグ＆ドロップでファイルをアップロード
        </p>
        <p className="ant-upload-hint">
          対応形式: JPEG, PNG, GIF, MP4, MOV (各ファイル最大2MB)
        </p>
      </Upload.Dragger>

      {assets.length === 0 ? (
        <Empty
          description="まだアセットがアップロードされていません"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={assets}
          renderItem={(asset) => (
            <List.Item
              style={{
                padding: 16,
                border: '1px solid #f0f0f0',
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', width: '100%', gap: 16 }}>
                {/* Thumbnail */}
                <div style={{ flexShrink: 0 }}>
                  {asset.type === 'image' ? (
                    <Image
                      src={asset.thumbnail}
                      alt={asset.fileName}
                      width={80}
                      height={80}
                      style={{ objectFit: 'cover', borderRadius: 4 }}
                    />
                  ) : (
                    <video
                      src={asset.fileUrl}
                      width={80}
                      height={80}
                      style={{ objectFit: 'cover', borderRadius: 4 }}
                    />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <Text strong>{asset.fileName}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      AI用説明文（AIがこのファイルを検索・提供するための説明）
                    </Text>
                    <TextArea
                      rows={2}
                      placeholder="例: 製品Xの詳細画像"
                      value={asset.aiDescription}
                      onChange={(e) => handleDescriptionChange(asset.id, e.target.value)}
                      style={{ marginTop: 4 }}
                    />
                  </div>
                </div>

                {/* Delete button */}
                <div style={{ flexShrink: 0 }}>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(asset.id)}
                  >
                    削除
                  </Button>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
}

export default AssetAttachmentsTab;

