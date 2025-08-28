import { Message, ChatSession } from '../types/chat';

class ChatService {
  private readonly STORAGE_KEY = 'gpt-bank-sessions';
  private currentSession: ChatSession | null = null;

  getCurrentSession(): ChatSession | null {
    return this.currentSession;
  }

  createNewSession(language: string = 'fr', gdprConsent: boolean = false): ChatSession {
    const session: ChatSession = {
      id: crypto.randomUUID(),
      messages: [],
      createdAt: Date.now(),
      language,
      gdprConsent
    };
    
    this.currentSession = session;
    this.saveSession(session);
    return session;
  }

  loadLastSession(): ChatSession | null {
    try {
      const sessions = this.getAllSessions();
      if (sessions.length > 0) {
        this.currentSession = sessions[sessions.length - 1];
        return this.currentSession;
      }
    } catch (error) {
      console.error('Error loading last session:', error);
    }
    return null;
  }

  addMessage(message: Omit<Message, 'id' | 'timestamp'>): Message {
    if (!this.currentSession) {
      this.createNewSession();
    }

    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    this.currentSession!.messages.push(newMessage);
    this.saveSession(this.currentSession!);
    return newMessage;
  }

  updateMessage(messageId: string, updates: Partial<Message>): void {
    if (!this.currentSession) return;

    const messageIndex = this.currentSession.messages.findIndex(m => m.id === messageId);
    if (messageIndex !== -1) {
      this.currentSession.messages[messageIndex] = {
        ...this.currentSession.messages[messageIndex],
        ...updates
      };
      this.saveSession(this.currentSession);
    }
  }

  clearSession(): void {
    if (this.currentSession) {
      this.currentSession.messages = [];
      this.saveSession(this.currentSession);
    }
  }

  deleteAllSessions(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentSession = null;
  }

  updateGdprConsent(consent: boolean): void {
    if (this.currentSession) {
      this.currentSession.gdprConsent = consent;
      this.saveSession(this.currentSession);
    }
  }

  private saveSession(session: ChatSession): void {
    try {
      const sessions = this.getAllSessions().filter(s => s.id !== session.id);
      sessions.push(session);
      
      // Keep only last 10 sessions to prevent storage overflow
      const limitedSessions = sessions.slice(-10);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedSessions));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  private getAllSessions(): ChatSession[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  }
}

export const chatService = new ChatService();