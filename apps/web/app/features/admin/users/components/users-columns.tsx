import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@gingga/ui/components/badge'

import { UsersDataTableColumnHeader } from './users-data-table-column-header'
import { UsersDataTableRowActions } from './users-data-table-row-actions'

// Define the structure for the table row data
// Combining relevant fields from Users and UserMemberships
export interface UserTableEntry {
  id: string
  name: string | null
  email: string
  role: 'user' | 'admin'
  banned: boolean
  createdAt: Date | null
  membership: {
    tier: 'basic' | 'pro' | 'enterprise'
  } | null
  chatCount: number
  messageCount: number
}

export const userColumns: ColumnDef<UserTableEntry>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <UsersDataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue('name') ?? '-'}</div>,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <UsersDataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <UsersDataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => {
      const role = row.getValue('role') as string
      const variant = role === 'admin' ? 'default' : 'secondary'
      return <Badge variant={variant}>{role}</Badge>
    },
    filterFn: (row, id, value: unknown) => {
      if (Array.isArray(value)) {
        return value.includes(row.getValue(id))
      }
      return false
    },
  },
  {
    accessorKey: 'membership.tier',
    id: 'tier',
    header: ({ column }) => <UsersDataTableColumnHeader column={column} title="Tier" />,
    cell: ({ row }) => {
      const tier = row.original.membership?.tier
      if (!tier)
        return <span className="text-muted-foreground">-</span>
      const variant
        = tier === 'enterprise'
          ? 'destructive' // Example: maybe make enterprise stand out
          : tier === 'pro'
            ? 'default'
            : 'outline'
      return <Badge variant={variant}>{tier}</Badge>
    },
    filterFn: (row, _id, value: unknown) => {
      const rowValue = row.original.membership?.tier
      if (Array.isArray(value)) {
        return value.includes(rowValue)
      }
      return false
    },
  },
  {
    accessorKey: 'chatCount',
    header: ({ column }) => <UsersDataTableColumnHeader column={column} title="Chats" />,
    cell: ({ row }) => <div className="text-center">{row.getValue('chatCount')}</div>,
  },
  {
    accessorKey: 'messageCount',
    header: ({ column }) => (
      <UsersDataTableColumnHeader column={column} title="Messages" />
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('messageCount')}</div>,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <UsersDataTableColumnHeader column={column} title="Joined" />,
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date | null
      if (!date)
        return '-'
      return (
        <span className="whitespace-nowrap">
          {new Intl.DateTimeFormat('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }).format(date)}
        </span>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <UsersDataTableRowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
]
