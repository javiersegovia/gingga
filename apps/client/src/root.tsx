// apps/client/src/root.tsx
import type { Route } from './+types/root'

import type { ClientEnv } from '~/lib/env.server'
import { Toaster } from '@gingga/ui/components/sonner'
import { dehydrate } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router'
import { clientEnv } from '~/lib/env.server'
import { getTheme } from '~/lib/theme.server'
import { TRPCTanStackQueryProvider } from '~/lib/trpc/react'
import { sessionMiddleware } from '~/middleware/auth.middleware'
// import { contextStorageMiddleware } from '~/middleware/context-storage.server'
import { getQueryClient, honoContextMiddleware } from '~/server/context'
import '@fontsource-variable/outfit/wght.css'
import '@fontsource-variable/unbounded/wght.css'
import '@fontsource-variable/geist/wght.css'
import '@fontsource-variable/plus-jakarta-sans/wght.css'
import './styles/app.css'

export const unstable_middleware = [honoContextMiddleware, sessionMiddleware]

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

export async function loader() {
  const theme = await getTheme()
  const queryClient = getQueryClient()
  return {
    ENV: clientEnv,
    theme,
    dehydratedState: dehydrate(queryClient),
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useRouteLoaderData<typeof loader>('root')
  return (
    <html lang="en" className={loaderData?.theme ?? 'system'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export function ToasterWrapper() {
  // const { resolved } = useTheme()
  return <Toaster position="top-center" theme="light" />
}

export default function App({ loaderData }: { loaderData: { ENV: ClientEnv } }) {
  return (
    <>
      <TRPCTanStackQueryProvider>
        <Outlet />
        <ToasterWrapper />

        <ReactQueryDevtools buttonPosition="bottom-right" />
      </TRPCTanStackQueryProvider>

      {/* eslint-disable-next-line react-dom/no-dangerously-set-innerhtml */}
      <script dangerouslySetInnerHTML={{
        __html: `
          window.ENV = ${JSON.stringify(loaderData.ENV)}
        `,
      }}
      />
    </>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details
      = error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  }
  else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}

declare global {
  // Type for the public env available globally (server/client)
  const ENV: ClientEnv
  interface Window {
    ENV: ClientEnv
  }
}
