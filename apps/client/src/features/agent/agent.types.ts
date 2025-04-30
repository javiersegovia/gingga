import type { Agents } from '@gingga/db/schema'
import type { useAgentChat } from 'agents/ai-react'

// Infer type directly from the Drizzle schema definition
export type Agent = typeof Agents.$inferSelect

export type UseAgentChatResult = ReturnType<typeof useAgentChat>

export const AgentTypes = ['DefaultChatAgent'] as const
export type AgentType = (typeof AgentTypes)[number]
