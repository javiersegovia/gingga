import type { AppContext } from '~/server/context.server'
import type { TRPCAppRouter } from '~/server/trpc/routers/app.router'
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'
import { getContext } from 'hono/context-storage'
import SuperJSON from 'superjson'
import { webEnv } from '~/lib/env.server'

export function setupTRPCClient() {
  const c = getContext<AppContext>()
  const headers = c.req.raw.headers

  const trpcClient = createTRPCClient<TRPCAppRouter>({
    links: [
      loggerLink({
        enabled: op =>
          import.meta.env.MODE === 'development'
            || (op.direction === 'down' && op.result instanceof Error),
      }),
      httpBatchLink({
        transformer: SuperJSON,
        url: `${webEnv.VITE_SITE_URL}/api/trpc`,
        fetch(url, options) {
          return fetch(url, { ...options, headers, credentials: 'include' })
        },
      }),
    ],
  })

  return trpcClient
}
