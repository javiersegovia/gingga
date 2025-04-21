import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { AdminSidebar } from '~/features/admin/components/sidebar/admin-sidebar'
import { SidebarProvider } from '@gingga/ui/components/sidebar'
import { Suspense } from 'react'
import { $isSidebarOpened } from '~/features/sidebar/sidebar.api'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/identify' })
    }
    if (context.auth.user.role !== 'admin') {
      throw redirect({ to: '/chat' })
    }
  },
  loader: async () => {
    return { isSidebarOpened: await $isSidebarOpened() }
  },
})

function AdminLayout() {
  const { isSidebarOpened } = Route.useLoaderData()
  return (
    <SidebarProvider defaultOpen={isSidebarOpened}>
      <Suspense>
        <AdminSidebar />
      </Suspense>

      <main className="flex flex-1 flex-col overflow-y-auto">
        <div className="mx-auto flex w-full flex-1 flex-col">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}
