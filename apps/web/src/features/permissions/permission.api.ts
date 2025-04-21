import { createServerFn } from '@tanstack/react-start'
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'
import { authMiddleware } from '~/middleware/auth-guard' // Assuming you have this
import {
  hasEnterpriseMembership,
  hasProMembership,
  isAdmin,
  isAgentOwner,
} from './permission.service'

/**
 * Server function to check if the current authenticated user is an admin.
 */
export const $isAdmin = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .handler(({ context }) => {
    return { isAdmin: isAdmin(context.auth.user) }
  })

/**
 * Server function to check if the current authenticated user owns a specific agent.
 */
export const $isAgentOwner = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .validator(zodValidator(z.object({ agentId: z.string() })))
  .handler(async ({ context, data }) => {
    return { isOwner: await isAgentOwner(context.auth.user.id, data.agentId) }
  })

/**
 * Server function to check if the current authenticated user has Pro membership.
 */
export const $hasProMembership = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .handler(({ context }) => {
    return { hasPro: hasProMembership(context.auth.membership) }
  })

/**
 * Server function to check if the current authenticated user has Enterprise membership.
 */
export const $hasEnterpriseMembership = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .handler(({ context }) => {
    return { hasEnterprise: hasEnterpriseMembership(context.auth.membership) }
  })
