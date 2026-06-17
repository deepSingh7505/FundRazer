'use client';

import { useCompletion } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function FloatingChatbot(){
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef<number>(1);

  // useCompletion hook from @ai-sdk/react
  const { completion, input, handleInputChange, handleSubmit, isLoading, setInput } =
    useCompletion({
      api: '/api/chat',
      streamProtocol: 'text',
      onFinish: (p ,completion): void => {
        // Add final response to messages
        if (completion.trim()) {
          setMessages((prev) => [
            ...prev,
            {
              id: messageIdRef.current++,
              type: 'assistant',
              content: completion,
              timestamp: new Date(),
            },
          ]);
        }
        console.log(messages);
        
      },
      onError: (error: Error): void => {
        console.error('API Error:', error);
        setMessages((prev) => [
          ...prev,
          {
            id: messageIdRef.current++,
            type: 'assistant',
            content: 'Sorry, something went wrong. Please try again.',
            timestamp: new Date(),
          },
        ]);
      },
    });

  // Scroll to bottom when messages update
  // const scrollToBottom = (): void => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // };

  // useEffect((): void => {
  //   scrollToBottom();
  // }, [messages, completion]);


  // Handle form submission - CORRECT WAY
  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      {
        id: messageIdRef.current++,
        type: 'user',
        content: input,
        timestamp: new Date(),
      },
    ]);

    // The input will be automatically sent by handleSubmit
    // Just call it with the form event
    handleSubmit(e);

    // Clear input field
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Chat Assistant</h3>
              <p className="text-blue-100 text-sm">Powered by AI</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-800 rounded-lg p-2 transition-colors"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            <div className={`flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-xs px-4 py-3 rounded-xl bg-white text-gray-800 border border-gray-200 rounded-bl-none`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                   Hello! 👋 How can I help you today?
                  </p>
                  <span
                    className={`text-xs mt-1 blocktext-gray-500`}>
                  </span>
                </div>
              </div>
            {messages.slice(0,messages.length-1).map((message) => (
              <div key={message.id}className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-xs px-4 py-3 rounded-xl ${message.type === 'user'? 'bg-blue-600 text-white rounded-br-none': 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <span
                    className={`text-xs mt-1 block ${
                      message.type === 'user'
                        ? 'text-blue-100'
                        : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}

            {/* Streaming Response */}
            {completion && (
              <div className="flex justify-start animate-in fade-in">
                <div className="max-w-xs px-4 py-3 rounded-xl bg-white text-gray-800 border border-gray-200 rounded-bl-none">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {completion}
                  </p>
                </div>
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && !completion && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-xl bg-white border border-gray-200">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <form onSubmit={onSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 text-sm text-black"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg p-3 transition-colors flex items-center justify-center"
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
        className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all flex items-center justify-center border-4 border-white"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
}