import type { N8NWorkflow } from '@gingga/db/types'
import type { ColumnDef } from '@tanstack/react-table'
import type { TRPCClientErrorLike } from '@trpc/client'
import type { TRPCAppRouter } from '~/server/trpc/routers/app.router'
import { Alert, AlertDescription, AlertTitle } from '@gingga/ui/components/alert'
import { Badge } from '@gingga/ui/components/badge'
import { Button } from '@gingga/ui/components/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@gingga/ui/components/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gingga/ui/components/select'
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { TerminalIcon } from 'lucide-react'
import { Suspense, useCallback, useState } from 'react'
import { toast } from 'sonner'
import { useTRPC } from '~/lib/trpc/react'
import { DataTable } from './_components/n8n-workflows-data-table'
import { DataTableColumnHeader } from './_components/n8n-workflows-data-table-column-header'
import { DataTableRowActions } from './_components/n8n-workflows-row-actions'

export const columns: ColumnDef<N8NWorkflow>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return <Badge variant={status === 'active' ? 'success' : 'secondary'}>{status}</Badge>
    },
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'lastSyncAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Synced" />,
    cell: ({ row }) => {
      const date = row.getValue('lastSyncAt') as Date | null
      return <div>{date ? formatDistanceToNow(new Date(date), { addSuffix: true }) : 'Never'}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]

function N8nWorkflowsAdminContent() {
  const trpc = useTRPC()
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const workflowsQuery = useSuspenseQuery(trpc.n8n.listImportedN8NWorkflows.queryOptions())
  const workflows: N8NWorkflow[] = workflowsQuery.data ?? []

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">n8n Workflows</h2>
          <p className="text-muted-foreground">
            Manage imported n8n workflows.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <ImportWorkflowDialog
            isOpen={isImportDialogOpen}
            setIsOpen={setIsImportDialogOpen}
          />
        </div>
      </div>

      {workflows.length === 0 ? (
        <Alert>
          <TerminalIcon className="h-4 w-4" />
          <AlertTitle>No Workflows Imported Yet</AlertTitle>
          <AlertDescription>
            Click the "Import Workflow" button to synchronize workflows from your n8n instance.
          </AlertDescription>
        </Alert>
      ) : (
        <DataTable data={workflows} columns={columns} />
      )}
    </div>
  )
}

export default function N8nWorkflowsAdminRoute() {
  return (
    <Suspense fallback={<N8nWorkflowsAdminSkeleton />}>
      <N8nWorkflowsAdminContent />
    </Suspense>
  )
}

function N8nWorkflowsAdminSkeleton() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex animate-pulse">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-4 w-64 bg-muted rounded mt-2" />
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-9 w-32 bg-muted rounded" />
        </div>
      </div>
      <div className="rounded-md border">
        <div className="h-10 bg-muted border-b" />
        {' '}
        {/* Table header */}
        {[...Array.from({ length: 5 })].map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i} className="h-16 bg-muted/50 border-b last:border-0" /> /* Table rows */
        ))}
      </div>
    </div>
  )
}

// --- Import Workflow Dialog Component ---

interface ImportWorkflowDialogProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

interface AvailableWorkflow {
  id: string
  name: string
}

function ImportWorkflowDialog({ isOpen, setIsOpen }: ImportWorkflowDialogProps) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null)

  const availableWorkflowsQuery = useQuery(
    trpc.n8n.listAvailableN8NWorkflows.queryOptions({}, {
      enabled: isOpen,
    }),
  )

  const importMutation = useMutation(trpc.n8n.importN8NWorkflow.mutationOptions({
    onSuccess: (data) => {
      toast.success(`Workflow "${data.name}" imported successfully!`)
      setSelectedWorkflowId(null)
      setIsOpen(false)
      void queryClient.invalidateQueries({ queryKey: trpc.n8n.listImportedN8NWorkflows.queryKey() })
    },
    onError: (error: TRPCClientErrorLike<TRPCAppRouter>) => {
      toast.error(`Failed to import workflow: ${error.message}`)
    },
  }))

  const handleImport = () => {
    if (selectedWorkflowId) {
      importMutation.mutate({ n8nWorkflowId: selectedWorkflowId })
    }
    else {
      toast.warning('Please select a workflow to import.')
    }
  }

  const availableWorkflows: AvailableWorkflow[] = availableWorkflowsQuery.data ?? []

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Import Workflow</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import n8n Workflow</DialogTitle>
          <DialogDescription>
            Select a workflow from your n8n instance to import and manage.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {availableWorkflowsQuery.isLoading && (
            <div className="text-center text-muted-foreground">Loading available workflows...</div>
          )}
          {availableWorkflowsQuery.isError && (
            <Alert variant="destructive">
              <TerminalIcon className="h-4 w-4" />
              <AlertTitle>Error Loading Workflows</AlertTitle>
              <AlertDescription>
                {availableWorkflowsQuery.error.message || 'Could not fetch workflows from n8n.'}
              </AlertDescription>
            </Alert>
          )}
          {availableWorkflowsQuery.isSuccess && (
            <>
              {availableWorkflows.length === 0 && (
                <div className="text-center text-muted-foreground">No new workflows available to import.</div>
              )}
              {availableWorkflows.length > 0 && (
                <Select
                  value={selectedWorkflowId ?? ''}
                  onValueChange={setSelectedWorkflowId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a workflow..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWorkflows.map((wf: AvailableWorkflow) => (
                      <SelectItem key={wf.id} value={wf.id}>
                        {wf.name}
                        {' '}
                        (
                        {wf.id}
                        )
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </>
          )}
        </div>
        <Button
          onClick={handleImport}
          disabled={!selectedWorkflowId || importMutation.isPending || availableWorkflowsQuery.isLoading || availableWorkflowsQuery.isError}
        >
          {importMutation.isPending ? 'Importing...' : 'Import Selected Workflow'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
