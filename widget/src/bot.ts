import { API_BASE } from './config';
import type { BotConfig } from './types';

export async function loadBotConfig(chatbotId: string): Promise<BotConfig> {
  try {
    const response = await fetch(`${API_BASE}/bots/${chatbotId}`);

    if (!response.ok) {
      throw new Error(`Failed to load bot config: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data.bot;
  } catch (error) {
    console.error('Error loading bot config:', error);
    throw error;
  }
}
