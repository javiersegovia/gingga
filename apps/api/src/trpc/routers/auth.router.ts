import { publicProcedure, router } from '~/trpc'

export const authRouter = router({
  getSession: publicProcedure.query(async ({ ctx }) => {
    return ctx.authSession
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
