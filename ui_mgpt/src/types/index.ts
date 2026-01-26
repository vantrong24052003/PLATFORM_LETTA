// 参照: openspec/changes/redesign-knowledge-base-form/specs/data-persistence/spec.md

export type KnowledgeSourceType = 'text' | 'file' | 'website';

export type KnowledgeBaseStatus = 'processing' | 'success' | 'error';

// Knowledge Source - Individual data source within a Knowledge Base
export interface KnowledgeSource {
  id: string;
  type: KnowledgeSourceType;
  content: string;
  fileName?: string; // For file sources
  url?: string; // For website sources
  characterCount: number;
  isActive: boolean; // For websites (toggle on/off)
  status?: 'processing' | 'success' | 'error'; // For websites
  createdAt: string;
}

// Asset Attachment - Images/Videos for AI reference
export interface AssetAttachment {
  id: string;
  type: 'image' | 'video';
  fileName: string;
  fileUrl: string; // Base64 encoded
  aiDescription: string;
  thumbnail: string; // Base64 encoded
  createdAt: string;
}

// Knowledge Base - Main entity
export interface KnowledgeBase {
  id: string;
  name: string;
  sources: KnowledgeSource[]; // Multiple sources
  assets: AssetAttachment[]; // Asset attachments
  totalCharacterCount: number; // Calculated from active sources
  status: KnowledgeBaseStatus;
  updatedAt: string;
  createdAt: string;
}

// Old format for migration
export interface OldKnowledgeBase {
  id: string;
  name: string;
  type: KnowledgeSourceType;
  content: string;
  status: KnowledgeBaseStatus;
  updatedAt: string;
  createdAt?: string;
}

export type CreateKnowledgeBaseInput = {
  name: string;
  sources: KnowledgeSource[];
  assets: AssetAttachment[];
};

export type UpdateKnowledgeBaseInput = Partial<{
  name: string;
  sources: KnowledgeSource[];
  assets: AssetAttachment[];
  status: KnowledgeBaseStatus;
  updatedAt: string;
}>;

export type AIAssistantStatus = 'active' | 'inactive';

export interface AIAssistant {
  id: string;
  name: string;
  greeting: string;
  status: AIAssistantStatus;
  knowledgeIds: string[];
  createdAt: string;
  updatedAt: string;
  // Customization fields (PRD v1.3)
  systemPrompt?: string;
  primaryColor?: string; // Hex color, default: #1677ff
  botAvatarUrl?: string; // Base64 encoded image
  bubbleIconUrl?: string; // Base64 encoded image
  footerText?: string; // Footer copyright text
}

export type CreateAIAssistantInput = Omit<AIAssistant, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'knowledgeIds'>;

export type UpdateAIAssistantInput = Partial<Omit<AIAssistant, 'id' | 'createdAt'>>;

