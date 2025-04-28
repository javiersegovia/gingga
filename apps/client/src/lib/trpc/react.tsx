import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { TRPCAppRouter } from '~/server/trpc/routers/app.router'
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCContext } from '@trpc/tanstack-react-query'
import { useState } from 'react'
import SuperJSON from 'superjson'
import { useDehydratedState } from '~/hooks/use-dehydrated-state'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  })
}

function getLinks() {
  return [
    loggerLink({
      enabled: op =>
        import.meta.env.MODE === 'development'
          || (op.direction === 'down' && op.result instanceof Error),
    }),
    httpBatchLink({
      transformer: SuperJSON,
      url: `/trpc`,
      fetch(url, options) {
        const headers = new Headers(options?.headers)
        headers.set('x-trpc-source', 'react')
        return fetch(url, { ...options, headers, credentials: 'include' })
      },
    }),
  ]
}

export const { TRPCProvider, useTRPC } = createTRPCContext<TRPCAppRouter>()

export function TRPCTanStackQueryProvider({ children }: { children: React.ReactNode }) {
  const [trpcClient] = useState(() =>
    createTRPCClient<TRPCAppRouter>({
      links: getLinks(),
    }),
  )

  const [queryClient] = useState(() => makeQueryClient())
  const dehydratedState = useDehydratedState()

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          {children}
        </TRPCProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  )
}

export type RouterInputs = inferRouterInputs<TRPCAppRouter>
export type RouterOutputs = inferRouterOutputs<TRPCAppRouter>
