import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_home')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Outlet />
    </div>
  )
}
