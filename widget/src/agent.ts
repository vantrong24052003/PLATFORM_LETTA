import { API_BASE } from './config';
import type { AgentResponse } from './types';

let currentAgentId: string | null = null;

export async function createAgent(chatbotId: string, userId?: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE}/bots/${chatbotId}/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId || null }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create agent: ${response.statusText}`);
    }

    const result: { data: AgentResponse } = await response.json();
    currentAgentId = result.data.agentId;
    return currentAgentId;
  } catch (error) {
    console.error('Error creating agent:', error);
    throw error;
  }
}

export async function getAgentByUser(chatbotId: string, userId?: string): Promise<string | null> {
  try {
    const url = new URL(`${API_BASE}/bots/${chatbotId}/agents`);
    if (userId) {
      url.searchParams.set('userId', userId);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      return null;
    }

    const result: { data: AgentResponse } = await response.json();
    currentAgentId = result.data.agentId;
    return currentAgentId;
  } catch (error) {
    console.error('Error getting agent:', error);
    return null;
  }
}

export function getCurrentAgent(): string | null {
  return currentAgentId;
}

export function setAgent(agentId: string): void {
  currentAgentId = agentId;
}
