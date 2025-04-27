import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure, router } from '~/server/trpc'
import {
  AgentFormSchema,
} from './agent.schema'
import {
  createAgent,
  deleteAgentById,
  getAgentById,
  getAgents,
  getRecentAgentsForUser,
  updateAgentById,
} from './agent.service'

export const agentRouter = router({
  // Get single agent by ID (protected - assumes only logged-in users can fetch agents)
  getAgentById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const agent = await getAgentById(input.id)
      if (!agent) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' })
      }
      return agent
    }),

  // List all agents (protected - assumes only logged-in users can list all agents)
  getAgents: protectedProcedure.query(async () => {
    const agents = await getAgents()
    return { agents }
  }),

  // Get recent agents for the current user (protected)
  getRecentChatsWithAgents: protectedProcedure.query(async ({ ctx }) => {
    const agents = await getRecentAgentsForUser(ctx.user.id) // Pass user ID from context
    return { agents }
  }),

  // Create a new agent (protected)
  createAgent: protectedProcedure
    .input(AgentFormSchema)
    .mutation(async ({ input }) => {
      // Pass user ID from context if needed by createAgent service function
      const agent = await createAgent(input)
      return agent
    }),

  // Update an existing agent (protected)
  updateAgentById: protectedProcedure
    .input(AgentFormSchema.extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      const agent = await updateAgentById(input)
      if (!agent) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' })
      }
      return agent
    }),

  // Delete an agent by ID (protected)
  deleteAgentById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const result = await deleteAgentById(input.id)
      if (!result.success) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' })
      }
      return result // Returns { success: true }
    }),
})

export type AgentRouter = typeof agentRouter
