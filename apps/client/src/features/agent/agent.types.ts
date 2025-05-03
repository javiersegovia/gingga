import type { Agents } from '@gingga/db/schema'
import type { useAgentChat } from 'agents/ai-react'
import type { LanguageModelV1, Tool } from 'ai'

// Infer type directly from the Drizzle schema definition
export type Agent = typeof Agents.$inferSelect

export type UseAgentChatResult = ReturnType<typeof useAgentChat>

export const CFAgentTypes = ['DefaultChatAgent'] as const
export type CFAgentType = (typeof CFAgentTypes)[number]

export interface AIAgent {
  systemPrompt: string
  // eslint-disable-next-line ts/no-explicit-any
  tools: Record<string, (...args: any[]) => Tool>
  model: LanguageModelV1
}
