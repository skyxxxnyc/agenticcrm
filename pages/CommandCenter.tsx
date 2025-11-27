import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getCommandCenterResponse } from '../services/geminiService';
import { Button } from '../components/ui/Button';
import { X, Send, Bot, User, Terminal } from 'lucide-react';
import { cn } from '../lib/utils';
import { ChatMessage } from '../types';

interface CommandCenterProps {
  onClose: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ onClose }) => {
  const { chatHistory, addChatMessage, clearChat } = useStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };
    
    addChatMessage(userMsg);
    setInput('');
    setIsLoading(true);

    try {
      const historyForApi = chatHistory.concat(userMsg).map(m => ({ role: m.role, content: m.content }));
      const response = await getCommandCenterResponse(historyForApi, input);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response.text,
        timestamp: Date.now()
      };
      
      addChatMessage(aiMsg);

      if (response.functionCalls && response.functionCalls.length > 0) {
        // Mock execution visualization
        const fnMsg: ChatMessage = {
          id: (Date.now() + 2).toString(),
          role: 'system',
          content: `Executing: ${response.functionCalls.map(fc => fc.name).join(', ')}...`,
          timestamp: Date.now(),
          isFunctionResponse: true
        };
        addChatMessage(fnMsg);
      }
    } catch (error) {
      addChatMessage({
        id: Date.now().toString(),
        role: 'system',
        content: 'Error communicating with AI agent.',
        timestamp: Date.now()
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b-2 border-black dark:border-white flex justify-between items-center bg-primary text-white">
        <div className="flex items-center gap-2 font-bold">
          <Terminal className="w-5 h-5" />
          Command Center
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900" ref={scrollRef}>
        {chatHistory.map((msg) => (
          <div 
            key={msg.id} 
            className={cn(
              "flex gap-3 max-w-[90%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full border-2 border-black dark:border-white flex items-center justify-center shrink-0",
              msg.role === 'user' ? "bg-white text-black" : "bg-black text-white dark:bg-white dark:text-black",
              msg.isFunctionResponse && "bg-gray-500 text-white border-gray-500"
            )}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : (msg.isFunctionResponse ? <Terminal className="w-4 h-4"/> : <Bot className="w-4 h-4" />)}
            </div>
            
            <div className={cn(
              "p-3 border-2 text-sm",
              msg.role === 'user' 
                ? "bg-primary text-white border-primary-dark rounded-l-lg rounded-br-lg shadow-neo-sm" 
                : msg.isFunctionResponse
                  ? "bg-gray-200 dark:bg-gray-800 border-gray-400 font-mono text-xs rounded-r-lg rounded-bl-lg"
                  : "bg-white dark:bg-surface-dark border-black dark:border-white rounded-r-lg rounded-bl-lg shadow-neo-sm dark:shadow-neo-sm-dark"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex gap-3 mr-auto max-w-[80%]">
             <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center bg-black text-white">
               <Bot className="w-4 h-4 animate-pulse" />
             </div>
             <div className="p-3 bg-transparent text-sm italic text-gray-500">
               Thinking...
             </div>
           </div>
        )}
      </div>

      <div className="p-4 border-t-2 border-black dark:border-white bg-surface-light dark:bg-surface-dark">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command or ask a question..."
            className="flex-1 bg-transparent border-2 border-black dark:border-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white transition-all placeholder:text-gray-400"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
           {['List deals', 'Draft email for Apex', 'SDR Status'].map(cmd => (
             <button 
                key={cmd}
                onClick={() => setInput(cmd)}
                className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 whitespace-nowrap"
             >
               {cmd}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
};
