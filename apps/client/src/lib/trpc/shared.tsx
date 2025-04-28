import type { QueryClient } from '@tanstack/react-query'
import type { TRPCClient } from '@trpc/client'
import type { AppContext } from '~/server/context'
import type { TRPCAppRouter } from '~/server/trpc/routers/app.router'
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { getContext } from 'hono/context-storage'
import SuperJSON from 'superjson'
import { getQueryClient } from '~/server/context'
import { appRouter } from '~/server/trpc/routers/app.router'

export function setupTRPCClient() {
  const trpcClient = createTRPCClient<TRPCAppRouter>({
    links: [
      loggerLink({
        enabled: op =>
          import.meta.env.MODE === 'development'
            || (op.direction === 'down' && op.result instanceof Error),
      }),
      httpBatchLink({
        transformer: SuperJSON,
        url: `/trpc`,
        fetch(url, options) {
          if (typeof window === 'undefined') {
            const c = getContext<AppContext>()
            // return appRouter.createCaller(await createContext(getContext<ClientContextEnv>())).$batch(opts)
            return fetch(url, { ...options, headers: c.req.raw.headers, credentials: 'include' })
          }

          return fetch(url, { ...options, credentials: 'include' })
        },
      }),
    ],
  })

  return trpcClient
}

export function setupTRPCProxy({ trpcClient, queryClient }: { trpcClient: TRPCClient<TRPCAppRouter>, queryClient: QueryClient }) {
  const trpcProxy = createTRPCOptionsProxy<TRPCAppRouter>({
    client: trpcClient,
    queryClient,
    router: appRouter,
  })
  return trpcProxy
}

export async function setupTRPC() {
  const trpcClient = setupTRPCClient()
  const queryClient = getQueryClient()
  const trpcProxy = setupTRPCProxy({ trpcClient, queryClient })

  const c = getContext<AppContext>()

  c.set('trpcClient', trpcClient)
  c.set('queryClient', queryClient)
  c.set('trpcProxy', trpcProxy)
}
