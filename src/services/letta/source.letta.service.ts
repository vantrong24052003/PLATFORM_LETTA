import HttpClient from '@/helpers/http.helper.js';
import { BaseLettaService } from './base.letta.service.js';

class SourceLettaService extends BaseLettaService {
  async createSource(params: { name: string; description: string; content: string }): Promise<any> {
    const source = await HttpClient.post(`${this.baseURL}/sources`, { name: params.name, description: params.description }, { headers: this.headers });

    const formData = new FormData();
    const blob = new Blob([params.content], { type: 'text/plain' });
    formData.append('file', blob, `${params.name}.txt`);

    await HttpClient.post(`${this.baseURL}/sources/${source.id}/upload`, formData, { headers: this.headers });

    return source;
  }

  async getSource(sourceId: string): Promise<any> {
    return await HttpClient.get(`${this.baseURL}/sources/${sourceId}`, { headers: this.headers });
  }

  async listSources(): Promise<any> {
    return await HttpClient.get(`${this.baseURL}/sources`, { headers: this.headers });
  }

  async deleteSource(sourceId: string): Promise<void> {
    await HttpClient.delete(`${this.baseURL}/sources/${sourceId}`, { headers: this.headers });
  }

  async attachSourceToAgent(agentId: string, sourceId: string): Promise<void> {
    await HttpClient.post(`${this.baseURL}/agents/${agentId}/sources/${sourceId}/attach`, null, { headers: this.headers });
  }

  async detachSourceFromAgent(agentId: string, sourceId: string): Promise<void> {
    await HttpClient.post(`${this.baseURL}/agents/${agentId}/sources/${sourceId}/detach`, null, { headers: this.headers });
  }
}

export default new SourceLettaService();
