import { Agents, Chats, ChatMessages, Users } from './schema'

export type Chat = typeof Chats.$inferSelect
export type ChatMessage = typeof ChatMessages.$inferSelect
export type Agent = typeof Agents.$inferSelect

export type User = typeof Users.$inferSelect
export type UserRole = (typeof Users.role.enumValues)[number]
