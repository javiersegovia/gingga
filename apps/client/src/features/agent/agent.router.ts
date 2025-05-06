import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { getAuthSession } from '~/server/context.server'
import { protectedProcedure, publicProcedure, router } from '~/server/trpc'
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
  getAgentById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const agent = await getAgentById(input.id)
      if (!agent) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' })
      }
      return agent
    }),

  getAgents: publicProcedure.query(async () => {
    const authSession = await getAuthSession()
    const userId = authSession?.user?.id ?? null
    const role = authSession?.user?.role ?? null

    const agents = await getAgents(userId, role)
    return { agents }
  }),

  getRecentChatsWithAgents: protectedProcedure.query(async ({ ctx }) => {
    const agents = await getRecentAgentsForUser(ctx.user.id)
    return { agents }
  }),

  // Create a new agent (protected)
  createAgent: protectedProcedure
    .input(AgentFormSchema)
    .mutation(async ({ input }) => {
      const agent = await createAgent(input)
      return agent
    }),

  updateAgentById: protectedProcedure
    .input(AgentFormSchema.extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      const agent = await updateAgentById(input)
      if (!agent) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' })
      }
      return agent
    }),

  deleteAgentById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const result = await deleteAgentById(input.id)
      if (!result.success) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' })
      }
      return result
    }),
})

export type AgentRouter = typeof agentRouter
