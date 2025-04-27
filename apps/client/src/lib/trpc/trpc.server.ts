import { appRouter } from '@gingga/api/trpc/routers/index'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { getQueryClient } from '~/middleware/context-hono.server'
import { getAPIContext } from '~/middleware/context-storage.server'

export async function getTRPC() {
  const queryClient = getQueryClient()

  return createTRPCOptionsProxy({
    ctx: await getAPIContext(),
    queryClient,
    router: appRouter,
  })
}
