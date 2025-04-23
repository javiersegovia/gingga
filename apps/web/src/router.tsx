import type { TRPCAppRouter } from '@gingga/api/src/trpc/routers/index'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { QueryClient } from '@tanstack/react-query'
import { createRouter as createTanStackRouter, isRedirect } from '@tanstack/react-router'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'

import { createIsomorphicFn } from '@tanstack/react-start'
import { getHeaders } from '@tanstack/react-start/server'
import { createTRPCClient, httpBatchLink, loggerLink, TRPCClientError } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import SuperJSON from 'superjson'

import { DefaultCatchBoundary } from './components/shared/default-catch-boundary'
import { NotFound } from './components/shared/not-found'
import { TRPCProvider } from './lib/trpc'
import { routeTree } from './routeTree.gen'

export interface AppRouterContext {
  queryClient: QueryClient
  trpc: TRPCOptionsProxy<TRPCAppRouter>
}

function getUrl() {
  const base = (() => {
    // if (typeof window !== 'undefined')
    //   return ''
    if (process.env.VITE_API_URL)
      return process.env.VITE_API_URL
    return `http://localhost:${process.env.PORT ?? 3000}`
  })()
  return `${base}/trpc`
}

const headers = createIsomorphicFn()
  .client(() => ({}))
  .server(() => getHeaders())

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      dehydrate: {
        serializeData: SuperJSON.serialize,
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60, // 1 minute
        experimental_prefetchInRender: true,
      },
    },
  })

  const trpcClient = createTRPCClient<TRPCAppRouter>({
    links: [
      loggerLink({
        // Always logs to console in dev mode. In production, only logs errors.
        enabled: opts =>
          (import.meta.env.MODE === 'development' && typeof window !== 'undefined')
          || (opts.direction === 'down' && opts.result instanceof Error),
      }),
      httpBatchLink({
        url: getUrl(),
        transformer: SuperJSON,
        headers,
      }),
    ],
  })

  const trpc = createTRPCOptionsProxy<TRPCAppRouter>({
    client: trpcClient,
    queryClient,
  })

  const router = createTanStackRouter({
    context: { queryClient, trpc },
    routeTree,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: NotFound,
    scrollRestoration: true,
    defaultStructuralSharing: true,
    Wrap: (props: { children: React.ReactNode }) => (
      <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
        {props.children}
      </TRPCProvider>
    ),
  })

  // handle errors globally
  queryClient.getQueryCache().config.onError = handleGlobalError
  queryClient.getMutationCache().config.onError = handleGlobalError

  function handleGlobalError(error: unknown) {
    // First, handle redirects specifically
    if (isRedirect(error)) {
      router.navigate(
        router.resolveRedirect({
          ...error,
          _fromLocation: router.state.location,
        }),
      )
      return // Stop processing if it's a redirect
    }

    console.log('Debugging')
    console.log(router.state.location)
    console.log(getUrl())
    console.log(trpc.healthCheck.pathKey())

    // Next, check for the specific tRPC JSON parsing error
    if (error instanceof TRPCClientError && error.cause instanceof SyntaxError && error.message.includes('is not valid JSON')) {
      console.error(
        'Caught tRPC JSON Parsing Error globally:',
        error, // Now correctly typed as TRPCClientError
      )
      // TODO: Implement user-facing error handling here
      // e.g., show a toast notification: toast.error("Server communication error. Please try again later.")
      return // Stop processing if handled
    }

    // TODO: Add handling for other types of global errors if needed

    // Default error logging for unhandled cases
    console.error('Unhandled global error:', error)
  }

  if (typeof window !== 'undefined') {
    window.getRouter = () => router
    window.getQueryClient = () => queryClient
  }

  return routerWithQueryClient(router, queryClient)
}

declare global {
  interface Window {
    getRouter: () => ReturnType<typeof createRouter>
    getQueryClient: () => QueryClient
  }
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
