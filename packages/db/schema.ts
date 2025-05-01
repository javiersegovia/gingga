/* eslint-disable ts/no-use-before-define */
import type { Attachment } from 'ai'
import type { ComposioToolName, SkillId, ToolName } from './enums'
import { relations, sql } from 'drizzle-orm'
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { nanoid } from 'nanoid'
import { ComposioAppNames } from './enums'

const nanoIdDefault = () => text('id').notNull().$defaultFn(nanoid)

const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .default(sql`(unixepoch() * 1000)`)
    .$onUpdate(() => new Date()),
}

/* ________________________________________________________________________________________________ */
/* Enum Definitions                                                                                 */
/* ________________________________________________________________________________________________ */

export const availableModelIds = [
  'anthropic/claude-3.5-sonnet',
  'deepseek/deepseek-r1',
  'google/gemini-2.0-flash-001',
  'mistralai/mistral-nemo',
  'meta-llama/llama-3.1-70b-instruct',
  'openai/gpt-4o-mini',
  'x-ai/grok-beta',
] as const

/* ________________________________________________________________________________________________ */
/* User & Auth Tables                                                                               */
/* ________________________________________________________________________________________________ */

export const Users = sqliteTable('users', {
  ...timestamps,
  id: nanoIdDefault().primaryKey(),
  name: text('name'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }),
  image: text('image'),
  role: text('role', { enum: ['user', 'admin'] })
    .notNull()
    .default('user'),
  banned: integer('banned', { mode: 'boolean' }).default(false),
  banReason: text('ban_reason'),
  banExpires: integer('ban_expires', { mode: 'timestamp_ms' }),
})

export const usersRelations = relations(Users, ({ one, many }) => ({
  sessions: many(Sessions),
  membership: one(UserMemberships, {
    fields: [Users.id],
    references: [UserMemberships.userId],
  }),
  ownedAgents: many(Agents),
  chats: many(Chats),
  chatMessages: many(ChatMessages),
}))

export const Verifications = sqliteTable('verifications', {
  ...timestamps,
  id: nanoIdDefault().primaryKey(),

  identifier: text('identifier').notNull(),
  value: text('value').notNull(),

  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
})

export const Accounts = sqliteTable('accounts', {
  ...timestamps,
  id: nanoIdDefault().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => Users.id, { onDelete: 'cascade' }),

  idToken: text('id_token'),
  accountId: text('account_id').notNull(), // Id of account as provided by the SSO or equal to userId for credential accounts
  providerId: text('provider_id').notNull(), // Id of the provider
  accessToken: text('access_token'), // The access token of the account. Returned by the provider
  refreshToken: text('refresh_token'), // The refresh token of the account. Returned by the provider
  accessTokenExpiresAt: integer('access_token_expires_at', {
    mode: 'timestamp_ms',
  }), // The time when the verification request expires
  refreshTokenExpiresAt: integer('refresh_token_expires_at', {
    mode: 'timestamp_ms',
  }), // The time when the verification request expires
  scope: text('scope'), // The scope of the account. Returned by the provider
  password: text('password'), // The password of the account. Mainly used for email and password authentication
})

export const accountsRelations = relations(Accounts, ({ one }) => ({
  user: one(Users, {
    fields: [Accounts.userId],
    references: [Users.id],
  }),
}))

export const OAuthAccounts = sqliteTable(
  'oauth_accounts',
  {
    providerId: text('provider_id', { enum: ['github', 'google'] }).notNull(),
    providerUserId: text('provider_user_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => Users.id, { onDelete: 'cascade' }),
  },
  table => [primaryKey({ columns: [table.providerId, table.userId] })],
)

export const oauthAccountsRelations = relations(OAuthAccounts, ({ one }) => ({
  user: one(Users, {
    fields: [OAuthAccounts.userId],
    references: [Users.id],
  }),
}))

export const Sessions = sqliteTable('sessions', {
  ...timestamps,
  id: nanoIdDefault().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => Users.id, { onDelete: 'cascade' }),

  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  token: text('token').notNull(),
  impersonatedBy: text('impersonated_by').references(() => Users.id, {
    onDelete: 'set null',
  }),
})

export const sessionsRelations = relations(Sessions, ({ one }) => ({
  user: one(Users, {
    fields: [Sessions.userId],
    references: [Users.id],
  }),
}))

/* ________________________________________________________________________________________________ */
/* User Memberships Table                                                                           */
/* ________________________________________________________________________________________________ */

