import * as React from 'react'
import { useRouter } from '@tanstack/react-router'
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  Row,
} from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Input } from '@gingga/ui/components/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@gingga/ui/components/table'
import { UsersDataTablePagination } from './users-data-table-pagination'
import { UsersDataTableViewOptions } from './users-data-table-view-options'
import { cn } from '@gingga/ui/lib/utils'
import type { UserTableEntry } from './users-columns' // Import type

interface UsersDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function UsersDataTable<TData, TValue>({
  columns,
  data,
}: UsersDataTableProps<TData, TValue>) {
  const router = useRouter()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({}) // Manage column visibility
  const [rowSelection, setRowSelection] = React.useState({}) // Manage row selection if checkboxes are added back

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Enable pagination
    onSortingChange: setSorting, // Enable sorting
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters, // Enable filtering
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility, // Enable column visibility changes
    onRowSelectionChange: setRowSelection, // Enable row selection changes
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10, // Default page size
      },
    },
  })

  const handleRowClick = (row: Row<TData>) => {
    const user = row.original as UserTableEntry // Cast to known type
    router.navigate({ to: `/admin/users/${user.id}` })
  }

  return (
    <div className="space-y-4">
      {/* Filtering and View Options */}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter by email..."
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('email')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <UsersDataTableViewOptions table={table} />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const user = row.original as UserTableEntry // Get user data for styling
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={() => handleRowClick(row)}
                    className={cn(
                      'cursor-pointer',
                      user.banned && 'opacity-50 hover:opacity-70', // Add visual indicator for banned users
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <UsersDataTablePagination table={table} />
    </div>
  )
}
