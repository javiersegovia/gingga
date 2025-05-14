import type { Route } from './+types/_layout'

import { Button } from '@gingga/ui/components/button'
import { GithubIcon, GoogleIcon } from '@gingga/ui/components/social-icons'
import { Tabs, TabsList, TabsTrigger } from '@gingga/ui/components/tabs'
import { Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { useClientEnv } from '~/hooks/use-client-env'
import { authClient } from '~/lib/auth/auth-client'
import { anonymousMiddleware } from '~/middleware/auth.middleware'
import { AuthLayout } from './_components'

export const unstable_middleware = [anonymousMiddleware]

export async function loader({ request }: Route.LoaderArgs) {
  return {
    activeRoute: new URL(request.url).pathname.split('/')[1] || 'identify',
  }
}

export default function RouteComponent({ loaderData: { activeRoute } }: Route.ComponentProps) {
  const navigate = useNavigate()
  const [loadingProvider, setLoadingProvider] = useState<'github' | 'google' | null>(null)
  const env = useClientEnv()

  const handleTabChange = async (value: string) => {
    await navigate(`/${value}`)
  }

  const handleSocialSignIn = async (provider: 'github' | 'google') => {
    if (loadingProvider)
      return // Prevent multiple clicks while loading

    setLoadingProvider(provider)

    await authClient.signIn.social({
      provider,
      callbackURL: `${env.VITE_SITE_URL}/agents`,
    }, {
      onSuccess() {
        setLoadingProvider(null)
      },

      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Unknown error has occurred. Please try again later.')
        setLoadingProvider(null)
      },
    })
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
