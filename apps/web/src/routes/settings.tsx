import type { Tab } from '~/components/ui/animated-link-tabs'
import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { ArrowLeftIcon, LogOutIcon } from 'lucide-react'
import { AnimatedLinkTabs } from '~/components/ui/animated-link-tabs'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { useAuthedQuery, useSignOutMutation } from '~/features/auth/auth.query'

export const Route = createFileRoute('/settings')({
  component: SettingsLayoutComponent,
  beforeLoad: async ({ context }) => {
    if (!context.auth?.session) {
      return redirect({ to: '/identify' })
    }
  },
  loader: async ({ location }) => {
    return { pathname: location.pathname }
  },
})

function SettingsLayoutComponent() {
  const { pathname } = Route.useLoaderData()
  const { data: authData } = useAuthedQuery()
  const { mutateAsync: signOut, isPending: isSigningOut } = useSignOutMutation()

  if (!authData?.session) {
    // This should technically not happen due to beforeLoad, but good practice
    return null
  }

  const { user } = authData // Assuming membership is part of authData now

  // Updated navItems structure for AnimatedLinkTabs
  const navItems: Tab[] = [
    { to: '/settings/account', pathname: '/settings/account', label: 'Account' },
    {
      to: '/settings/preferences',
      pathname: '/settings/preferences',
      label: 'Preferences',
    },
    {
      to: '/settings/integrations',
      pathname: '/settings/integrations',
      label: 'Integrations',
    },
    { to: '/settings/contact', pathname: '/settings/contact', label: 'Contact' },
  ]

  return (
    <div className="container-marketing mx-auto flex min-h-[calc(100vh-theme(spacing.16))] flex-col gap-12 py-8 lg:flex-row">
      {/* Left Sidebar */}
      <aside className="w-full shrink-0 lg:w-64">
        <div className="sticky top-0 space-y-6">
          <Button
            asChild
            variant="ghost"
            size="md"
            hover="reverseShadow"
            className="w-auto"
          >
            <Link to="/chat">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Chat
            </Link>
          </Button>

          <div className="flex flex-col items-center space-y-3">
            <Avatar className="border-border h-24 w-24 border-2">
              <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
              <AvatarFallback className="text-xl">
                {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="mb-0 text-center text-lg font-semibold">
              {user.name || 'User'}
            </h2>
            <p className="text-muted-foreground text-center text-sm">{user.email}</p>
            {user.membership && (
              <Badge
                variant={user.membership.tier === 'pro' ? 'secondary' : 'outline'}
                className="capitalize"
              >
                {user.membership.tier}
                {' '}
                Plan
              </Badge>
            )}
          </div>

          <Button
            variant="default"
            className="hover:bg-destructive hover:text-destructive-foreground w-full"
            size="lg"
            hover="noShadow"
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
