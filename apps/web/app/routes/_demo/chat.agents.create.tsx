import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { AgentForm } from '@/features/agent/components/agent-form'
import { useCreateAgentMutation } from '@/features/agent/agent.query'
import { AgentFormValues } from '@/features/agent/agent.schema'
import { toast } from 'sonner'
import { ArrowLeftIcon } from 'lucide-react'
import { Button } from '@gingga/ui/components/button'

export const Route = createFileRoute('/_demo/chat/agents/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const createAgentMutation = useCreateAgentMutation()
  const navigate = useNavigate({ from: '/chat/agents/create' })

  const handleSubmit = async (values: AgentFormValues) => {
    await createAgentMutation.mutateAsync(
      { data: values },
      {
        onSuccess: () => {
          navigate({ to: '/chat/agents' })
        },
        onError: (error) => {
          toast.error('An error occurred', {
            description: error.message,
          })
        },
      },
    )
  }

  return (
    <div className="m-auto w-full max-w-2xl space-y-4 py-10">
      <Button variant="outline" size="sm" asChild>
        <Link to="/chat/agents">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Agents
        </Link>
      </Button>

      <h1 className="mb-4 text-3xl font-bold">Create Agent</h1>
      <AgentForm onSubmit={handleSubmit} isSubmitting={createAgentMutation.isPending} />
    </div>
  )
}
