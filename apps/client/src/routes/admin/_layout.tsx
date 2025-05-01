import type { Route } from './+types/_layout'
import { SidebarProvider } from '@gingga/ui/components/sidebar'
import { Suspense } from 'react'
import { Outlet } from 'react-router'
import { AdminSidebar } from '~/features/admin/components/sidebar/admin-sidebar'
import { adminMiddleware } from '~/middleware/auth.middleware'

export const unstable_middleware = [adminMiddleware]

export async function loader() {
  return { isSidebarOpened: true }
}

export default function AdminLayout({ loaderData }: Route.ComponentProps) {
  return (
    <SidebarProvider defaultOpen={loaderData.isSidebarOpened}>
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
