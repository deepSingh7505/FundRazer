'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest: ({ messages }) => ({
        body: {
        messages,
        },
      }),
    }),
    messages: [
      {
        id: 'welcome-message',
        role: 'assistant',
        parts: [
          {
            type: 'text',
            text: 'Hello! 👋 How can I help you today?',
          },
        ],
      },
    ],
    onError: (err) => {
      console.error('API Error:', err);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  const isLoading = status === 'submitted' || status === 'streaming';

  const onSubmit = async (e) => {
    e.preventDefault();

    const value = (input || '').trim();
    if (!value || isLoading) return;

    await sendMessage({ text: value });
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {isOpen && (
        <div
          className="
            fixed inset-x-3 bottom-20 top-4
            sm:absolute sm:inset-auto sm:bottom-20 sm:right-0 sm:top-auto
            sm:w-96 sm:h-[600px]
            bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200
            max-w-[calc(100vw-24px)]
          "
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-4 sm:p-6 flex items-center justify-between relative">
            <div>
              <h3 className="font-semibold text-lg">Chat Assistant</h3>
              <p className="text-blue-100 text-sm">Powered by AI</p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="
                p-2 rounded-lg transition-colors hover:bg-blue-800
                absolute right-3 top-1/2 -translate-y-1/2
                sm:static sm:translate-y-0
              "
              aria-label="Close chat"
            >
              <X size={22} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-gray-50 min-h-0">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[85%] sm:max-w-xs px-4 py-3 rounded-xl break-words
                    ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                    }
                  `}
                >
                  {message.parts?.map((part, i) => {
                    if (part.type === 'text') {
                      return (
                        <p key={i} className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {part.text}
                        </p>
                      );
                    }
                    return null;
                  })}

                  {!message.parts?.length && message.content && (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-xl bg-white border border-gray-200">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                Something went wrong. Please try again.
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3 sm:p-4 bg-white">
            <form onSubmit={onSubmit} className="flex gap-2 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 min-w-0 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 text-sm text-black"
              />
              <button
                type="submit"
                disabled={isLoading || !(input || '').trim()}
                className="shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg p-3 transition-colors flex items-center justify-center"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all flex items-center justify-center border-4 border-white"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X size={26} /> : <MessageCircle size={26} />}
      </button>
    </div>
  );
}