export const UserMemberships = sqliteTable(
  'user_memberships',
  {
    userId: text('user_id')
      .notNull()
      .references(() => Users.id, { onDelete: 'cascade' }),
    tier: text('tier', { enum: ['basic', 'pro', 'enterprise'] }).notNull(),
    dailyResetAt: integer('daily_reset_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),

    monthlyResetAt: integer('monthly_reset_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`((unixepoch() + (31 * 24 * 60 * 60)) * 1000)`), // 31 days from now in milliseconds

    dailyUsed: integer('daily_used').default(0),
    monthlyStandardUsed: integer('monthly_standard_used').default(0),
    monthlyPremiumUsed: integer('monthly_premium_used').default(0),
  },
  table => [primaryKey({ columns: [table.userId] })],
)

export const userMembershipsRelations = relations(UserMemberships, ({ one }) => ({
  user: one(Users, {
    fields: [UserMemberships.userId],
    references: [Users.id],
  }),
}))

/* ________________________________________________________________________________________________ */
/* Agents & Chats                                                                                      */
/* ________________________________________________________________________________________________ */

export const Agents = sqliteTable('agents', {
  id: nanoIdDefault().primaryKey(),
  ...timestamps,

  ownerId: text('owner_id').references(() => Users.id, {
    onDelete: 'set null',
  }),

  title: text('title'),
  name: text('name').notNull(),
  description: text('description'),

  introduction: text('introduction'),
  instructions: text('instructions').notNull(),
  starters: text('starters', { mode: 'json' }).$type<string[]>(),

  modelId: text('model_id', {
    enum: availableModelIds,
  }),
  image: text('image'),
})

export const agentsRelations = relations(Agents, ({ one, many }) => ({
  chats: many(Chats),
  owner: one(Users, {
    fields: [Agents.ownerId],
    references: [Users.id],
  }),
  agentSkills: many(AgentSkills),
}))

export const Chats = sqliteTable('chats', {
  ...timestamps,
  id: nanoIdDefault().primaryKey(),

  // References
  userId: text('user_id').references(() => Users.id, { onDelete: 'set null' }),
  agentId: text('agent_id').references(() => Agents.id, {
    onDelete: 'set null',
  }),

  durableObjectId: text('durable_object_id'),

  title: text('title'),
  visibility: text('visibility', { enum: ['public', 'private'] })
    .notNull()
    .default('private'),
})

export const chatsRelations = relations(Chats, ({ one, many }) => ({
  user: one(Users, {
    fields: [Chats.userId],
    references: [Users.id],
  }),
  agent: one(Agents, {
    // Define relation to agent
    fields: [Chats.agentId],
    references: [Agents.id],
  }),
  messages: many(ChatMessages),
}))

export const ChatMessages = sqliteTable('chat_messages', {
  ...timestamps,
  id: nanoIdDefault().primaryKey(),

  // References
  chatId: text('chat_id')
    .notNull()
    .references(() => Chats.id, { onDelete: 'cascade' }),

  userId: text('user_id').references(() => Users.id, { onDelete: 'set null' }),

  role: text('role', {
    enum: ['user', 'assistant', 'system'],
  }).notNull(),

  // eslint-disable-next-line ts/no-explicit-any
  parts: text('parts', { mode: 'json' }).$type<Array<any>>().notNull(),
  attachments: text('attachments', { mode: 'json' }).$type<Attachment[]>(),

  modelId: text('model_id'),
})

export const chatMessagesRelations = relations(ChatMessages, ({ one }) => ({
  chat: one(Chats, {
    fields: [ChatMessages.chatId],
    references: [Chats.id],
  }),
  user: one(Users, {
    fields: [ChatMessages.userId],
    references: [Users.id],
  }),
}))

/* ________________________________________________________________________________________________ */
/* Agent Skills & Tools                                                                             */
/* ________________________________________________________________________________________________ */

export const AgentSkills = sqliteTable('agent_skills', {
  ...timestamps,
  id: nanoIdDefault().primaryKey(),
  agentId: text('agent_id')
    .notNull()
    .references(() => Agents.id, { onDelete: 'cascade' }),

  name: text('name'),
  description: text('description'),

  instructions: text('instructions'),
  skillId: text('skill_id').$type<SkillId>().notNull(),
  tools: text('tools', { mode: 'json' }).$type<ToolName[]>(),
  variables: text('variables', { mode: 'json' }).$type<Record<string, string | null>>(),
  isEnabled: integer('is_enabled', { mode: 'boolean' }).default(true),

  composioIntegrationAppName: text('composio_integration_app_name', {
    enum: ComposioAppNames,
  }),
  composioToolNames: text('composio_tool_names', { mode: 'json' }).$type<
    ComposioToolName[]
  >(),
})

export const agentSkillsRelations = relations(AgentSkills, ({ one }) => ({
  agent: one(Agents, {
    fields: [AgentSkills.agentId],
    references: [Agents.id],
  }),
}))

/* ________________________________________________________________________________________________ */
/* N8n Workflows                                                                                    */
/* ________________________________________________________________________________________________ */

export const N8nWorkflows = sqliteTable('n8n_workflows', {
  id: nanoIdDefault().primaryKey(),
  ...timestamps,
  n8nWorkflowId: text('n8n_workflow_id').notNull().unique(),
  name: text('name'),
  description: text('description'),
  status: text('status', { enum: ['active', 'inactive', 'error'] }).default('inactive'),
  webhookUrl: text('webhook_url').notNull(),

  // eslint-disable-next-line ts/no-explicit-any
  webhookInputSchema: text('webhook_input_schema', { mode: 'json' }).$type<Record<string, any>>(),
  // eslint-disable-next-line ts/no-explicit-any
  webhookOutputSchema: text('webhook_output_schema', { mode: 'json' }).$type<Record<string, any>>(),
})

export const n8nWorkflowsRelations = relations(N8nWorkflows, (/* { one } */) => ({
  // Example relation if workflows are owned by users
  // owner: one(Users, {
  //   fields: [N8nWorkflows.ownerId],
  //   references: [Users.id],
  // }),
}))
