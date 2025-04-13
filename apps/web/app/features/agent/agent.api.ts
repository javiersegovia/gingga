import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { zodValidator } from '@tanstack/zod-adapter'
import { authMiddleware } from '@/middleware/auth-guard'
import { AgentSchema, AgentFormSchema } from './agent.schema'
import {
  createAgent,
  getAgents,
  getAgentById,
  updateAgentById,
  deleteAgentById,
  getRecentAgentsForUser,
} from './agent.service'
import { contextMiddleware } from '@/global-middleware'
import { setResponseStatus } from '@tanstack/react-start/server'

export const $getAgentById = createServerFn({
  method: 'GET',
})
  .validator(zodValidator(z.object({ id: z.string() })))
  .handler(async ({ data }) => {
    const agent = await getAgentById(data.id)
    if (!agent) {
      throw new Error('Agent not found')
    }
    return agent
  })

export const $getAgents = createServerFn({
  method: 'GET',
}).handler(async () => {
  const agents = await getAgents()
  return { agents }
})

/**
 * Server function to get the most recently used agents for the authenticated user.
 */
export const $getRecentChatsWithAgents = createServerFn({
  method: 'GET',
})
  .middleware([contextMiddleware])
  .handler(async ({ context }) => {
    if (!context.authSession.isAuthenticated) {
      return null
    }

    const userId = context.authSession.user.id

    try {
      // Call the service function to fetch recent agents
      const agents = await getRecentAgentsForUser(userId)
      return { agents }
    } catch (error) {
      console.error('Error fetching recent agents in API handler:', error)
      // Re-throw or return a structured error response
      // Consider using a more specific error type if available
      throw new Error('Failed to retrieve recent agents.')
    }
  })

export const $createAgent = createServerFn({
  method: 'POST',
})
  .middleware([authMiddleware])
  .validator(zodValidator(AgentFormSchema))
  .handler(async ({ data }) => {
    try {
      const agent = await createAgent(data)
      return agent
    } catch (e) {
      console.error(e)
      setResponseStatus(500)
      return { error: 'Failed to create agent due to a server error.' }
    }
  })

export const $updateAgentById = createServerFn({
  method: 'POST',
})
  .middleware([authMiddleware])
  .validator(
    zodValidator(
      AgentFormSchema.extend({
        id: z.string(),
      }),
    ),
  )
  .handler(async ({ data }) => {
    const agent = await updateAgentById(data.id, data)
    if (!agent) {
      throw new Error('Agent not found')
    }
    return agent
  })

export const $deleteAgentById = createServerFn({
  method: 'POST',
})
  .middleware([authMiddleware])
  .validator(zodValidator(z.object({ id: z.string() })))
  .handler(async ({ data }) => {
    const success = await deleteAgentById(data.id)
    if (!success) {
      throw new Error('Agent not found')
    }
    return { success }
  })
