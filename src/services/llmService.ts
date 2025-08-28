import { Message } from '../types/chat';

export class LLMService {
  private apiKey: string;
  private model: string;
  private baseUrl: string = 'https://openrouter.ai/api/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';
    this.model = import.meta.env.VITE_OPENROUTER_MODEL || 'anthropic/claude-3.7-sonnet';
  }

  async streamChat(
    messages: Message[],
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
  ): Promise<void> {
    if (!this.apiKey) {
      onError('Clé API OpenRouter manquante. Veuillez configurer VITE_OPENROUTER_API_KEY.');
      return;
    }

    try {
      const systemPrompt = `You are GPT BANK Assistant, virtual advisor for a neo-bank.
Priorities: (1) clarity (2) security (3) GDPR/KYC compliance (4) utility.
Speak naturally in the user's language (detect and follow their language).

Capabilities:
- Guide account opening (collect non-sensitive data first), then redirect to secure KYC portal outside chat
- Answer general banking questions with caution and compliance
- Simulate operations (balance, transfers) without ever executing real operations
- Politely refuse illegal/sensitive requests (credit cards, passwords, OTP)
- Offer escalation to human advisor when necessary/urgent
- Use RAG context if provided; otherwise respond generically with brief warning

Style: benevolent, precise, structured, concise.
Always remind for operations: "This is a simulation, not a real operation."`;

      const chatMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.content
        }))
      ];

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://gptbank.app',
          'X-Title': 'GPT BANK Assistant'
        },
        body: JSON.stringify({
          model: this.model,
          messages: chatMessages,
          temperature: 0.3,
          stream: true,
          tools: this.getToolSchemas()
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onComplete();
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta;
              if (delta?.content) {
                onChunk(delta.content);
              }
            } catch (e) {
              // Skip invalid JSON lines
              continue;
            }
          }
        }
      }

      onComplete();
    } catch (error) {
      console.error('LLM Service Error:', error);
      onError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  }

  private getToolSchemas() {
    return [
      {
        type: 'function',
        function: {
          name: 'initiate_account_opening',
          description: 'Initiate account opening process with form stages',
          parameters: {
            type: 'object',
            properties: {
              form_stage: {
                type: 'string',
                enum: ['basic', 'contact', 'profile', 'consent'],
                description: 'Current form stage'
              },
              data: {
                type: 'object',
                description: 'Form data for current stage'
              }
            },
            required: ['form_stage', 'data']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'simulate_balance',
          description: 'Simulate balance check for user',
          parameters: {
            type: 'object',
            properties: {
              user_id: {
                type: 'string',
                description: 'User identifier (optional)'
              }
            }
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'simulate_transfer',
          description: 'Simulate transfer operation',
          parameters: {
            type: 'object',
            properties: {
              user_id: {
                type: 'string',
                description: 'User identifier (optional)'
              },
              amount: {
                type: 'number',
                description: 'Transfer amount'
              },
              currency: {
                type: 'string',
                description: 'Currency code'
              },
              beneficiary_alias: {
                type: 'string',
                description: 'Beneficiary alias or name'
              }
            },
            required: ['amount', 'currency', 'beneficiary_alias']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'fetch_bank_faq',
          description: 'Fetch FAQ information',
          parameters: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'FAQ search query'
              }
            },
            required: ['query']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'handoff_to_human',
          description: 'Escalate to human advisor',
          parameters: {
            type: 'object',
            properties: {
              reason: {
                type: 'string',
                description: 'Reason for escalation'
              },
              transcript_snapshot: {
                type: 'string',
                description: 'Current conversation transcript'
              }
            },
            required: ['reason', 'transcript_snapshot']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'set_language',
          description: 'Set conversation language',
          parameters: {
            type: 'object',
            properties: {
              lang: {
                type: 'string',
                enum: ['auto', 'fr', 'en', 'he'],
                description: 'Language code'
              }
            },
            required: ['lang']
          }
        }
      }
    ];
  }
}

export const llmService = new LLMService();