import { createFileRoute, Link, Outlet, useRouter } from '@tanstack/react-router'
import { $getAgentById } from '@/features/agent/agent.api'
import { Button } from '@gingga/ui/components/button'
import { ArrowLeftIcon } from 'lucide-react'
import { DeleteAgentDialog } from '@/features/agent/components/delete-agent-dialog'
import { AnimatedLinkTabs } from '@/components/ui/animated-link-tabs'
import type { Tab } from '@/components/ui/animated-link-tabs'

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
    <div className="m-auto min-h-screen w-full max-w-xl space-y-6 py-10">
      <div className="mx-auto flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link to="/chat/agents">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Agents
          </Link>
        </Button>
      </div>

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
    </div>
  )
}
