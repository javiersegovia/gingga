import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { customProvider, extractReasoningMiddleware, wrapLanguageModel } from 'ai'
import { webEnv } from '~/lib/env.server'

const openrouter = createOpenRouter({
  apiKey: webEnv.OPENROUTER_API_KEY,
  baseURL: import.meta.env.DEV ? undefined : webEnv.GATEWAY_BASE_OPENROUTER_URL,
})

export const modelProvider = customProvider({
  languageModels: {
    'chat-title': openrouter('mistralai/mistral-small-3.1-24b-instruct:free'),

    'chat-reasoning': wrapLanguageModel({
      model: openrouter('deepseek/deepseek-r1:free'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),

    'chat-agent': openrouter('google/gemini-2.0-flash-001'),
    'chat-agent-tools': openrouter('google/gemini-2.0-flash-001'),
    'artifact-basic': openrouter('meta-llama/llama-3.3-70b-instruct:free'),

    'qualify-lead': openrouter('google/gemini-2.0-flash-001'),
    'video-generator-agent': openrouter('google/gemini-2.5-preview'),
  },
})
