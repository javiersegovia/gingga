import type { Agents, AgentSkills, ChatMessages, Chats, Leads, N8NWorkflows, Users } from './schema'

export type Chat = typeof Chats.$inferSelect
export type ChatMessage = typeof ChatMessages.$inferSelect

export type User = typeof Users.$inferSelect
export type UserRole = (typeof Users.role.enumValues)[number]

export type Agent = typeof Agents.$inferSelect
export type AgentSkill = typeof AgentSkills.$inferSelect
export type AgentType = (typeof Agents.agentType.enumValues)[number]

export type N8NWorkflow = typeof N8NWorkflows.$inferSelect
export type N8NWorkflowStatus = (typeof N8NWorkflows.status.enumValues)[number]

export type Lead = typeof Leads.$inferSelect
