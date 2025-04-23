import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { GithubIcon, GoogleIcon } from '~/components/ui/social-icons'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { authClient } from '~/features/auth/auth.client'
import { AuthLayout } from './_auth/_components'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.auth?.session) {
      throw redirect({
        to: '/chat',
      })
    }
  },
  loader: async ({ location }) => {
    return {
      activeRoute: location.pathname.split('/')[1] || 'identify',
    }
  },
})

function RouteComponent() {
  const { activeRoute } = Route.useLoaderData()
  const navigate = useNavigate()
  const [loadingProvider, setLoadingProvider] = useState<'github' | 'google' | null>(null)

  const handleTabChange = (value: string) => {
    navigate({ to: `/${value}` })
  }

  const handleSocialSignIn = async (provider: 'github' | 'google') => {
    if (loadingProvider)
      return // Prevent multiple clicks while loading

    setLoadingProvider(provider)
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: `${import.meta.env.VITE_SITE_URL}/chat`,
      })
    }
    catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Unknown error')
    }
    finally {
      setLoadingProvider(null)
    }
  }

  return (
    <AuthLayout>
      <div className="flex w-sm flex-col gap-6 px-4">
        {(activeRoute === 'identify' || activeRoute === 'register') && (
          <Tabs value={activeRoute} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="identify" className="flex-1">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="register" className="flex-1">
                Sign Up
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <Outlet />

        <div className="flex w-full items-center gap-2">
          <div className="bg-border h-px flex-1" />
          <span className="text-muted-foreground text-xs">OR</span>
          <div className="bg-border h-px flex-1" />
        </div>

        <div className="flex w-full gap-2">
          <Button
            onClick={() => handleSocialSignIn('github')}
            type="button"
            variant="outline"
            size="xl"
            disabled={loadingProvider !== null}
            className="border-shadow-border flex-1 bg-[#2b3137] px-0 text-white hover:bg-[#2b3137]/80 disabled:opacity-50"
          >
            {loadingProvider === 'github'
              ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )
              : (
                  <GithubIcon />
                )}
            GitHub
          </Button>
          <Button
            onClick={() => handleSocialSignIn('google')}
            type="button"
            variant="outline"
            size="xl"
            disabled={loadingProvider !== null}
            className="border-shadow-border flex-1 bg-[#4285F4] px-0 hover:bg-[#4285F4]/80 disabled:opacity-50"
          >
            {loadingProvider === 'google'
              ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )
              : (
                  <GoogleIcon />
                )}
            Google
          </Button>
        </div>
      </div>
    </AuthLayout>
  )
}
