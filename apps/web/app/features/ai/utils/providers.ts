import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { customProvider, extractReasoningMiddleware, wrapLanguageModel } from 'ai'
import { getServerEnv } from '@/server/env'

const env = getServerEnv()
const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
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
    'chat-agent-tools': openrouter('openai/gpt-4.1-mini'),

    'artifact-basic': openrouter('meta-llama/llama-3.3-70b-instruct:free'),
  },
})
