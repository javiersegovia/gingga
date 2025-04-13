import { QueryClient } from '@tanstack/react-query'
import { createRouter as createTanStackRouter, isRedirect } from '@tanstack/react-router'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'

import { DefaultCatchBoundary } from './components/shared/default-catch-boundary'
import { NotFound } from './components/shared/not-found'
import { routeTree } from './routeTree.gen'

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60, // 1 minute
        experimental_prefetchInRender: true,
      },
    },
  })

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: NotFound,
    scrollRestoration: true,
    defaultStructuralSharing: true,
  })

  // handle redirect without useServerFn when using tanstack query
  queryClient.getQueryCache().config.onError = handleRedirectError
  queryClient.getMutationCache().config.onError = handleRedirectError

  function handleRedirectError(error: Error) {
    if (isRedirect(error)) {
      router.navigate(
        router.resolveRedirect({
          ...error,
          _fromLocation: router.state.location,
        }),
      )
    }
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
