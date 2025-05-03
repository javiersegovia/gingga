import type { Session } from 'better-auth'
import type { AuthenticatedUser, AuthSession } from '~/server/context.server'
import { initTRPC, TRPCError } from '@trpc/server'
import SuperJSON from 'superjson'
import { ZodError } from 'zod'
import { getAuthSession } from '~/server/context.server'

// Restore the type alias for clarity

// Restore explicit return type and function declaration
export function assertAuthenticated(authSession: AuthSession): { isAuthenticated: true, session: Session, user: AuthenticatedUser } {
  if (!authSession.isAuthenticated || !authSession.user || !authSession.session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'We could not find your session. Please sign in again.',
    })
  }

  return {
    isAuthenticated: true,
    session: authSession.session,
    user: authSession.user,
  }
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
  const { isAuthenticated, session, user } = assertAuthenticated(authSession)

  return next({
    ctx: {
      isAuthenticated,
      session,
      user,
    },
  })
})

export const adminProcedure = t.procedure.use(async ({ next }) => {
  const authSession = await getAuthSession()
  const { isAuthenticated, session, user } = assertAuthenticated(authSession)

  if (user.role !== 'admin') {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You are not authorized to access this resource.',
    })
  }

  return next({
    ctx: {
      isAuthenticated,
      session,
      user,
    },
  })
})
