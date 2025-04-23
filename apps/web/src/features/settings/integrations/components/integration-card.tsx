import type { ComposioIntegration, UserConnection } from '../composio.schema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { $initiateComposioConnection } from '../composio.api'
import { composioQueryKeys, useDeleteUserComposioConnection } from '../composio.query'

interface IntegrationCardProps {
  integration: ComposioIntegration
  userConnection?: UserConnection
}

export function IntegrationCard({ integration, userConnection }: IntegrationCardProps) {
  const queryClient = useQueryClient()
  const initiateConnectionMutationFn = useServerFn($initiateComposioConnection)

  const { mutate: initiateConnection, isPending: isConnecting } = useMutation({
    mutationFn: initiateConnectionMutationFn,
    onSuccess: (data) => {
      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl
      }
      else {
        console.error('Composio connection initiated but no redirect URL received.')
        queryClient.invalidateQueries({ queryKey: composioQueryKeys.connections() })
      }
    },
    onError: (error) => {
      console.error('Error initiating Composio connection:', error)
    },
  })

  const { mutate: deleteConnection, isPending: isDisconnecting }
    = useDeleteUserComposioConnection()

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const handleConnect = () => {
    initiateConnection({ data: { integrationId: integration.integrationId } })
  }

  const handleConfirmDisconnect = () => {
    if (userConnection) {
      deleteConnection(
        { data: { connectionId: userConnection.id } },
        {
          onSettled: () => {
            setConfirmDialogOpen(false)
          },
        },
      )
    }
  }

  return (
    <div className="flex items-center justify-between rounded-sm border p-4 shadow">
      <div className="flex items-center">
        {integration.logo && (
          <img
            src={integration.logo}
            alt={`${integration.label} logo`}
            className="mr-3 h-10 w-10"
          />
        )}
        <div>
          <h3 className="text-lg font-bold">{integration.label}</h3>
          <p className="text-foreground/70 text-sm">{integration.description}</p>
        </div>
      </div>
      <div>
        {userConnection
          ? (
              <>
                <Button
                  variant="destructive"
                  isPending={isDisconnecting}
                  onClick={() => setConfirmDialogOpen(true)}
                >
                  {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
                </Button>

                <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Disconnect from
                        {integration.label}
                      </DialogTitle>
                      <DialogDescription className="mt-2">
                        Removing an integration will automatically remove tools from the
                        agents that require it. Are you sure you want to proceed?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        isPending={isDisconnecting}
                        onClick={handleConfirmDisconnect}
                      >
                        Remove Integration
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )
          : (
              <Button variant="primary" isPending={isConnecting} onClick={handleConnect}>
                {isConnecting ? 'Connecting...' : 'Connect'}
              </Button>
            )}
      </div>
    </div>
  )
}
