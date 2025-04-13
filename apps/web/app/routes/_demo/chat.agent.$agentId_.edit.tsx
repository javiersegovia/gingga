import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { AgentForm } from '@/features/agent/components/agent-form'
import { $getAgentById } from '@/features/agent/agent.api'
import { useUpdateAgentMutation } from '@/features/agent/agent.query'
import type { AgentFormValues } from '@/features/agent/agent.schema'
import { Button } from '@gingga/ui/components/button'
import { ArrowLeftIcon } from 'lucide-react'
import { DeleteAgentDialog } from '@/features/agent/components/delete-agent-dialog'

export const Route = createFileRoute('/_demo/chat/agent/$agentId_/edit')({
  loader: async ({ params }) => {
    const agent = await $getAgentById({ data: { id: params.agentId } })
    return { agent }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { agent } = Route.useLoaderData()
  const updateAgentMutation = useUpdateAgentMutation()
  const navigate = useNavigate()

  const handleSubmit = async (values: AgentFormValues) => {
    await updateAgentMutation.mutateAsync({ data: { ...values, id: agent.id } })
    await navigate({ to: '/chat/agents' })
  }

  return (
    <div className="m-auto w-full max-w-2xl space-y-4 py-10">
      <Button variant="outline" size="sm" asChild>
        <Link to="/chat/agents">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Agents
        </Link>
      </Button>

      <h1 className="mb-4 text-3xl font-bold">Edit Agent</h1>
      <AgentForm
        initialValues={agent}
        onSubmit={handleSubmit}
        isSubmitting={updateAgentMutation.isPending}
      />

      <div className="pt-6">
        <DeleteAgentDialog agent={agent} />
      </div>
    </div>
  )
}
