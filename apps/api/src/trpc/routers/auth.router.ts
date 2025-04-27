// apps/api/src/trpc/routers/auth.router.ts
import type { ContextEnv } from '~/server'
import { getContext } from 'hono/context-storage'
import { publicProcedure, router } from '~/trpc'

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    const c = getContext<ContextEnv>()

    console.log('environment ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    console.log(c.var.__environment)

    if (ctx.authSession.isAuthenticated) {
      return ctx.authSession
    }

    return { isAuthenticated: false as const }
  }),

  signOut: publicProcedure.mutation(async ({ ctx: { headers, auth } }) => {
    if (!headers) {
      throw new Error('Headers are required')
    }
    await auth.api.signOut({
      headers,
    })
    return { success: true }
  }),
})
