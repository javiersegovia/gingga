import type { Row } from '@tanstack/react-table'
import type { UserTableEntry } from './users-columns'
import { Button } from '@gingga/ui/components/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@gingga/ui/components/dropdown-menu'
import { useRouter } from '@tanstack/react-router'
import {
  BanIcon,
  ClipboardCopyIcon,
  EyeIcon,
  MoreHorizontalIcon,
  TrashIcon,
  UserCheckIcon,
} from 'lucide-react'
import { toast } from 'sonner'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function UsersDataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter()
  // const task = taskSchema.parse(row.original) // We can parse data using a Zod schema here
  // We will get the user data directly, assuming TData matches UserTableEntry structure
  const user = row.original as UserTableEntry // Use the imported type

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(user.email)
    // Optionally add a toast notification here
    toast.success('Email copied to clipboard')
  }

  const handleViewUser = () => {
    router.navigate({ to: `/admin/users/${user.id}` })
  }

  const handleBanUser = () => {
    // Implement ban logic (e.g., API call)
    // console.log('Ban user:', user.id)
    toast.error('User ban functionality not implemented yet.')
  }

  const handleUnbanUser = () => {
    // Implement unban logic
    // console.log('Unban user:', user.id)
    toast.error('User unban functionality not implemented yet.')
  }

  const handleDeleteUser = () => {
    // Implement delete logic (confirmation recommended)
    // console.log('Delete user:', user.id)
    toast.error('User delete functionality not implemented yet.')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="data-[state=open]:bg-muted flex size-8 p-0">
          <MoreHorizontalIcon className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={handleViewUser}>
          <EyeIcon className="mr-2 size-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyEmail}>
          <ClipboardCopyIcon className="mr-2 size-4" />
          Copy email
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {user.banned
          ? (
              <DropdownMenuItem onClick={handleUnbanUser}>
                <UserCheckIcon className="mr-2 size-4" />
                Unban
              </DropdownMenuItem>
            )
          : (
              <DropdownMenuItem onClick={handleBanUser}>
                <BanIcon className="mr-2 size-4" />
                Ban user
              </DropdownMenuItem>
            )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDeleteUser} className="text-destructive">
          <TrashIcon className="mr-2 size-4" />
          Delete
          {/* <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
