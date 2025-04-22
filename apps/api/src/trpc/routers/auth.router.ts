import { publicProcedure, router } from '~/trpc'

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    if (ctx.session && ctx.user) {
      return { session: ctx.session, user: ctx.user }
    }

    return null
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
