// apps/api/src/trpc/routers/auth.router.ts
import { getAuthSession, getBetterAuth, getHonoContext } from '~/server/context'
import { publicProcedure, router } from '~/server/trpc'

export const authRouter = router({
  getSession: publicProcedure.query(async () => {
    const authSession = await getAuthSession()
    return authSession
  }),

  signOut: publicProcedure.mutation(async () => {
    const c = getHonoContext()
    await getBetterAuth().api.signOut({
      headers: c.req.raw.headers,
    })
    return { success: true }
  }),
})
