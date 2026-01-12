import { API_BASE } from './config';
import { getCurrentAgent } from './agent';
import { addMessage, showTypingIndicator, hideTypingIndicator } from './ui';
import type { MessageResponse, Message } from './types';

export async function sendMessage(message: string): Promise<MessageResponse> {
  const agentId = getCurrentAgent();
  if (!agentId) {
    throw new Error('No agent available');
  }

  try {
    showTypingIndicator();
    const result = await sendMessageWithAutoApproval(agentId, { message });
    hideTypingIndicator();
    return result;
  } catch (error) {
    hideTypingIndicator();
    console.error('Error sending message:', error);
    throw error;
  }
}

async function sendMessageWithAutoApproval(
  agentId: string,
  params: any,
  maxRetries: number = 10
): Promise<MessageResponse> {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(`${API_BASE}/agents/${agentId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (response.ok) {
      const result: { data: { response: MessageResponse } } = await response.json();
      return result.data.response;
    }

    if (response.status === 409) {
      const errorData = await response.json().catch(() => null);

      if (errorData?.error) {
        const errorStr = typeof errorData.error === 'string'
          ? errorData.error
          : JSON.stringify(errorData.error);

        if (errorStr.includes('PENDING_APPROVAL')) {
          let pendingId = errorData.error.match?.(/message-[a-f0-9-]+/)?.[0];
          
          if (!pendingId && errorData.error.includes('pending_request_id')) {
            const match = errorStr.match(/"pending_request_id":\s*"([^"]+)"/);
            pendingId = match ? match[1] : null;
          }
          
          if (pendingId) {
            params = { approval_request_id: pendingId, approve: true };
            continue;
          }
        }
      }
    }

    throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
  }

  throw new Error('Max retries reached for auto-approval');
}

export function parseResponse(messagesResponse: MessageResponse): string {
  const messages = messagesResponse.messages || [];
  const assistantMessages = messages
    .filter((msg: Message) => msg.message_type === 'assistant_message')
    .map((msg: Message) => msg.content || '');

  return assistantMessages.join('\n');
}

export function displayMessages(responseMessages: MessageResponse): void {
  if (!responseMessages || !responseMessages.messages) return;

  const messages = responseMessages.messages;
  messages.forEach((msg: Message) => {
    if (msg.message_type === 'assistant_message' && msg.content) {
      addMessage(msg.content, 'assistant');
    }
  });
}
