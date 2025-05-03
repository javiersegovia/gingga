// Placeholder for DataTableToolbar
import type { Table } from '@tanstack/react-table'
import { Button } from '@gingga/ui/components/button'
import { Input } from '@gingga/ui/components/input'
import { CrosshairIcon } from 'lucide-react'
import { DataTableViewOptions } from './n8n-workflows-data-table-view-options'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  // TODO: Implement Import Workflow functionality (dialog opening)
  const handleImportWorkflow = () => {
    // Future: openImportWorkflowDialog()
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter workflows..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('name')?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* TODO: Add status/tag filters if needed based on columns */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <CrosshairIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={handleImportWorkflow}
        >
          Import Workflow
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
