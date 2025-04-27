import type { Session } from 'better-auth'
import type { getUserById } from '~/features/user/user.service'
import type { AuthSession } from '~/server/context'
import { initTRPC, TRPCError } from '@trpc/server'
import SuperJSON from 'superjson'
import { ZodError } from 'zod'
import { getAuthSession } from '~/server/context'

// Use the correct type for the user
// type AuthenticatedUser = Awaited<ReturnType<typeof getUserById>>

// Use function declaration as per linter rule
export function assertAuthenticated(authSession: AuthSession) {
  if (!authSession.isAuthenticated) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'We could not find your session. Please sign in again.',
    })
  }

  return authSession
}

const t = initTRPC.context().create({
  transformer: SuperJSON,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.message : null,
      },
    }
  },
})

export const router = t.router
export const publicProcedure = t.procedure
export const createCallerFactory = t.createCallerFactory

export const protectedProcedure = t.procedure.use(async ({ next }) => {
  const authSession = await getAuthSession()
  const authenticatedSession = assertAuthenticated(authSession)

  return next({
    ctx: {
      ...authenticatedSession,
    },
  })
})
