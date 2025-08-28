export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: number;
  streaming?: boolean;
  toolCall?: string;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: number;
  language: string;
  gdprConsent: boolean;
}

export interface ToolCall {
  name: string;
  arguments: any;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  action: () => void;
}