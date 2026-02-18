/**
 * OpenRouter Inference Client
 *
 * Alternative inference provider using OpenRouter's unified API.
 * Provides access to 300+ AI models through a single interface.
 */

import type {
  InferenceClient,
  ChatMessage,
  InferenceOptions,
  InferenceResponse,
  InferenceToolCall,
  TokenUsage,
} from "../types.js";

interface OpenRouterClientOptions {
  apiKey: string;
  defaultModel: string;
  maxTokens: number;
  lowComputeModel?: string;
  siteUrl?: string;
  siteName?: string;
}

export function createOpenRouterClient(
  options: OpenRouterClientOptions,
): InferenceClient {
  const { apiKey, siteUrl, siteName } = options;
  let currentModel = options.defaultModel;
  let maxTokens = options.maxTokens;

  const chat = async (
    messages: ChatMessage[],
    opts?: InferenceOptions,
  ): Promise<InferenceResponse> => {
    const model = opts?.model || currentModel;
    const tools = opts?.tools;

    const body: Record<string, unknown> = {
      model,
      messages: messages.map(formatMessage),
      stream: false,
      max_tokens: opts?.maxTokens || maxTokens,
    };

    if (opts?.temperature !== undefined) {
      body.temperature = opts.temperature;
    }

    if (tools && tools.length > 0) {
      body.tools = tools;
      body.tool_choice = "auto";
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    // Optional: Add site info for rankings on openrouter.ai
    if (siteUrl) headers["HTTP-Referer"] = siteUrl;
    if (siteName) headers["X-Title"] = siteName;

    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(
        `OpenRouter inference error: ${resp.status}: ${text}`,
      );
    }

    const data = await resp.json() as any;
    const choice = data.choices?.[0];

    if (!choice) {
      throw new Error("No completion choice returned from OpenRouter");
    }

    const message = choice.message;
    const usage: TokenUsage = {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0,
    };

    const toolCalls: InferenceToolCall[] | undefined =
      message.tool_calls?.map((tc: any) => ({
        id: tc.id,
        type: "function" as const,
        function: {
          name: tc.function.name,
          arguments: tc.function.arguments,
        },
      }));

    return {
      id: data.id || "",
      model: data.model || model,
      message: {
        role: message.role,
        content: message.content || "",
        tool_calls: toolCalls,
      },
      toolCalls,
      usage,
      finishReason: choice.finish_reason || "stop",
    };
  };

  const setLowComputeMode = (enabled: boolean): void => {
    if (enabled) {
      currentModel = options.lowComputeModel || "openai/gpt-4o-mini";
      maxTokens = 4096;
    } else {
      currentModel = options.defaultModel;
      maxTokens = options.maxTokens;
    }
  };

  const getDefaultModel = (): string => {
    return currentModel;
  };

  return {
    chat,
    setLowComputeMode,
    getDefaultModel,
  };
}

function formatMessage(
  msg: ChatMessage,
): Record<string, unknown> {
  const formatted: Record<string, unknown> = {
    role: msg.role,
    content: msg.content,
  };

  if (msg.name) formatted.name = msg.name;
  if (msg.tool_calls) formatted.tool_calls = msg.tool_calls;
  if (msg.tool_call_id) formatted.tool_call_id = msg.tool_call_id;

  return formatted;
}

/**
 * Get available models from OpenRouter
 */
export async function getOpenRouterModels(apiKey: string): Promise<any[]> {
  const resp = await fetch("https://openrouter.ai/api/v1/models", {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!resp.ok) {
    throw new Error(`Failed to fetch OpenRouter models: ${resp.status}`);
  }

  const data = await resp.json();
  return data.data || [];
}

/**
 * Find best model based on criteria
 */
export async function findBestModel(
  apiKey: string,
  criteria: {
    minContext?: number;
    maxPromptPrice?: number;
    maxCompletionPrice?: number;
    capabilities?: string[];
  },
): Promise<any> {
  const models = await getOpenRouterModels(apiKey);

  return models
    .filter((m) => {
      if (criteria.minContext && m.context_length < criteria.minContext) {
        return false;
      }
      if (criteria.maxPromptPrice && m.pricing?.prompt > criteria.maxPromptPrice) {
        return false;
      }
      if (criteria.maxCompletionPrice && m.pricing?.completion > criteria.maxCompletionPrice) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by context length (higher is better)
      return b.context_length - a.context_length;
    })[0];
}
