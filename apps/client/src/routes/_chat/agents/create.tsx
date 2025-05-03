import type { AgentFormValues } from '~/features/agent/agent.schema'
import { Button } from '@gingga/ui/components/button'
import { ArrowLeftIcon } from 'lucide-react'
import { href, Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { useCreateAgentMutation } from '~/features/agent/agent.query'
import { AgentForm } from '~/features/agent/components/agent-form'

export default function RouteComponent() {
  const createAgentMutation = useCreateAgentMutation()
  const navigate = useNavigate()

  const handleSubmit = async (values: AgentFormValues) => {
    await createAgentMutation.mutateAsync(
      values,
      {
        onSuccess: () => {
          void navigate(href('/agents'))
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
        <Link to={href('/agents')}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Agents
        </Link>
      </Button>

      <h1 className="mb-4 text-3xl font-bold">Create Agent</h1>
      <AgentForm onSubmit={handleSubmit} isSubmitting={createAgentMutation.isPending} />
    </div>
  )
}
