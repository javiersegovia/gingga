import { createFileRoute, Link, Outlet, useRouter } from '@tanstack/react-router'
import { $getAgentById } from '@/features/agent/agent.api'
import { Button } from '@gingga/ui/components/button'
import { ArrowLeftIcon } from 'lucide-react'
import { DeleteAgentDialog } from '@/features/agent/components/delete-agent-dialog'
import { AnimatedLinkTabs } from '@/components/ui/animated-link-tabs'
import type { Tab } from '@/components/ui/animated-link-tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@gingga/ui/components/avatar'

export const Route = createFileRoute('/_demo/chat/agent/$agentId/edit')({
  loader: async ({
    params,
    location,
  }: {
    params: { agentId: string }
    location: { pathname: string }
  }) => {
    const agent = await $getAgentById({ data: { id: params.agentId } })
    if (!agent) {
      throw new Error('Agent not found')
    }
    return { agent, pathname: location.pathname }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { agent, pathname } = Route.useLoaderData()

  const navItems: Tab[] = [
    {
      to: '/chat/agent/$agentId/edit/instructions',
      pathname: `/chat/agent/${agent.id}/edit/instructions`,
      label: 'Instructions',
    },
    {
      to: '/chat/agent/$agentId/edit/skills',
      pathname: `/chat/agent/${agent.id}/edit/skills`,
      label: 'Skills',
    },
    {
      to: '/chat/agent/$agentId/edit/knowledge',
      pathname: `/chat/agent/${agent.id}/edit/knowledge`,
      label: 'Knowledge',
    },
    {
      to: '/chat/agent/$agentId/edit/workflows',
      pathname: `/chat/agent/${agent.id}/edit/workflows`,
      label: 'Workflows',
    },
  ]

  const router = useRouter()

  console.log({ pathname })

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-12 py-10 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-64">
        <div className="sticky top-10 space-y-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/chat/agents">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Agents
            </Link>
          </Button>

          <div className="flex flex-col items-center space-y-3 pt-4">
            <Avatar className="border-border h-full w-full rounded-sm border-2">
              <AvatarImage
                src={agent.image || ''}
                className="object-contain"
                alt={agent.name || 'Agent'}
              />
              <AvatarFallback className="text-xl">
                {agent.name?.charAt(0).toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
            <h2 className="mb-0 text-center text-lg font-semibold">{agent.name}</h2>
            <p className="text-muted-foreground text-center text-sm">
              {agent.description || 'Agent Description'}
            </p>
          </div>
        </div>
      </aside>

      <main className="flex flex-1 flex-col space-y-6">
        <div>
          <span className="text-muted-foreground font-medium uppercase">The brain </span>
          <h1 className="mb-4 text-3xl font-bold">{agent.name}</h1>
        </div>

        <AnimatedLinkTabs tabs={navItems} pathname={pathname} />

        <div className="rounded-md border p-6">
          <Outlet />
        </div>

        <div className="pt-6">
          <DeleteAgentDialog agent={agent} />
        </div>
      </main>
    </div>
  )
}
