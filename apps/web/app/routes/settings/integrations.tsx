import { Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gingga/ui/components/card'
import {
  $getComposioIntegrations,
  $getUserComposioConnections,
} from '@/features/settings/integrations/composio.api'
import { IntegrationCard } from '@/features/settings/integrations/components/integration-card'
import {
  composioQueryKeys,
  composioIntegrationsQueryOptions,
  userComposioConnectionsQueryOptions,
} from '@/features/settings/integrations/composio.query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { PlugZapIcon } from 'lucide-react'

export const Route = createFileRoute('/settings/integrations')({
  component: IntegrationsSettingsComponent,
  loader: async ({ context }) => {
    context.queryClient.prefetchQuery({
      queryKey: composioQueryKeys.integrations(),
      queryFn: $getComposioIntegrations,
    })
    context.queryClient.prefetchQuery({
      queryKey: composioQueryKeys.connections(),
      queryFn: $getUserComposioConnections,
    })
    return null
  },
})

// New component to list integrations using hooks and render IntegrationCard
function IntegrationList() {
  const { data: integrations } = useSuspenseQuery(composioIntegrationsQueryOptions)
  const { data: userConnectionsData } = useSuspenseQuery(
    userComposioConnectionsQueryOptions,
  )
  const connections = userConnectionsData || []

  if (!integrations || !userConnectionsData) {
    return (
      <div className="border-border flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed p-8 text-center">
        <PlugZapIcon className="text-muted-foreground h-12 w-12" />
        <p className="text-muted-foreground">
          Integration options will be available here soon.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {integrations.map((integration) => {
        const connection = connections.find(
          (c: (typeof connections)[number]) => c.appName === integration.appName,
        )
        return (
          <IntegrationCard
            key={integration.appName}
            integration={integration}
            userConnection={connection}
          />
        )
      })}
    </div>
  )
}

function IntegrationsSettingsComponent() {
  return (
    <div className="space-y-6">
      <Card design="grid">
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>
            Connect Gingga with other applications and services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading integrations...</div>}>
            <IntegrationList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
