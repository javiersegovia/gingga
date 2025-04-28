import type { Route } from './+types/_layout'
import type { Tab } from '~/components/ui/animated-link-tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@gingga/ui/components/avatar'
import { Badge } from '@gingga/ui/components/badge'
import { Button } from '@gingga/ui/components/button'
import { ArrowLeftIcon, LogOutIcon } from 'lucide-react'
import { href, Link, Outlet } from 'react-router'
import { AnimatedLinkTabs } from '~/components/ui/animated-link-tabs'
import { useAuthQuery, useSignOutMutation } from '~/lib/auth/auth.query'
import { authMiddleware } from '~/middleware/auth.middleware'

export const unstable_middleware = [authMiddleware]

export function loader({ request }: Route.LoaderArgs) {
  return { pathname: new URL(request.url).pathname }
}

export default function SettingsLayoutComponent({ loaderData }: Route.ComponentProps) {
  const { pathname } = loaderData
  const { data: authData } = useAuthQuery()
  const { mutateAsync: signOut, isPending: isSigningOut } = useSignOutMutation()

  if (!authData?.isAuthenticated) {
    // This should technically not happen due to beforeLoad, but good practice
    return null
  }

  const { user } = authData // Assuming membership is part of authData now

  // Updated navItems structure for AnimatedLinkTabs
  const navItems: Tab[] = [
    { to: href('/settings/account'), pathname: href('/settings/account'), label: 'Account' },
    {
      to: href('/settings/preferences'),
      pathname: href('/settings/preferences'),
      label: 'Preferences',
    },
    {
      to: href('/settings/integrations'),
      pathname: href('/settings/integrations'),
      label: 'Integrations',
    },
    { to: href('/settings/contact'), pathname: href('/settings/contact'), label: 'Contact' },
  ]

  return (
    <div className="container-marketing mx-auto flex min-h-[calc(100vh-theme(spacing.16))] max-w-2xl flex-col gap-12 py-8 lg:flex-row">
      {/* Left Sidebar */}
      <aside className="w-full shrink-0 lg:w-64">
        <div className="sticky top-0 space-y-6">
          <Button
            asChild
            variant="outline"
            size="md"
            hover="reverse"
            className="w-auto"
          >
            <Link to="/chat">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Chat
            </Link>
          </Button>

          <div className="flex flex-col items-center space-y-3">
            <Avatar className="border-border h-24 w-24 border-2">
              <AvatarImage src={user?.image || ''} alt={user?.name || 'User'} />
              <AvatarFallback className="text-xl">
                {user?.name?.charAt(0) || user?.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="mb-0 text-center text-lg font-semibold">
              {user?.name || 'User'}
            </h2>
            <p className="text-muted-foreground text-center text-sm">{user?.email}</p>
            {user?.membership && (
              <Badge
                variant={user?.membership?.tier === 'pro' ? 'secondary' : 'outline'}
                className="capitalize"
              >
                {user?.membership?.tier}
                {' '}
                Plan
              </Badge>
            )}
          </div>

          <Button
            variant="outline"
            // className="hover:bg-destructive hover:text-destructive-foreground w-full"
            className="w-full"
            size="lg"
            hover="reverse"
            onClick={async () => await signOut()}
            disabled={isSigningOut}
            isPending={isSigningOut}
          >
            <LogOutIcon className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Right Content Area */}
      <main className="flex flex-1 flex-col">
        <AnimatedLinkTabs tabs={navItems} className="mr-auto" pathname={pathname} />
        <Outlet />
      </main>
    </div>
  )
}
