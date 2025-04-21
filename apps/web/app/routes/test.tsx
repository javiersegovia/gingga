import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/test')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient, trpc } = context
    const data = await queryClient.ensureQueryData(trpc.privateData.queryOptions())
    const session = await queryClient.ensureQueryData(trpc.auth.getSession.queryOptions())
    return { data, session }
  },
})

function RouteComponent() {
  const { data, session } = Route.useLoaderData()
  return (
    <div>
      Hello &quot;/test&quot;! {data?.message} and ...
      <div>{JSON.stringify(session, null, 2)}</div>
    </div>
  )
}
