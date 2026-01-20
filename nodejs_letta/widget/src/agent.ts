import { API_BASE } from './config';
import type { AgentResponse } from './types';

let currentAgentId: string | null = null;

export async function getOrCreateAgent(chatbotId: string, userId?: string): Promise<string> {
  const response = await fetch(`${API_BASE}/agent-mappings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatbot_id: chatbotId, user_id: userId || null }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get or create agent: ${response.statusText}`);
  }

  const result: { data: AgentResponse } = await response.json();
  currentAgentId = result.data.agentId;
  return currentAgentId;
}

export function getCurrentAgent(): string | null {
  return currentAgentId;
}

export function setAgent(agentId: string): void {
  currentAgentId = agentId;
}
