import type { Route } from './+types/_layout'
import type { Tab } from '~/components/ui/animated-link-tabs'
import { getAgentById } from '@gingga/api/features/agent/agent.service'
import { Avatar, AvatarFallback, AvatarImage } from '@gingga/ui/components/avatar'
import { Button } from '@gingga/ui/components/button'
import {
  ArrowLeftIcon,
  BookIcon,
  BrainIcon,
  LightbulbIcon,
  WorkflowIcon,
} from 'lucide-react'
import { href, Link, Outlet, redirect } from 'react-router'
import { AnimatedLinkTabs } from '~/components/ui/animated-link-tabs'

export async function loader({ request, params }: Route.LoaderArgs) {
  const pathname = new URL(request.url).pathname
  if (!params.agentId) {
    return redirect(href('/chat/agents'), 302)
  }

  const agent = await getAgentById(params.agentId)

  if (!agent) {
    return redirect(href('/chat/agents'), 302)
  }

  return { agent, pathname }
}

export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  const { agent, pathname } = loaderData
  // const { data: skillOptions } = useSuspenseQuery(skillOptionsQueryOptions)

  const navItems: Tab[] = [
    {
      to: href(`/chat/agent/:agentId/edit/instructions`, { agentId: agent.id }),
      pathname: href(`/chat/agent/:agentId/edit/instructions`, { agentId: agent.id }),
      label: 'Instructions',
      icon: <BrainIcon className="h-4 w-4" />,
    },
    {
      to: href(`/chat/agent/:agentId/edit/skills`, { agentId: agent.id }),
      pathname: href(`/chat/agent/:agentId/edit/skills`, { agentId: agent.id }),
      label: 'Skills',
      icon: <LightbulbIcon className="h-4 w-4" />,
    },
    {
      to: href(`/chat/agent/:agentId/edit/knowledge`, { agentId: agent.id }),
      pathname: href(`/chat/agent/:agentId/edit/knowledge`, { agentId: agent.id }),
      label: 'Knowledge',
      icon: <BookIcon className="h-4 w-4" />,
    },
    {
      to: href(`/chat/agent/:agentId/edit/workflows`, { agentId: agent.id }),
      pathname: href(`/chat/agent/:agentId/edit/workflows`, { agentId: agent.id }),
      label: 'Workflows',
      icon: <WorkflowIcon className="h-4 w-4" />,
    },
  ]

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-4 py-10 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-64">
        <div className="sticky top-10 space-y-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/chat/agents">
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

              {/* <h4 className="font-title mt-4 text-xs uppercase">Skills</h4>
              {agent.agentSkills.length > 0
                ? (
                    <ul className="mt-2 flex flex-col items-start justify-start gap-2 text-xs">
                      {agent.agentSkills.map((skill) => {
                        const skillOption = skillOptions?.find(
                          opt => opt.id === skill.skillId,
                        )
                        const displayName = skill.name || skillOption?.name || skill.skillId
                        return (
                          <li
                            key={skill.id}
                            className="flex items-center gap-2 rounded-md border px-4 py-2"
                          >
                            <div
                              className={cn(
                                'h-2 w-2 rounded-full',
                                skill.isEnabled ? 'bg-green-500' : 'bg-red-500',
                              )}
                            />
                            <span className="inline-block">{displayName}</span>
                          </li>
                        )
                      })}
                    </ul>
                  )
                : (
                    <p className="text-muted-foreground text-sm">No skills added yet.</p>
                  )} */}
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
