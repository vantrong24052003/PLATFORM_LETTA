// 参照: openspec/changes/redesign-knowledge-base-form/specs/data-persistence/spec.md

import { KnowledgeBase, OldKnowledgeBase, KnowledgeSource, KnowledgeSourceType, AIAssistant, CreateKnowledgeBaseInput, UpdateKnowledgeBaseInput } from '@/types';

export const storageKeys = {
  KNOWLEDGE_BASE: 'knowledge_base',
  AI_ASSISTANTS: 'ai_assistants',
} as const;

// Helper Functions

// Calculate total character count from active sources
export const calculateTotalCharCount = (sources: KnowledgeSource[]): number => {
  return sources
    .filter(source => {
      // Websites: Only count if isActive and successful
      if (source.type === 'website') {
        return source.isActive && source.status === 'success';
      }
      // Text and files: Always count
      return true;
    })
    .reduce((sum, source) => sum + source.characterCount, 0);
};

// Encode file to Base64
export const encodeFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
    reader.readAsDataURL(file);
  });
};

// Get sources by type
export const getSourcesByType = (
  kb: KnowledgeBase,
  type: KnowledgeSourceType
): KnowledgeSource[] => {
  return kb.sources.filter(source => source.type === type);
};

// Toggle website source active status
export const toggleWebsiteSource = (
  kbId: string,
  sourceId: string,
  isActive: boolean
): void => {
  const items = getKnowledgeBase();
  const kb = items.find(item => item.id === kbId);
  if (!kb) throw new Error('Knowledge base not found');

  const source = kb.sources.find(s => s.id === sourceId);
  if (!source || source.type !== 'website') {
    throw new Error('Website source not found');
  }

  source.isActive = isActive;
  kb.totalCharacterCount = calculateTotalCharCount(kb.sources);
  kb.updatedAt = new Date().toISOString();

  saveKnowledgeBase(items);
};

// Migrate old format to new format
const migrateKnowledgeBase = (oldKB: OldKnowledgeBase): KnowledgeBase => {
  console.warn(`Migrating knowledge base ${oldKB.id} from old format to new format`);
  return {
    id: oldKB.id,
    name: oldKB.name,
    sources: [
      {
        id: crypto.randomUUID(),
        type: oldKB.type,
        content: oldKB.content,
        characterCount: oldKB.content.length,
        isActive: true,
        status: 'success',
        createdAt: oldKB.createdAt || new Date().toISOString(),
      }
    ],
    assets: [],
    totalCharacterCount: oldKB.content.length,
    status: oldKB.status,
    updatedAt: oldKB.updatedAt,
    createdAt: oldKB.createdAt || new Date().toISOString(),
  };
};

// Knowledge Base storage functions
export const getKnowledgeBase = (): KnowledgeBase[] => {
  try {
    const data = localStorage.getItem(storageKeys.KNOWLEDGE_BASE);
    if (!data) return [];

    const parsed = JSON.parse(data);

    // Validate and migrate data if needed
    if (!Array.isArray(parsed)) {
      console.warn('Invalid knowledge base data format, resetting to empty array');
      return [];
    }

    // Check if migration is needed (old format detection)
    const needsMigration = parsed.some(item =>
      'type' in item && 'content' in item && !('sources' in item)
    );

    if (needsMigration) {
      console.warn('Detected old format data, migrating to new format...');
      const migrated = parsed.map(item => {
        if ('sources' in item) {
          return item as KnowledgeBase;
        }
        return migrateKnowledgeBase(item as OldKnowledgeBase);
      });
      // Save migrated data
      saveKnowledgeBase(migrated);
      return migrated;
    }

    return parsed as KnowledgeBase[];
  } catch (error) {
    console.warn('Failed to parse knowledge base data:', error);
    return [];
  }
};

export const saveKnowledgeBase = (items: KnowledgeBase[]): void => {
  try {
    localStorage.setItem(storageKeys.KNOWLEDGE_BASE, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save knowledge base data:', error);
    throw new Error('ストレージの容量を超えています。データを保存できません。');
  }
};

export const getKnowledgeBaseById = (id: string): KnowledgeBase | undefined => {
  const items = getKnowledgeBase();
  return items.find(item => item.id === id);
};

export const addKnowledgeBase = (input: CreateKnowledgeBaseInput): KnowledgeBase => {
  const items = getKnowledgeBase();
  const now = new Date().toISOString();
  const newItem: KnowledgeBase = {
    id: crypto.randomUUID(),
    name: input.name,
    sources: input.sources,
    assets: input.assets,
    totalCharacterCount: calculateTotalCharCount(input.sources),
    status: 'processing',
    createdAt: now,
    updatedAt: now,
  };
  items.push(newItem);
  saveKnowledgeBase(items);
  return newItem;
};

export const updateKnowledgeBase = (id: string, updates: UpdateKnowledgeBaseInput): void => {
  const items = getKnowledgeBase();
  const index = items.findIndex(item => item.id === id);

  if (index === -1) {
    throw new Error('Knowledge base item not found');
  }

  const updated = {
    ...items[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Recalculate totalCharacterCount if sources are updated
  if (updates.sources) {
    updated.totalCharacterCount = calculateTotalCharCount(updates.sources);
  }

  items[index] = updated;
  saveKnowledgeBase(items);
};

export const deleteKnowledgeBase = (id: string): void => {
  const items = getKnowledgeBase();
  const filtered = items.filter(item => item.id !== id);
  saveKnowledgeBase(filtered);
};

// AI Assistants storage functions
export const getAIAssistants = (): AIAssistant[] => {
  try {
    const data = localStorage.getItem(storageKeys.AI_ASSISTANTS);
    if (!data) return [];

    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      console.warn('Invalid AI assistants data format, resetting to empty array');
      return [];
    }

    return parsed;
  } catch (error) {
    console.warn('Failed to parse AI assistants data:', error);
    return [];
  }
};

export const saveAIAssistants = (items: AIAssistant[]): void => {
  try {
    localStorage.setItem(storageKeys.AI_ASSISTANTS, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save AI assistants data:', error);
    throw new Error('ストレージの容量を超えています。データを保存できません。');
  }
};

export const getAIAssistantById = (id: string): AIAssistant | undefined => {
  const items = getAIAssistants();
  return items.find(item => item.id === id);
};

export const addAIAssistant = (item: Omit<AIAssistant, 'id' | 'createdAt' | 'updatedAt'>): AIAssistant => {
  const items = getAIAssistants();
  const now = new Date().toISOString();
  const newItem: AIAssistant = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  items.push(newItem);
  saveAIAssistants(items);
  return newItem;
};

export const updateAIAssistant = (id: string, updates: Partial<Omit<AIAssistant, 'id' | 'createdAt'>>): void => {
  const items = getAIAssistants();
  const index = items.findIndex(item => item.id === id);

  if (index === -1) {
    throw new Error('AI assistant not found');
  }

  items[index] = {
    ...items[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveAIAssistants(items);
};

export const deleteAIAssistant = (id: string): void => {
  const items = getAIAssistants();
  const filtered = items.filter(item => item.id !== id);
  saveAIAssistants(filtered);
};

// Validation helper functions
export const validateFileSize = (sizeInBytes: number, maxMB: number = 5): boolean => {
  const maxBytes = maxMB * 1024 * 1024;
  return sizeInBytes <= maxBytes;
};

export const validateURL = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

// Image validation for customization (PRD v1.3)
export const validateImageType = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
  return validTypes.includes(file.type);
};

export const validateImageSize = (file: File, maxKB: number = 100): boolean => {
  const maxBytes = maxKB * 1024;
  return file.size <= maxBytes;
};

