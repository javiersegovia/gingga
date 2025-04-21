import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_demo/chat/agent/$agentId/edit/knowledge/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Knowledge</h2>
      <p className="text-muted-foreground">
        Connect knowledge sources like documents, websites, or databases to enhance your
        agent&apos;s responses.
      </p>
      {/* Placeholder for Knowledge UI */}
      <div className="rounded-md border border-dashed p-6 text-center">
        <p>Knowledge Base Configuration (Coming Soon)</p>
      </div>
    </div>
  )
}
