/**
 * ================================================================================
 *
 * @project:    app-manager
 * @file:       ~/scripts/tui/services/llm.service.ts
 * @version:    1.0.0
 * @createDate: 2025 Dec 17
 * @createTime: 01:19
 * @author:     Steve R Lewis
 *
 * ================================================================================
 *
 * @description:
 * TODO: Create description here
 *
 * ================================================================================
 *
 * @notes: Revision History
 *
 * V1.0.0, 20251217-01:19
 * Initial creation and release of llm.service.ts
 *
 * ================================================================================
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { consola } from 'consola';
import 'dotenv/config';

export type LLMProvider = 'gemini' | 'ollama' | 'kimi' | 'deepseek';

interface LLMRequest {
  systemPrompt?: string;
  userPrompt: string;
  jsonMode?: boolean;
  temperature?: number;
}

class LLMService {
  private activeProvider: LLMProvider = (process.env.LLM_PROVIDER as LLMProvider) || 'gemini';

  constructor() {
    // Optional: Warn if keys are missing for the ACTIVE provider only
    this.validateConfig();
  }

  private validateConfig() {
    if (this.activeProvider === 'gemini' && !process.env.GEMINI_API_CREDENTIALS) consola.warn("Missing GEMINI_API_CREDENTIALS");
    if (this.activeProvider === 'kimi' && !process.env.KIMI_API_KEY) consola.warn("Missing KIMI_API_KEY");
    if (this.activeProvider === 'deepseek' && !process.env.DEEPSEEK_API_KEY) consola.warn("Missing DEEPSEEK_API_KEY");
  }

  // Allow switching at runtime (e.g. via a settings menu)
  setProvider(provider: LLMProvider) {
    this.activeProvider = provider;
    this.validateConfig();
    consola.info(`Switched AI Provider to: ${provider}`);
  }

  async invoke(req: LLMRequest): Promise<string> {
    switch (this.activeProvider) {
      case 'ollama':
        return this.invokeOllama(req);
      case 'kimi':
        return this.invokeKimi(req);
      case 'deepseek':
        return this.invokeDeepSeek(req);
      case 'gemini':
      default:
        return this.invokeGemini(req);
    }
  }

  // --- 1. GEMINI (Google SDK) ---
  private async invokeGemini(req: LLMRequest): Promise<string> {
    const creds = process.env.GEMINI_API_CREDENTIALS ? JSON.parse(process.env.GEMINI_API_CREDENTIALS) : {};
    const apiKey = creds.APIKey;
    if (!apiKey) throw new Error("Missing Gemini API Key");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: creds.Model || 'gemini-2.0-flash',
      generationConfig: {
        temperature: req.temperature ?? 0.7,
        responseMimeType: req.jsonMode ? 'application/json' : 'text/plain'
      }
    });

    const prompt = `${req.systemPrompt ? `System: ${req.systemPrompt}\n` : ''}${req.userPrompt}`;

    // Retry Logic
    let attempt = 0;
    while (attempt < 3) {
      try {
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (error: any) {
        if (error.message?.includes('429')) {
          attempt++;
          await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
        } else {
          throw error;
        }
      }
    }
    throw new Error("Gemini API Failed after 3 retries");
  }

  // --- 2. OLLAMA (Local JSON API) ---
  private async invokeOllama(req: LLMRequest): Promise<string> {
    const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const model = process.env.OLLAMA_MODEL || 'llama3:8b';

    try {
      const response = await fetch(`${baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt: `${req.systemPrompt || ''}\n\n${req.userPrompt}`,
          stream: false,
          format: req.jsonMode ? 'json' : undefined,
          options: { temperature: req.temperature ?? 0.7 }
        })
      });
      const data: any = await response.json();
      return data.response;
    } catch (error) {
      consola.error("Ollama Connection Failed");
      throw error;
    }
  }

  // --- 3. GENERIC OPENAI-COMPATIBLE INVOKER ---
  // Shared logic for Kimi, DeepSeek, OpenAI, Groq, etc.
  private async invokeOpenAICompatible(
    req: LLMRequest,
    baseUrl: string,
    apiKey: string,
    model: string
  ): Promise<string> {
    if (!apiKey) throw new Error(`Missing API Key for endpoint: ${baseUrl}`);

    const messages = [];
    if (req.systemPrompt) messages.push({ role: "system", content: req.systemPrompt });
    messages.push({ role: "user", content: req.userPrompt });

    // Enforce JSON if requested
    const responseFormat = req.jsonMode ? { type: "json_object" } : undefined;
    if (req.jsonMode && !req.systemPrompt?.toLowerCase().includes('json')) {
      // Some providers require the word "json" in the prompt to activate json mode
      messages[messages.length - 1].content += "\n\nIMPORTANT: Return valid JSON.";
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: req.temperature ?? 0.7,
        response_format: responseFormat
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API Error (${baseUrl}): ${response.status} - ${err}`);
    }

    const data: any = await response.json();
    return data.choices[0].message.content;
  }

  // --- 4. DEEPSEEK IMPLEMENTATION ---
  private async invokeDeepSeek(req: LLMRequest): Promise<string> {
    return this.invokeOpenAICompatible(
      req,
      'https://api.deepseek.com',
      process.env.DEEPSEEK_API_KEY || '',
      'deepseek-chat' // or 'deepseek-coder'
    );
  }

  // --- 5. KIMI (MOONSHOT) IMPLEMENTATION ---
  private async invokeKimi(req: LLMRequest): Promise<string> {
    return this.invokeOpenAICompatible(
      req,
      'https://api.moonshot.cn/v1',
      process.env.KIMI_API_KEY || '',
      'moonshot-v1-8k' // or 'moonshot-v1-32k'
    );
  }
}

export const llm = new LLMService();
