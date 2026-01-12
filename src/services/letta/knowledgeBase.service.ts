import { sourceLettaService } from './index.js';
import { KnowledgeBase as KnowledgeBaseModel } from '@/models/index.js';
import { Status } from '@/constants/status.constants.js';

interface KnowledgeBase {
  id: string;
  name: string;
  description?: string | null;
  content: string | null;
  letta_source_id?: string | null;
  status: string;
  organization_id: string;
  created_at: Date;
  updated_at: Date;
}

interface CreateKnowledgeBaseInput {
  name: string;
  description?: string;
  content: string;
  organization_id: string;
}

class KnowledgeBaseService {
  async createKnowledgeBase(input: CreateKnowledgeBaseInput): Promise<KnowledgeBase> {
    const kb = await KnowledgeBaseModel.create({
      name: input.name,
      description: input.description || '',
      content: input.content,
      status: Status.PROCESSING,
      organization_id: input.organization_id,
    });

    const kbJson = kb.toJSON() as KnowledgeBase;

    this.createLettaSource(kbJson).catch(async error => {
      console.error(`Failed to create Letta source for KB ${kb.id}:`, error);
      await kb.update({ status: Status.FAILED });
    });

    return kbJson;
  }

  private async createLettaSource(kb: KnowledgeBase): Promise<void> {
    try {
      const source = await sourceLettaService.createSource({
        name: kb.name,
        description: kb.description || '',
        content: kb.content || '',
      });

      await KnowledgeBaseModel.update(
        { letta_source_id: source.id, status: Status.SUCCESS },
        { where: { id: kb.id } }
      );
    } catch (error) {
      console.error(`Failed to create Letta source for KB ${kb.id}:`, error);
      throw error;
    }
  }

  async getKnowledgeBase(id: string): Promise<KnowledgeBase | null> {
    const kb = await KnowledgeBaseModel.findByPk(id);
    return kb ? (kb.toJSON() as KnowledgeBase) : null;
  }

  async listKnowledgeBases(orgId?: string): Promise<KnowledgeBase[]> {
    const kbs = await KnowledgeBaseModel.findAll({
      where: orgId ? { organization_id: orgId } : {},
      order: [['created_at', 'DESC']],
    });

    return kbs.map(kb => kb.toJSON() as KnowledgeBase);
  }

  async updateKnowledgeBase(id: string, updates: Partial<CreateKnowledgeBaseInput>): Promise<void> {
    const { name, description, content } = updates;

    const updateData: Partial<CreateKnowledgeBaseInput> & { status?: Status.PENDING | Status.PROCESSING | Status.SUCCESS | Status.FAILED } = {};

    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    if (content) {
      updateData.content = content;
      updateData.status = Status.PROCESSING;
    }

    if (Object.keys(updateData).length === 0) return;

    await KnowledgeBaseModel.update(updateData, { where: { id } });

    const kb = await this.getKnowledgeBase(id);
    if (kb && content && kb.letta_source_id) {
      this.updateLettaSource(kb).catch(error => {
        console.error(`Failed to update Letta source for KB ${kb.id}:`, error);
      });
    }
  }

  private async updateLettaSource(kb: KnowledgeBase): Promise<void> {
    try {
      if (!kb.letta_source_id) {
        await this.createLettaSource(kb);
        return;
      }

      await sourceLettaService.deleteSource(kb.letta_source_id);
      await this.createLettaSource(kb);
    } catch (error) {
      console.error(`Failed to update Letta source for KB ${kb.id}:`, error);
      throw error;
    }
  }

  async deleteKnowledgeBase(id: string): Promise<void> {
    const kb = await this.getKnowledgeBase(id);
    if (!kb) return;

    if (kb.letta_source_id) {
      try {
        await sourceLettaService.deleteSource(kb.letta_source_id);
      } catch (error) {
        console.error(`Failed to delete Letta source ${kb.letta_source_id}:`, error);
      }
    }

    await KnowledgeBaseModel.destroy({ where: { id } });
  }
}

export default new KnowledgeBaseService();
