import { userRouter } from '~/features/admin/users/user.router'
import { agentRouter } from '~/features/agent/agent.router'
import { chatRouter } from '~/features/chat/chat.router'
import { composioRouter } from '~/features/composio/composio.router'
import { contactRouter } from '~/features/contact/contact.router'
import { n8nRouter } from '~/features/workflows/n8n.router'
import { authRouter } from '~/lib/auth/auth.router'
import { router } from '~/server/trpc'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  agent: agentRouter,
  auth: authRouter,
  chat: chatRouter,
  composio: composioRouter,
  contact: contactRouter,
  n8n: n8nRouter,
  user: userRouter,
})

export type TRPCAppRouter = typeof appRouter
