import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  disabled = false,
  placeholder = "Tapez votre message ici..."
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-bank-sky focus:border-transparent resize-none max-h-32 disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
              aria-label="Message à envoyer"
            />
            <div className="absolute right-3 top-3">
              {disabled && <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className="bg-gradient-to-r from-bank-sky to-bank-blue text-white px-6 py-3 rounded-xl hover:from-bank-blue hover:to-bank-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl"
            aria-label="Envoyer le message"
          >
            <Send className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">Envoyer</span>
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          Appuyez sur Entrée pour envoyer, Maj+Entrée pour une nouvelle ligne
        </p>
      </form>
    </div>
  );
};