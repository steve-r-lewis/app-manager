/**
 * ================================================================================
 *
 * @project:    nuxt4-data-generator
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
import { select, isCancel } from '@clack/prompts';
import { consola } from 'consola';
import fs from 'fs';
import path from 'path';
import '../initEnv';

// IMPORTS
import type {
  LLMConfigRecord,
  LLMRequest,
  LLMRegistryFile
} from '../../types/llm.types';

// Driver Signature
type DriverFunction = (cfg: LLMConfigRecord, req: LLMRequest) => Promise<string>;

// ============================================================================
// 1. Driver Implementations
// ============================================================================

const drivers: Record<string, DriverFunction> = {

  // --- Strategy: Google Gemini ---
  'gemini': async (cfg, req) => {
    if (!cfg.apiKey) throw new Error(`Missing API Key for ${cfg.label}`);

    const genAI = new GoogleGenerativeAI(cfg.apiKey);
    const model = genAI.getGenerativeModel({
      model: cfg.model!,
      generationConfig: {
        temperature: req.temperature ?? 0.7,
        responseMimeType: req.jsonMode ? 'application/json' : 'text/plain'
      }
    });

    const prompt = `${req.systemPrompt ? `System: ${req.systemPrompt}\n` : ''}${req.userPrompt}`;

    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err: any) {
      if (err.message?.includes('429')) {
        consola.warn("Rate limit (429). Retrying in 2s...");
        await new Promise(r => setTimeout(r, 2000));
        const retry = await model.generateContent(prompt);
        return retry.response.text();
      }
      throw err;
    }
  },

  // --- Strategy: OpenAI Compatible (DeepSeek, Kimi, Grok, etc.) ---
  'openai-compatible': async (cfg, req) => {
    if (!cfg.apiKey) throw new Error(`Missing API Key for ${cfg.label}`);
    if (!cfg.baseUrl) throw new Error(`Missing Base URL for ${cfg.label}`);

    const messages = [];
    if (req.systemPrompt) messages.push({ role: "system", content: req.systemPrompt });
    messages.push({ role: "user", content: req.userPrompt });

    // Hinting for models that require explicit JSON instructions
    if (req.jsonMode && !req.systemPrompt?.toLowerCase().includes('json')) {
      messages[messages.length - 1].content += "\n\nIMPORTANT: Return valid JSON.";
    }

    const response = await fetch(`${cfg.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cfg.apiKey}`
      },
      body: JSON.stringify({
        model: cfg.model,
        messages,
        temperature: req.temperature ?? 0.7,
        response_format: req.jsonMode ? { type: "json_object" } : undefined
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API Error (${cfg.id}): ${response.status} - ${errText}`);
    }
    const data: any = await response.json();
    return data.choices[0].message.content;
  },

  // --- Strategy: Ollama (Local) ---
  'ollama': async (cfg, req) => {
    const baseUrl = cfg.baseUrl || 'http://localhost:11434';

    // Setup timeout controller
    const controller = new AbortController();
    const timeoutId = cfg.timeOut ? setTimeout(() => controller.abort(), cfg.timeOut * 1000) : null;

    try {
      const response = await fetch(`${baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: cfg.model,
          prompt: `${req.systemPrompt || ''}\n\n${req.userPrompt}`,
          stream: false,
          format: req.jsonMode ? 'json' : undefined,
          options: { temperature: req.temperature ?? 0.7 }
        }),
        signal: controller.signal
      });

      if (!response.ok) throw new Error("Ollama connection failed");
      const data: any = await response.json();
      return data.response;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }
};

// ============================================================================
// 2. Registry Loading
// ============================================================================

function loadRegistry(): Record<string, LLMConfigRecord> {
  const configPath = path.resolve(process.cwd(), 'scripts/config/llmRegistry.json');

  if (!fs.existsSync(configPath)) {
    consola.error(`Missing Registry: ${configPath}`);
    return {};
  }

  try {
    const rawData = fs.readFileSync(configPath, 'utf-8');
    // TYPE-SAFE PARSING
    const parsed: LLMRegistryFile = JSON.parse(rawData);
    const registry: Record<string, LLMConfigRecord> = {};

    for (const item of parsed.records) {
      if (!item.type) continue;
      if (item.apiKeyEnv && process.env[item.apiKeyEnv]) {
        item.apiKey = process.env[item.apiKeyEnv];
      } else {
        item.apiKey = '';
      }
      registry[item.id] = item;
    }
    return registry;
  } catch (e) {
    consola.error("Error parsing llmRegistry.json", e);
    return {};
  }
}

// ============================================================================
// 3. Registry Loading (Configuration)
// ============================================================================

interface RegistryFile {
  metadataEntity: any;
  records: LLMConfigRecord[];
}

function loadRegistry(): Record<string, LLMConfigRecord> {
  const configPath = path.resolve(process.cwd(), 'scripts/config/llmRegistry.json');

  if (!fs.existsSync(configPath)) {
    consola.error(`Missing Registry: ${configPath}`);
    return {};
  }

  try {
    const rawData = fs.readFileSync(configPath, 'utf-8');
    const parsed: RegistryFile = JSON.parse(rawData);
    const registry: Record<string, LLMConfigRecord> = {};

    for (const item of parsed.records) {
      // 1. Skip items without a type (e.g. placeholder records)
      if (!item.type) continue;

      // 2. Hydrate API Key from Environment
      if (item.apiKeyEnv && process.env[item.apiKeyEnv]) {
        item.apiKey = process.env[item.apiKeyEnv];
      } else {
        item.apiKey = ''; // Explicitly empty if missing
      }

      registry[item.id] = item;
    }
    return registry;
  } catch (e) {
    consola.error("Error parsing llmRegistry.json", e);
    return {};
  }
}

const REGISTRY = loadRegistry();

// ============================================================================
// 4. Initialization Logic
// ============================================================================

function getInitialConfig(): LLMConfigRecord {
  // 1. Try Default from Env
  const envDefault = process.env.API_MODEL_DEFAULT?.toLowerCase();

  if (envDefault && REGISTRY[envDefault]) {
    const candidate = REGISTRY[envDefault];
    // Only accept if it's usable (has key or doesn't need one)
    if (!candidate.apiKeyEnv || candidate.apiKey) {
      return candidate;
    }
  }

  // 2. Find first valid provider
  const valid = Object.values(REGISTRY).find(p => {
    if (p.apiKeyEnv && !p.apiKey) return false;
    return true;
  });

  if (valid) return valid;

  // 3. Safe Fallback
  return {
    id: 'ollama', label: 'Fallback (Ollama)', type: 'ollama',
    model: 'llama3:8b', apiKeyEnv: null, baseUrl: 'http://localhost:11434', timeOut: 200
  };
}

const STATE = { activeConfig: getInitialConfig() };

// ============================================================================
// 5. Public Service Singleton
// ============================================================================

export const llm = {
  /** Get current active config */
  getConfig() { return STATE.activeConfig; },

  /** Manually set active config by ID */
  setConfig(configId: string) {
    if (REGISTRY[configId]) {
      STATE.activeConfig = REGISTRY[configId];
      consola.success(`Active AI Model: ${STATE.activeConfig.label}`);
    } else {
      consola.error(`Unknown Provider ID: ${configId}`);
    }
  },

  /** * Interactive Provider Selection
   * FILTERS OUT providers that are missing their required API keys in .env
   */
  async selectProvider() {
    // Discovery Pattern: Filter available options based on health/config
    const availableProviders = Object.values(REGISTRY).filter(p => {
      // Rule 1: Must have a known driver
      if (!p.type || !drivers[p.type]) return false;

      // Rule 2: If it needs a key, that key must exist
      if (p.apiKeyEnv && !p.apiKey) return false;

      return true;
    });

    if (availableProviders.length === 0) {
      consola.warn("No configured AI Providers found. Check scripts/.env keys.");
      return;
    }

    const options = availableProviders.map(p => ({
      value: p.id,
      label: p.label || p.id,
      hint: p.type as string
    }));

    const selectedId = await select({
      message: `Current: ${STATE.activeConfig.label}. Switch to:`,
      options: [...options, { value: 'cancel', label: 'Cancel' }]
    });

    if (isCancel(selectedId) || selectedId === 'cancel') return;
    this.setConfig(selectedId as string);
  },

  /** * Unified Invoker
   * Dispatches to the correct driver based on config.type
   */
  async invoke(req: LLMRequest): Promise<string> {
    const config = STATE.activeConfig;
    const driver = drivers[config.type as string];

    if (!driver) {
      throw new Error(`No driver implementation found for type: '${config.type}'`);
    }

    // Delegate execution to the strategy
    return driver(config, req);
  }
};
