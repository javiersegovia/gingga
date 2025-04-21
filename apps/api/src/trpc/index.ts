import type { Context } from '../context'
import { initTRPC, TRPCError } from '@trpc/server'
import SuperJSON from 'superjson'
import { ZodError } from 'zod'

const t = initTRPC.context<Context>().create({
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

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.authSession.isAuthenticated) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'We could not find your session. Please sign in again.',
    })
  }

  return next({
    ctx: {
      ...ctx,
    },
  })
})
