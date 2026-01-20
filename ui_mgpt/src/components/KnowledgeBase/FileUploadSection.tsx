import { useState } from 'react';
import { Typography, Upload, List, Button, message } from 'antd';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { KnowledgeSource } from '@/types';
import { validateFileSize, encodeFileToBase64 } from '@/utils/storage';

const { Title } = Typography;
const { Dragger } = Upload;

interface FileUploadSectionProps {
  files: KnowledgeSource[];
  onFilesChange: (files: KnowledgeSource[]) => void;
  onCharCountChange: (totalChars: number) => void;
}

function FileUploadSection({ files, onFilesChange, onCharCountChange }: FileUploadSectionProps) {
  const [uploading, setUploading] = useState(false);

  const handleMultipleUpload = async (fileList: File[]) => {
    setUploading(true);
    const newFileSources: KnowledgeSource[] = [];

    try {
      for (const file of fileList) {
        // Validate file size (max 2MB)
        if (!validateFileSize(file.size, 2)) {
          message.error(`${file.name}: ファイルサイズは2MB以下にしてください`);
          continue;
        }

        try {
          // Encode to Base64
          const base64 = await encodeFileToBase64(file);

          // Mock character count (approximate: file size * 1.5)
          const characterCount = Math.floor(file.size * 1.5);

          // Create new file source
          const newFileSource: KnowledgeSource = {
            id: crypto.randomUUID(),
            type: 'file',
            content: base64,
            fileName: file.name,
            characterCount,
            isActive: true,
            status: 'success',
            createdAt: new Date().toISOString(),
          };

          newFileSources.push(newFileSource);
        } catch (error) {
          message.error(`${file.name}: ファイルの読み込みに失敗しました`);
          console.error('File upload error:', error);
        }
      }

      if (newFileSources.length > 0) {
        const updatedFiles = [...files, ...newFileSources];
        onFilesChange(updatedFiles);

        // Calculate total character count
        const totalChars = updatedFiles.reduce((sum, f) => sum + f.characterCount, 0);
        onCharCountChange(totalChars);

        message.success(`${newFileSources.length} 件のファイルをアップロードしました`);
      }
    } finally {
      setUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    fileList: [],
    beforeUpload: (file, fileList) => {
      // Process all files at once
      if (fileList.length > 0 && file === fileList[0]) {
        handleMultipleUpload(fileList);
      }
      return false; // Prevent auto upload
    },
  };

  const handleDelete = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    onFilesChange(updatedFiles);

    // Recalculate total character count
    const totalChars = updatedFiles.reduce((sum, f) => sum + f.characterCount, 0);
    onCharCountChange(totalChars);

    message.success('ファイルを削除しました');
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <Title level={5}>ファイル</Title>
      <Dragger {...uploadProps} disabled={uploading}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          クリックまたはドラッグ＆ドロップでファイルをアップロード
        </p>
        <p className="ant-upload-hint">
          対応形式: PDF, DOC, DOCX, TXT (最大2MB) | 複数選択可能
        </p>
      </Dragger>

      {files.length > 0 && (
        <List
          style={{ marginTop: 16 }}
          dataSource={files}
          renderItem={(file) => (
            <List.Item
              actions={[
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(file.id)}
                >
                  削除
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={file.fileName}
                description={`${file.characterCount} 文字（推定）`}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
}

export default FileUploadSection;

