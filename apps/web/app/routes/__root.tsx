// import { scan } from 'react-scan' // react-scan must be imported before React and TanStack Start

import { lazy, Suspense } from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  createRootRouteWithContext,
  Outlet,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import globalCss from '@/styles/globals.css?url'
import { ThemeProvider, useTheme } from '@/components/shared/theme'
import fontsourceOutfit from '@fontsource-variable/outfit?url'
import fontsourceUnbounded from '@fontsource-variable/unbounded?url'

import { Toaster } from '@gingga/ui/components/sonner'
import { authQueryOptions } from '@/features/auth/auth.query'

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null // Render nothing in production
  : lazy(() =>
      import('@tanstack/react-router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    )

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: async ({ context }) => {
    const auth = await context.queryClient.ensureQueryData(authQueryOptions())
    return { auth }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Gingga — Top-tier software development',
      },
    ],
    links: [
      { rel: 'stylesheet', href: globalCss },
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
      {
        rel: 'stylesheet',
        href: fontsourceOutfit,
      },
      {
        rel: 'stylesheet',
        href: fontsourceUnbounded,
      },
      {
        rel: 'stylesheet',
        href: 'https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@1&display=swap',
      },
    ],
  }),

  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

export function ToasterWrapper() {
  const { resolved } = useTheme()
  return <Toaster theme={resolved} />
}

function RootDocument({ children }: { children: React.ReactNode }) {
  // useEffect(() => {
  //   // Make sure to run this only after hydration
  //   scan({
  //     enabled: true,
  //   })
  // }, [])

  return (
    <html suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <ToasterWrapper />
          {children}
        </ThemeProvider>

        <ReactQueryDevtools buttonPosition="bottom-right" />
        <Suspense>
          <TanStackRouterDevtools position="bottom-right" />
        </Suspense>

        <Scripts />
      </body>
    </html>
  )
}
