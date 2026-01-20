import { ToolOptions } from '@/types/index.js';
import { BaseLettaService } from './base.letta.service.js';

class ToolLettaService extends BaseLettaService {
  async upsertTool(options: ToolOptions): Promise<any> {
    const toolData: any = {
      source_code: options.sourceCode,
      description: options.description,
    };

    if (options.jsonSchema && Object.keys(options.jsonSchema).length > 0) {
      toolData.args_json_schema = options.jsonSchema;
    }

    if (options.defaultRequiresApproval !== undefined) {
      toolData.default_requires_approval = options.defaultRequiresApproval;
    }

    return await this.client.tools.upsert(toolData);
  }

  async listTools(): Promise<any> {
    try {
      return await this.client.tools.list();
    } catch (error) {
      console.error('[ToolLettaService] Failed to list tools:', error);
      throw new Error(`Failed to connect to Letta server: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export default new ToolLettaService();
