import type { AppContext } from '~/server/context'
import type { TRPCAppRouter } from '~/server/trpc/routers/app.router'
import { QueryClient } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'
import { getContext } from 'hono/context-storage'
import SuperJSON from 'superjson'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60, // 1 minute
      },
    },
  })
}

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
