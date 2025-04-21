import type { Agents, AgentSkills, ChatMessages, Chats, Users } from './schema'

export type Chat = typeof Chats.$inferSelect
export type ChatMessage = typeof ChatMessages.$inferSelect

export type User = typeof Users.$inferSelect
export type UserRole = (typeof Users.role.enumValues)[number]

export type Agent = typeof Agents.$inferSelect
export type AgentSkill = typeof AgentSkills.$inferSelect
