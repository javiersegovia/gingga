import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gingga/ui/components/card'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { PlugZapIcon } from 'lucide-react'
import { Suspense } from 'react'
import { IntegrationCard } from '~/features/settings/integrations/components/integration-card'
import {
  composioIntegrationsQueryOptions,
  userComposioConnectionsQueryOptions,
} from '~/features/settings/integrations/composio.query'

export const Route = createFileRoute('/settings/integrations')({
  component: IntegrationsSettingsComponent,
  loader: async ({ context }) => {
    context.queryClient.prefetchQuery(composioIntegrationsQueryOptions)
    context.queryClient.prefetchQuery(userComposioConnectionsQueryOptions)
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
