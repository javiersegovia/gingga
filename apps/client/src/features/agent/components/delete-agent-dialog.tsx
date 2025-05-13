import type { Agent } from '@gingga/db/types'
import { Button } from '@gingga/ui/components/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@gingga/ui/components/dialog'
import { useNavigate } from 'react-router'
import { DASHBOARD_INDEX_PATH } from '~/routes'
import { useDeleteAgentMutation } from '../agent.query'

export function DeleteAgentDialog({
  agent,
  closeDialog,
}: {
  agent: Pick<Agent, 'id' | 'name'>
  closeDialog: () => void
}) {
  const { mutateAsync, isPending } = useDeleteAgentMutation()
  const navigate = useNavigate()

  const handleDelete = async () => {
    try {
      await mutateAsync({ id: agent.id })
      await navigate(DASHBOARD_INDEX_PATH)
    }
    catch (error) {
      console.error('Failed to delete agent:', error)
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Agent</DialogTitle>
        <DialogDescription className="pt-4">
          This action cannot be undone. Are you sure you want to permanently delete this
          agent? All associated data (chats, leads, etc.) may also be affected or
          deleted.
          <span className="mt-4 block rounded-md border border-dashed border-red-500 p-2 text-red-500/70 dark:border-red-500">
            {agent.name}
          </span>
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="ghost" disabled={isPending} onClick={closeDialog}>
            Cancel
          </Button>
        </DialogClose>
        <Button
          onClick={handleDelete}
          variant="destructive"
          disabled={isPending}
        >
          {isPending ? 'Deleting...' : 'Delete Agent'}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
