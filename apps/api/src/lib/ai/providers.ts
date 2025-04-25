import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { customProvider, extractReasoningMiddleware, wrapLanguageModel } from 'ai'
import { apiEnv } from '~/api-env'

const openrouter = createOpenRouter({
  apiKey: apiEnv.OPENROUTER_API_KEY,
  baseURL: apiEnv.GATEWAY_BASE_OPENROUTER_URL,
})

export const modelProvider = customProvider({
  languageModels: {
    'chat-title': openrouter('mistralai/mistral-small-3.1-24b-instruct:free'),

    'chat-reasoning': wrapLanguageModel({
      model: openrouter('deepseek/deepseek-r1:free'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),

    'chat-basic': openrouter('meta-llama/llama-3.3-70b-instruct:free'),
    'chat-agent': openrouter('google/gemini-2.0-flash-001'),
    // 'chat-agent-tools': openrouter('openai/gpt-4.1'),
    // 'chat-agent-tools': openrouter('openai/gpt-4.1'),
    'chat-agent-tools': openrouter('google/gemini-2.0-flash-001'),

    'artifact-basic': openrouter('meta-llama/llama-3.3-70b-instruct:free'),
  },
})
