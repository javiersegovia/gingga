import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  // In a real app, you'd fetch data here using TanStack Query or similar
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-4 text-2xl font-bold">Let&apos;s Gingga - Admin</h1>
    </div>
  )
}
