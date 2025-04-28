import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { TRPCAppRouter } from '~/server/trpc/routers/app.router'
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCContext } from '@trpc/tanstack-react-query'
import { useState } from 'react'
import { ClientOnly } from 'remix-utils/client-only'
import SuperJSON from 'superjson'
import { useDehydratedState } from '~/hooks/use-dehydrated-state'

function makeTRPCClient(siteUrl: string) {
  return createTRPCClient<TRPCAppRouter>({
    links: [
      loggerLink({
        enabled: op =>
          import.meta.env.MODE === 'development'
            || (op.direction === 'down' && op.result instanceof Error),
      }),
      httpBatchLink<TRPCAppRouter>({
        transformer: SuperJSON,
        url: `${siteUrl}/api/trpc`,
        async fetch(url, options) {
          // start with whatever TanStack Query gave us
          const headers = new Headers(options?.headers)
          headers.set('x-trpc-source', import.meta.env.SSR ? 'ssr' : 'react')

          // 👉 Run only while React is rendering on the server
          if (import.meta.env.SSR) {
            // the dynamic import keeps hono/context-storage out of the browser bundle
            const { getContext } = await import('hono/context-storage')
            const c = getContext()
            return fetch(url, { ...options, headers: c.req.raw.headers, credentials: 'include' })
          }

          return fetch(url, {
            ...options,
            headers, // ◀️ don’t forget this!
            credentials: 'include', // only matters in the browser
          })
        },
      }),
    ],
  })
}

export const { TRPCProvider, useTRPC } = createTRPCContext<TRPCAppRouter>()

export function TRPCTanStackQueryProvider({ children, siteUrl }: { children: React.ReactNode, siteUrl: string }) {
  const [trpcClient] = useState(() => makeTRPCClient(siteUrl))
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }))
  const dehydratedState = useDehydratedState()

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          {children}
          <ClientOnly>
            {() => <ReactQueryDevtools buttonPosition="bottom-right" />}
          </ClientOnly>
        </TRPCProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  )
}

export type RouterInputs = inferRouterInputs<TRPCAppRouter>
export type RouterOutputs = inferRouterOutputs<TRPCAppRouter>
