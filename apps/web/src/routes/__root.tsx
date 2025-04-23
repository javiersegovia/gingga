// import { scan } from 'react-scan' // react-scan must be imported before React and TanStack Start

import type { AppRouterContext } from '../router'
import fontsourceVariableGeist from '@fontsource-variable/geist?url'
import fontsourceVariableNunito from '@fontsource-variable/nunito?url'
import fontsourceOutfit from '@fontsource-variable/outfit?url'
import fontsourceUnbounded from '@fontsource-variable/unbounded?url'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { ThemeProvider, useTheme } from '~/components/shared/theme'

import { Toaster } from '~/components/ui/sonner'
import globalCss from '~/styles/tailwind.css?url'

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null // Render nothing in production
  : lazy(() =>
      import('@tanstack/react-router-devtools').then(res => ({
        default: res.TanStackRouterDevtools,
      })),
    )

export const Route = createRootRouteWithContext<AppRouterContext>()({
  beforeLoad: async ({ context: { trpc, queryClient } }) => {
    const auth = await queryClient.ensureQueryData(trpc.auth.getSession.queryOptions())
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
        href: fontsourceVariableGeist,
      },
      {
        rel: 'stylesheet',
        href: fontsourceVariableNunito,
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
  return <Toaster position="top-center" theme={resolved} />
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
