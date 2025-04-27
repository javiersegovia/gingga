// apps/client/src/lib/trpc/shared.tsx
import type { TRPCAppRouter } from '@gingga/api/trpc/routers/index'
import type { QueryClient } from '@tanstack/react-query'
import type { TRPCClient } from '@trpc/client'
import type { AppContext } from '~/server/context'
import { createContext } from '@gingga/api/context'
import { appRouter } from '@gingga/api/trpc/routers/index'
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { getContext } from 'hono/context-storage'
import SuperJSON from 'superjson'

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

export async function setupTRPCServer({ trpcClient, queryClient }: { trpcClient: TRPCClient<TRPCAppRouter>, queryClient: QueryClient }) {
  const c = getContext<AppContext>()
  const trpcServer = createTRPCOptionsProxy<TRPCAppRouter>({
    client: trpcClient,
    queryClient,
    router: appRouter,
    ctx: await createContext(c),
  })
  return trpcServer
}
