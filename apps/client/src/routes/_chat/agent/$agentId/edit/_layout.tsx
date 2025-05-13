import type { Route } from './+types/_layout'
import type { Tab } from '~/components/ui/animated-link-tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@gingga/ui/components/avatar'
import { Button } from '@gingga/ui/components/button'
import {
  ArrowLeftIcon,
  BookIcon,
  BrainIcon,
  SettingsIcon,
  WorkflowIcon,
} from 'lucide-react'
import { href, Link, Outlet, redirect } from 'react-router'
import { AnimatedLinkTabs } from '~/components/ui/animated-link-tabs'
import { getAgentById } from '~/features/agent/agent.service'

export async function loader({ request, params }: Route.LoaderArgs) {
  const pathname = new URL(request.url).pathname
  if (!params.agentId) {
    return redirect(href('/agents'), 302)
  }

  const agent = await getAgentById(params.agentId)

  if (!agent) {
    return redirect(href('/agents'), 302)
  }

  return { agent, pathname }
}

export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  const { agent, pathname } = loaderData
  // const { data: skillOptions } = useSuspenseQuery(skillOptionsQueryOptions)

  const navItems: Tab[] = [
    {
      to: href(`/agent/:agentId/edit/instructions`, { agentId: agent.id }),
      pathname: href(`/agent/:agentId/edit/instructions`, { agentId: agent.id }),
      label: 'Instructions',
      icon: <BrainIcon className="h-4 w-4" />,
    },
    {
      to: href(`/agent/:agentId/edit/knowledge`, { agentId: agent.id }),
      pathname: href(`/agent/:agentId/edit/knowledge`, { agentId: agent.id }),
      label: 'Knowledge',
      icon: <BookIcon className="h-4 w-4" />,
    },
    {
      to: href(`/agent/:agentId/edit/workflows`, { agentId: agent.id }),
      pathname: href(`/agent/:agentId/edit/workflows`, { agentId: agent.id }),
      label: 'Workflows',
      icon: <WorkflowIcon className="h-4 w-4" />,
    },
    {
      to: href(`/agent/:agentId/edit/settings`, { agentId: agent.id }),
      pathname: href(`/agent/:agentId/edit/settings`, { agentId: agent.id }),
      label: 'Settings',
      icon: <SettingsIcon className="h-4 w-4" />,
    },
  ]

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-4 py-10 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-64">
        <div className="sticky top-10 space-y-6">
          <Button variant="outline" size="sm" asChild>
            <Link to={href('/agents')}>
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Agents
            </Link>
          </Button>

          <div className="flex flex-col items-center space-y-3 pt-4">
            <Avatar className="border-border h-full w-full rounded-sm border">
              <AvatarImage
                src={agent.image || ''}
                className="object-contain"
                alt={agent.name || 'Agent'}
              />
              <AvatarFallback className="text-xl">
                {agent.name?.charAt(0).toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="w-full text-left">
              <h2 className="mb-0 text-xl font-semibold">{agent.name}</h2>
              <p className="text-muted-foreground text-sm">
                {agent.description || 'Agent Description'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex flex-1 flex-col">
        <div className="relative block w-auto">
          <AnimatedLinkTabs tabs={navItems} pathname={pathname} />
        </div>

        <div className="rounded-md p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
