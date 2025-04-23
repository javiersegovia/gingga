import { useNavigate } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { useDeleteAgentMutation } from '~/features/agent/agent.query'

interface DeleteAgentDialogProps {
  agent: {
    id: string
    name?: string
  }
}

export function DeleteAgentDialog({ agent }: DeleteAgentDialogProps) {
  const deleteAgentMutation = useDeleteAgentMutation()
  const navigate = useNavigate()

  const handleDelete = async () => {
    await deleteAgentMutation.mutateAsync({ data: { id: agent.id } })
    navigate({ to: '/chat/agents' })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Agent</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Agent</DialogTitle>
          <DialogDescription className="pt-4">
            This action cannot be undone. Are you sure you want to delete agent
            {' '}
            {agent.name || agent.id}
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={deleteAgentMutation.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={deleteAgentMutation.isPending}
          >
            {deleteAgentMutation.isPending ? 'Deleting...' : 'Delete Agent'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
