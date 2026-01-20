import { useState, useEffect, useRef } from 'react';
import { Input, Avatar, Typography } from 'antd';
import { SendOutlined, RobotOutlined, CloseOutlined, MessageOutlined } from '@ant-design/icons';
import { marked } from 'marked';

const { Text, Paragraph } = Typography;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatPreviewProps {
  assistantName: string;
  greeting: string;
  knowledgeBaseCount: number;
  primaryColor?: string;
  botAvatarUrl?: string;
  bubbleIconUrl?: string;
  footerText?: string;
}

export function ChatPreview({
  assistantName,
  greeting,
  knowledgeBaseCount,
  primaryColor = '#1677ff',
  botAvatarUrl,
  bubbleIconUrl,
  footerText = 'Prompted by CONFERENCE PARK',
}: ChatPreviewProps) {
  const [isChatOpen, setIsChatOpen] = useState(true); // Default open
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageBodyRef = useRef<HTMLDivElement>(null);

  // Update greeting message when greeting prop changes
  useEffect(() => {
    if (greeting) {
      setMessages([
        {
          id: Date.now().toString(),
          text: greeting,
          sender: 'assistant',
          timestamp: new Date(),
        },
      ]);
    } else {
      setMessages([]);
    }
  }, [greeting]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messageBodyRef.current) {
      messageBodyRef.current.scrollTop = messageBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    const textToSend = inputValue.trim();
    if (!textToSend) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Show typing indicator
    setIsTyping(true);

    // Simulate 1-second delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Add assistant response
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: `ご質問を受け取りました。現在、${knowledgeBaseCount}個のナレッジベースを使用して回答しています。`,
      sender: 'assistant',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  // Handle Shift+Enter for newline, Enter to send
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // If Shift+Enter, allow default behavior (newline)
  };

  // Floating bubble button (closed state)
  if (!isChatOpen) {
    return (
      <div style={{ position: 'sticky', top: 24 }}>
        <button
          onClick={() => setIsChatOpen(true)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: bubbleIconUrl ? 'transparent' : primaryColor,
            border: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s',
            padding: 0,
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {bubbleIconUrl ? (
            <img src={bubbleIconUrl} alt="Chat" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%' }} />
          ) : (
            <MessageOutlined style={{ fontSize: '28px', color: 'white' }} />
          )}
        </button>
      </div>
    );
  }

  // Chat window (open state)
  return (
    <div
      style={{
        width: '360px',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 24,
        minHeight: '500px',
        maxHeight: '600px',
      }}
    >
      {/* Header with Close Button */}
      <div
        style={{
          background: primaryColor,
          padding: '16px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text strong style={{ color: 'white', fontSize: '16px' }}>
          {assistantName || 'AIアシスタント'}
        </Text>
        <button
          onClick={() => setIsChatOpen(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '4px',
          }}
        >
          <CloseOutlined />
        </button>
      </div>

      {/* Message Body */}
      <div
        ref={messageBodyRef}
        style={{
          flex: 1,
          padding: '16px',
          background: '#fafafa',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id}>
            <div
              style={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: '8px',
              }}
            >
              {msg.sender === 'assistant' && (
                <Avatar
                  src={botAvatarUrl}
                  icon={<RobotOutlined />}
                  size={32}
                  style={{ flexShrink: 0 }}
                />
              )}
              <div
                style={{
                  maxWidth: '70%',
                  padding: '10px 14px',
                  borderRadius:
                    msg.sender === 'user'
                      ? '12px 12px 0 12px'
                      : '12px 12px 12px 0',
                  background: msg.sender === 'user' ? '#e6f7ff' : '#f0f0f0',
                  color: '#000',
                  wordWrap: 'break-word',
                }}
              >
                {msg.sender === 'assistant' ? (
                  <div
                    className="chat-bubble-markdown"
                    style={{ color: '#000' }}
                    dangerouslySetInnerHTML={{
                      __html: marked(msg.text, { breaks: true }) as string,
                    }}
                  />
                ) : (
                  <Paragraph
                    style={{
                      color: '#000',
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {msg.text}
                  </Paragraph>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <Avatar
              src={botAvatarUrl}
              icon={<RobotOutlined />}
              size={32}
              style={{ flexShrink: 0 }}
            />
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '12px 12px 12px 0',
                background: '#f0f0f0',
                display: 'flex',
                gap: '4px',
              }}
            >
              <span className="typing-dot" style={dotStyle}>●</span>
              <span className="typing-dot" style={{...dotStyle, animationDelay: '0.2s'}}>●</span>
              <span className="typing-dot" style={{...dotStyle, animationDelay: '0.4s'}}>●</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer with TextArea */}
      <div
        style={{
          padding: '12px',
          display: 'flex',
          gap: '8px',
          background: 'white',
          borderTop: '1px solid #f0f0f0',
          alignItems: 'flex-end',
        }}
      >
        <Input.TextArea
          placeholder="AIアシスタントと話す..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          autoSize={{ minRows: 1, maxRows: 4 }}
          style={{
            flex: 1,
            height: '40px',
            minHeight: '40px',
            maxHeight: '120px',
            resize: 'none',
            padding: '8px 11px',
            lineHeight: '24px',
          }}
        />
        <button
          onClick={() => handleSend()}
          style={{
            width: '40px',
            height: '40px',
            minHeight: '40px',
            background: primaryColor,
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          <SendOutlined style={{ fontSize: '18px' }} />
        </button>
      </div>

      {/* Branding Footer */}
      {footerText && (
        <div
          style={{
            padding: '8px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#666',
            borderTop: '1px solid #f0f0f0',
            background: 'white',
          }}
        >
          {footerText}
        </div>
      )}

      {/* CSS for typing animation and markdown */}
      <style>{`
        @keyframes typing-dot {
          0%, 60%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          30% {
            opacity: 1;
            transform: translateY(-4px);
          }
        }

        /* Markdown styling in chat bubbles */
        .chat-bubble-markdown p {
          margin: 0;
          line-height: 1.5;
        }
        .chat-bubble-markdown p + p {
          margin-top: 8px;
        }
        .chat-bubble-markdown strong {
          font-weight: 600;
        }
        .chat-bubble-markdown em {
          font-style: italic;
        }
        .chat-bubble-markdown a {
          color: #1677ff;
          text-decoration: underline;
        }
        .chat-bubble-markdown ul, .chat-bubble-markdown ol {
          margin: 8px 0;
          padding-left: 20px;
        }
        .chat-bubble-markdown li {
          margin: 4px 0;
        }
        .chat-bubble-markdown code {
          background: rgba(0, 0, 0, 0.05);
          padding: 2px 4px;
          border-radius: 3px;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
}

const dotStyle: React.CSSProperties = {
  fontSize: '8px',
  color: '#999',
  animation: 'typing-dot 1.4s infinite',
};
