import { count } from '@gingga/db'
import { Users } from '@gingga/db/schema'
import { agentRouter } from '~/features/agent/agent.router'
import { protectedProcedure, publicProcedure, router } from '../index'
import { authRouter } from './auth.router'

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return 'OK'
  }),
  auth: authRouter,
  agent: agentRouter,
  privateData: protectedProcedure.query(async ({ ctx }) => {
    const usersCount = await ctx.db.select({ count: count() }).from(Users)

    return {
      message: `We have ${usersCount[0].count} users`,
      currentUser: `You are currently logged in as ${ctx.user.email}`,
    }
  }),
})

export type TRPCAppRouter = typeof appRouter
