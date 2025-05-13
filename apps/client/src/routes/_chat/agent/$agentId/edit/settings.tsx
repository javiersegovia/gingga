import { Button } from '@gingga/ui/components/button'
import { Dialog, DialogTrigger } from '@gingga/ui/components/dialog'
import { Skeleton } from '@gingga/ui/components/skeleton'
import { useState } from 'react'
import { useParams } from 'react-router'
import { useGetAgentByIdQuery } from '~/features/agent/agent.query'
import { DeleteAgentDialog } from '~/features/agent/components/delete-agent-dialog'

export default function AgentSettingsRoute() {
  const { agentId } = useParams<{ agentId: string }>()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { data: agent, isLoading, error } = useGetAgentByIdQuery(agentId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-32" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-600">
        Error loading agent settings:
        {' '}
        {error.message}
      </div>
    )
  }

  if (!agent) {
    return <div>Agent not found.</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Agent Settings</h2>
        <p className="text-muted-foreground">
          Manage general settings for your agent, including deletion.
        </p>
      </div>

      <div className="rounded-lg border border-destructive bg-red-50/30 p-4 dark:bg-red-950/30">
        <h3 className="font-semibold text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">
          Deleting your agent is a permanent action and cannot be undone.
        </p>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="mt-4">
              Delete Agent
            </Button>
          </DialogTrigger>
          {/* Render DialogContent conditionally or always pass agent */}
          {agent && (
            <DeleteAgentDialog
              agent={{ id: agent.id, name: agent.name }}
              closeDialog={() => setIsDeleteDialogOpen(false)}
            />
          )}
        </Dialog>
      </div>
    </div>
  )
}
