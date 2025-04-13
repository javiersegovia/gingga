import { createFileRoute, Link } from '@tanstack/react-router'
import { Badge } from '@gingga/ui/components/badge'
import { Button } from '@gingga/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gingga/ui/components/card'
import { GridPattern } from '@gingga/ui/components/grid-pattern'
import { DotPattern } from '@gingga/ui/components/dot-pattern'
import {
  LockIcon,
  MessageSquareTextIcon,
  ArrowRightIcon,
  BotIcon,
  EditIcon,
} from 'lucide-react'
import { cn } from '@gingga/ui/lib/utils'
import { Agent } from '@/features/agent/agent.types'
import { agentsQueryOptions } from '@/features/agent/agent.query'
import { useAuthQuery } from '@/features/auth/auth.query'
import { Skeleton } from '@gingga/ui/components/skeleton'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'

export const Route = createFileRoute('/_demo/chat/agents/')({
  component: AgentsExploreComponent,
})

function AgentGridLoadingSkeleton() {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-[300px] w-full rounded-lg" /> // Adjusted height
      ))}
    </div>
  )
}

// Component containing the data-dependent parts
function AgentGridSection() {
  const { data: agentsData } = useSuspenseQuery(agentsQueryOptions())
  const { data: authSession } = useAuthQuery()

  const agents = agentsData?.agents ?? []
  const isEmpty = agents.length === 0

  // Admin button that will be shown regardless of empty state
  const AdminCreateButton = authSession.isAuthenticated &&
    authSession.user.role === 'admin' && (
      <Button asChild size="md" className="absolute top-0 right-0 -translate-y-1/2">
        <Link to="/chat/agents/create">
          <BotIcon className="mr-2 h-4 w-4" />
          Create Agent
        </Link>
      </Button>
    )

  if (isEmpty) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">{AdminCreateButton}</div>

        <div className="flex min-h-[50vh] items-center justify-center">
          <Card hover="noShadow" design="grid" className="w-full max-w-xs">
            <CardHeader>
              <CardTitle className="text-center">No agents found... yet</CardTitle>
              <CardDescription className="text-center">
                <Button asChild size="xl" variant="secondary" className="mt-4">
                  <Link to="/chat">
                    <BotIcon className="mr-2 h-4 w-4" />
                    Chat with Gingga
                  </Link>
                </Button>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative flex items-center gap-2">
        <h2 className="line-stroke text-primary text-4xl font-semibold">Agents</h2>
        {AdminCreateButton}
      </div>
      <p className="text-muted-foreground max-w-3xl text-lg">
        Personalized agents available for general use.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent: Agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            isAdmin={authSession.isAuthenticated && authSession.user.role === 'admin'}
          />
        ))}
      </div>
    </div>
  )
}

function AgentsExploreComponent() {
  // Remove data fetching hooks from here

  return (
    <div className="relative w-full flex-1 py-8">
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        strokeDasharray={'4 2'}
        className="absolute inset-0 h-full w-full [mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
      />

      <div className="container-marketing relative z-10 mx-auto">
        <div className="space-y-8">
          {/* Wrap the dynamic section in Suspense */}
          <Suspense fallback={<AgentGridLoadingSkeleton />}>
            <AgentGridSection />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function AgentCard({ agent, isAdmin }: { agent: Agent; isAdmin?: boolean }) {
  return (
    <Card hover="noShadow" className={cn('flex flex-col overflow-hidden transition-all')}>
      <div className="relative">
        {agent.image && (
          <div className={cn('h-80 w-full')}>
            <img
              src={agent.image}
              alt={agent.name}
              className="mx-auto h-full w-full object-cover object-top"
            />
          </div>
        )}

        {!agent.image && (
          <div
            className={cn('rounded-t-base flex h-32 w-full items-center justify-center')}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full">
              <BotIcon className="text-foreground h-8 w-8" />
            </div>
          </div>
        )}

        {isAdmin && (
          <Button
            size="icon"
            variant="default"
            hover="noShadow"
            className="absolute top-2 right-2 h-8 w-8 rounded-full p-0"
            asChild
          >
            <Link to="/chat/agent/$agentId/edit" params={{ agentId: agent.id }}>
              <EditIcon className="h-4 w-4" />
              <span className="sr-only">Edit agent</span>
            </Link>
          </Button>
        )}
      </div>

      <CardHeader className={cn('my-0 space-y-1 pb-0')}>
        <div className="flex flex-col space-y-1">
          <CardTitle className={cn('font-title mt-4 text-center text-xl font-bold')}>
            {agent.name}
          </CardTitle>

          {agent.title && (
            <p className="text-muted-foreground text-sm font-semibold">{agent.title}</p>
          )}
        </div>
        <CardDescription className="text-center text-sm">
          {agent.description || 'No description available.'}
        </CardDescription>
      </CardHeader>

      <CardFooter className="m-0 mt-auto flex w-full flex-col px-4 py-4">
        <Button
          size="default"
          variant="secondary"
          hover="noShadow"
          className={cn('mx-auto mt-4 w-auto gap-2')}
          asChild
        >
          <Link to="/chat/agent/$agentId" params={{ agentId: agent.id }}>
            <MessageSquareTextIcon className="h-4 w-4" />
            Chat Now
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
