import React, { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { Message } from '../types/chat';

interface ChatAreaProps {
  messages: Message[];
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-bank-light to-white">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-gradient-to-br from-bank-sky to-bank-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">GB</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Bonjour ! Je suis votre assistant GPT BANK
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Je peux vous aider avec vos questions bancaires, simuler des opérations, 
            ou vous guider pour l'ouverture d'un compte. Comment puis-je vous assister aujourd'hui ?
          </p>
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium">
              🔒 Rappel de sécurité : Ne partagez jamais vos mots de passe, codes PIN ou informations sensibles dans ce chat.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-bank-light to-white">
      <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};