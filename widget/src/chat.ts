import { API_BASE } from './config';
import { getCurrentAgent } from './agent';
import { addMessage, showTypingIndicator, hideTypingIndicator } from './ui';
import type { MessageResponse, Message } from './types';

export async function sendMessage(message: string): Promise<MessageResponse> {
  const agentId = getCurrentAgent();
  if (!agentId) throw new Error('No agent available');

  showTypingIndicator();
  try {
    const result = await sendMessageWithAutoApproval(agentId, { message });
    hideTypingIndicator();
    return result;
  } catch (error) {
    hideTypingIndicator();
    throw error;
  }
}

async function sendMessageWithAutoApproval(
  agentId: string,
  params: any,
  maxRetries: number = 10
): Promise<MessageResponse> {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId, ...params }),
    });

    if (response.ok) {
      const result: { data: { response: MessageResponse } } = await response.json();
      return result.data.response;
    }

    if (response.status === 409) {
      const errorData = await response.json().catch(() => null);
      if (errorData?.error) {
        const errorStr = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error);
        
        if (errorStr.includes('PENDING_APPROVAL')) {
          const pendingId = errorData.error.match?.(/message-[a-f0-9-]+/)?.[0] || 
                           errorStr.match(/"pending_request_id":\s*"([^"]+)"/)?.[1];
          
          if (pendingId) {
            params = { approval_request_id: pendingId, approve: true };
            continue;
          }
        }
      }
    }

    throw new Error(`Failed to send message: ${response.status}`);
  }

  throw new Error('Max retries reached');
}

export function displayMessages(responseMessages: MessageResponse): void {
  if (!responseMessages?.messages) return;

  responseMessages.messages.forEach((msg: Message) => {
    if (msg.message_type === 'assistant_message' && msg.content) {
      addMessage(msg.content, 'assistant');
    }
  });
}
