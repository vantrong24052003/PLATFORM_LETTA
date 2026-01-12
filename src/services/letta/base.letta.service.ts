import Letta from '@letta-ai/letta-client';
import { config } from '@/config/letta.config.js';

export class BaseLettaService {
  protected client: Letta;
  protected baseURL: string;
  protected headers: Record<string, string>;

  constructor() {
    this.client = new Letta({
      apiKey: config.letta.apiKey,
      baseURL: config.letta.baseUrl,
      timeout: 600000
    });
    this.baseURL = config.letta.baseUrl;
    this.headers = {
      'Authorization': `Bearer ${config.letta.apiKey}`,
    };
  }
}
