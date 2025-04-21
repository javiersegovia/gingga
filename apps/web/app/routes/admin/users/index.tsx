import { createFileRoute } from '@tanstack/react-router'
import type { UserTableEntry } from '~/features/admin/users/components/users-columns'
import { userColumns } from '~/features/admin/users/components/users-columns' // Adjust path if needed
import { UsersDataTable } from '~/features/admin/users/components/users-data-table' // Adjust path if needed
import { usersQueryOptions } from '~/features/admin/users/user.query'
import { useSuspenseQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/admin/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  // Real data fetching with TanStack Query
  const { data: apiUsers = [], isError } = useSuspenseQuery(usersQueryOptions)

  // Helper to map API response to UserTableEntry format
  const mapToUserTableEntry = (user: (typeof apiUsers)[number]): UserTableEntry => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      banned: Boolean(user.banned),
      createdAt:
        user.createdAt instanceof Date ? user.createdAt : new Date(user.createdAt),
      // Transform membershipTier to membership.tier format if needed
      membership: user.membershipTier
        ? { tier: user.membershipTier as 'basic' | 'pro' | 'enterprise' }
        : null,
      chatCount: user.chatCount ?? 0,
      messageCount: user.messageCount ?? 0,
    }
  }

  // Map API response to expected table format
  const users = apiUsers.map(mapToUserTableEntry)

  if (isError) {
    // Simple error UI - could be enhanced with a proper error component
    return (
      <div className="container mx-auto py-10">
        <h1 className="mb-4 text-2xl font-bold">User Management</h1>
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">
            Error loading users. Please try again later.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-4 text-2xl font-bold">User Management</h1>
      <UsersDataTable columns={userColumns} data={users} />
    </div>
  )
}
