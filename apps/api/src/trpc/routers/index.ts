// apps/api/src/trpc/routers/index.ts
import { count } from '@gingga/db'
import { Users } from '@gingga/db/schema'
import { agentRouter } from '~/features/agent/agent.router'
import { chatRouter } from '~/features/chat/chat.router'
import { composioRouter } from '~/features/composio/composio.router'
import { contactRouter } from '~/trpc/routers/contact.router'
import { protectedProcedure, publicProcedure, router } from '../index'
import { authRouter } from './auth.router'

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return 'OK'
  }),
  auth: authRouter,
  agent: agentRouter,
  chat: chatRouter,
  composio: composioRouter,
  contact: contactRouter,
  privateData: protectedProcedure.query(async ({ ctx }) => {
    const usersCount = await ctx.db.select({ count: count() }).from(Users)

    return {
      message: `We have ${usersCount[0].count} users`,
      currentUser: `You are currently logged in as ${ctx.authSession?.user?.email}`,
    }
  }),
})

export type TRPCAppRouter = typeof appRouter
