import type { N8NWorkflows } from '@gingga/db/schema'
import type { Row } from '@tanstack/react-table'
import type { TRPCClientErrorLike } from '@trpc/client'
import type { TRPCAppRouter } from '~/server/trpc/routers/app.router'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@gingga/ui/components/alert-dialog'
import { Button } from '@gingga/ui/components/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@gingga/ui/components/dropdown-menu'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MoreHorizontalIcon, RefreshCcwIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { href, Link } from 'react-router'
import { toast } from 'sonner'
import { useTRPC } from '~/lib/trpc/react'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData extends typeof N8NWorkflows.$inferSelect>({ row }: DataTableRowActionsProps<TData>) {
  const workflow = row.original
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const synchronizeMutation = useMutation(trpc.n8n.synchronizeN8NWorkflow.mutationOptions({
    onSuccess: () => {
      toast.success(`Workflow "${workflow.name}" synchronized successfully.`)
      void queryClient.invalidateQueries({ queryKey: trpc.n8n.listImportedN8NWorkflows.queryKey() })
    },
    onError: (error: TRPCClientErrorLike<TRPCAppRouter>) => {
      toast.error(`Synchronization failed: ${error.message}`)
    },
  }))

  const deleteMutation = useMutation(trpc.n8n.deleteN8NWorkflowById.mutationOptions({
    onSuccess: () => {
      toast.success(`Workflow "${workflow.name}" deleted successfully.`)
      void queryClient.invalidateQueries({ queryKey: trpc.n8n.listImportedN8NWorkflows.queryKey() })
      setIsDeleteDialogOpen(false)
    },
    onError: (error: TRPCClientErrorLike<TRPCAppRouter>) => {
      toast.error(`Deletion failed: ${error.message}`)
    },
  }))

  const handleSync = () => {
    synchronizeMutation.mutate({ id: workflow.id })
  }

  const handleDelete = () => {
    deleteMutation.mutate({ id: workflow.id })
  }

  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <MoreHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem asChild>
            <Link to={href('/admin/n8n-workflows/:workflowId', { workflowId: workflow.id })}>
              View/Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSync} disabled={synchronizeMutation.isPending}>
            <RefreshCcwIcon className="mr-2 h-4 w-4" />
            {synchronizeMutation.isPending ? 'Syncing...' : 'Synchronize'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-red-600" onSelect={(e: Event) => e.preventDefault()}>
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Delete Confirmation Dialog */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the workflow
            reference from Gingga, but will **not** delete the workflow from your n8n instance.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending} className="bg-red-600 hover:bg-red-700">
            {deleteMutation.isPending ? 'Deleting...' : 'Yes, delete workflow'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
