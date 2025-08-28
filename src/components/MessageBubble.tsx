import React from 'react';
import { Bot, User, Loader2 } from 'lucide-react';
import { Message } from '../types/chat';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex items-start space-x-3 animate-slide-in ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-bank-blue' : 'bg-gradient-to-br from-bank-sky to-bank-blue'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
      
      <div className={`max-w-xl ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block px-4 py-3 rounded-2xl shadow-sm ${
          isUser 
            ? 'bg-bank-blue text-white rounded-tr-md' 
            : 'bg-white text-gray-800 border border-gray-200 rounded-tl-md'
        }`}>
          <div className="whitespace-pre-wrap leading-relaxed">
            {message.content}
            {message.streaming && (
              <Loader2 className="inline w-4 h-4 ml-2 animate-spin" />
            )}
          </div>
          
          {message.toolCall && (
            <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
              <span className="font-medium">Outil utilisé:</span> {message.toolCall}
            </div>
          )}
        </div>
        
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
};