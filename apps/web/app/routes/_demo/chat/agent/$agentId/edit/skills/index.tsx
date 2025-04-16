import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_demo/chat/agent/$agentId/edit/skills/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello /_demo/chat/agent/$agentId_/edit/skills!</div>
}
