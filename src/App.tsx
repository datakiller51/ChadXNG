import React, { useState, useEffect } from 'react';
import { ChatHeader } from './components/ChatHeader';
import { ChatArea } from './components/ChatArea';
import { MessageInput } from './components/MessageInput';
import { QuickActions } from './components/QuickActions';
import { GdprModal } from './components/GdprModal';
import { chatService } from './services/chatService';
import { llmService } from './services/llmService';
import { Message, ChatSession } from './types/chat';

function App() {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showGdprModal, setShowGdprModal] = useState(false);

  useEffect(() => {
    console.log('App component mounted');
    // Load or create session
    let currentSession = chatService.loadLastSession();
    if (!currentSession) {
      currentSession = chatService.createNewSession('fr', false);
      setShowGdprModal(true);
    }
    
    setSession(currentSession);
    setMessages(currentSession.messages);
    console.log('Session loaded:', currentSession);
  }, []);

  console.log('App render - session:', session, 'messages:', messages.length);

  const handleSendMessage = async (content: string) => {
    if (!session || isLoading) return;

    setIsLoading(true);
    
    // Add user message
    const userMessage = chatService.addMessage({
      content,
      sender: 'user'
    });
    
    setMessages(prev => [...prev, userMessage]);

    // Create assistant message placeholder
    const assistantMessage = chatService.addMessage({
      content: '',
      sender: 'assistant',
      streaming: true
    });

    setMessages(prev => [...prev, assistantMessage]);

    let fullResponse = '';

    try {
      await llmService.streamChat(
        [...messages, userMessage],
        (chunk) => {
          fullResponse += chunk;
          chatService.updateMessage(assistantMessage.id, {
            content: fullResponse,
            streaming: true
          });
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessage.id 
                ? { ...msg, content: fullResponse, streaming: true }
                : msg
            )
          );
        },
        () => {
          chatService.updateMessage(assistantMessage.id, {
            content: fullResponse,
            streaming: false
          });
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessage.id 
                ? { ...msg, content: fullResponse, streaming: false }
                : msg
            )
          );
          setIsLoading(false);
        },
        (error) => {
          const errorMessage = `Désolé, une erreur s'est produite : ${error}`;
          chatService.updateMessage(assistantMessage.id, {
            content: errorMessage,
            streaming: false
          });
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessage.id 
                ? { ...msg, content: errorMessage, streaming: false }
                : msg
            )
          );
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Chat error:', error);
      setIsLoading(false);
    }
  };

  const handleClearSession = () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer cette session ? Cette action supprimera tous les messages.')) {
      chatService.clearSession();
      setMessages([]);
    }
  };

  const handleGdprConsent = () => {
    if (session) {
      chatService.updateGdprConsent(true);
      setSession({ ...session, gdprConsent: true });
    }
  };

  const handleQuickAction = (message: string) => {
    if (!isLoading) {
      handleSendMessage(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bank-light to-white flex flex-col">
      <ChatHeader 
        onClearSession={handleClearSession}
        onShowGdprModal={() => setShowGdprModal(true)}
        gdprConsent={session?.gdprConsent || false}
      />
      
      <ChatArea messages={messages} />
      
      <QuickActions 
        onAction={handleQuickAction}
        disabled={isLoading}
      />
      
      <MessageInput 
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        placeholder={isLoading ? "GPT BANK Assistant est en train de répondre..." : "Tapez votre message ici..."}
      />

      <GdprModal 
        isOpen={showGdprModal}
        onClose={() => setShowGdprModal(false)}
        onAccept={handleGdprConsent}
        hasConsented={session?.gdprConsent || false}
      />
    </div>
  );
}

export default App;