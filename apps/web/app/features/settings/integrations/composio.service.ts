import {
  ComposioError,
  COMPOSIO_SDK_ERROR_CODES,
  VercelAIToolSet,
  Composio,
  ConnectorListItemDTO,
} from 'composio-core'

import { getServerEnv } from '@/server/env'
import {
  ComposioAppName,
  ComposioAppNameEnum,
  ComposioIntegration,
  INTEGRATIONS_INFO,
  UserConnection,
} from './composio.schema'

// Helper to initialize the Composio SDK
export function getVercelToolset({ entityId }: { entityId?: string }): VercelAIToolSet {
  const env = getServerEnv()
  if (!env.COMPOSIO_API_KEY) {
    console.error('COMPOSIO_API_KEY is missing from the environment.')
    throw new Error('Composio API key is not configured.')
  }
  try {
    return new VercelAIToolSet({ apiKey: env.COMPOSIO_API_KEY, entityId })
  } catch (error) {
    console.error('Failed to initialize Composio SDK:', error)
    throw new Error('Could not initialize Composio SDK.')
  }
}

// Helper to check if the user already has an active connection for a given app
async function hasActiveConnection({
  userId,
  integrationId,
  toolset,
}: {
  userId: string
  integrationId: string
  toolset: VercelAIToolSet
}): Promise<boolean> {
  try {
    const { items } = await toolset.client.connectedAccounts.list({ entityId: userId })
    return (
      items?.some(
        (conn) =>
          conn.integrationId === integrationId && conn.status?.toUpperCase() === 'ACTIVE',
      ) || false
    )
  } catch (error) {
    if (
      error instanceof ComposioError &&
      (error.errCode === COMPOSIO_SDK_ERROR_CODES.SDK.NO_CONNECTED_ACCOUNT_FOUND ||
        error.message.includes('entity not found'))
    ) {
      return false
    }
    throw error
  }
}

const formatIntegration = (integration: ConnectorListItemDTO): ComposioIntegration => ({
  ...INTEGRATIONS_INFO[integration.appName as ComposioAppName],
  integrationId: integration.id,
  appId: integration.appId,
  appName: integration.appName as ComposioAppName,
  enabled: integration.enabled,
  deleted: integration.deleted,
  logo:
    'logo' in integration && typeof integration.logo === 'string' ? integration.logo : '',
  authScheme: integration.authScheme,
})

// --- Service Functions ---

/**
 * Retrieves the static list of available Composio integrations.
 */
export async function getComposioIntegrations() {
  const composio = new Composio({ apiKey: getServerEnv().COMPOSIO_API_KEY })
  const integrations = await composio.integrations.list({
    showDisabled: true,
  })

  const filteredIntegrations = integrations.items.filter(
    (integration) =>
      ComposioAppNameEnum.options.includes(integration.appName as ComposioAppName) &&
      integration.enabled,
  )
  console.log('integrations.items[1]')
  console.log(integrations.items[1])
  console.log({ integrations: integrations.items[1]?.connections })

  return filteredIntegrations.map(formatIntegration)
}

/**
 * Retrieves a specific Composio integration config by its app name.
 */
export async function getComposioIntegrationByAppName(appName: ComposioAppName) {
  const integrations = await getComposioIntegrations()
  return integrations.find((integration) => integration.appName === appName)
}

/**
 * Retrieves all active Composio connections for a given user (entityId).
 * Maps the SDK response to the UserConnection interface.
 */
export async function getUserComposioConnections(
  userId: string,
): Promise<UserConnection[]> {
  const toolset = getVercelToolset({ entityId: userId })
  try {
    const response = await toolset.client.connectedAccounts.list({ entityId: userId })
    const sdkConnections = response?.items ?? []
    console.log(
      `[Composio Service] Found ${sdkConnections.length} connections for user ${userId}`,
    )
    return sdkConnections.map((conn) => ({
      id: conn.id,
      appName: conn.appName ?? null,
      appUniqueId: conn.appUniqueId ?? null,
      status: conn.status,
      createdAt: conn.createdAt,
      integrationId: conn.integrationId,
      logo: conn.logo,
      isDisabled: conn.isDisabled,
    }))
  } catch (error) {
    if (
      error instanceof ComposioError &&
      (error.errCode === COMPOSIO_SDK_ERROR_CODES.SDK.NO_CONNECTED_ACCOUNT_FOUND ||
        error.message.includes('entity not found'))
    ) {
      console.log(
        `[Composio Service] No entity found for user ${userId}, returning empty connections list.`,
      )
      return []
    }
    console.error(
      `[Composio Service] Error fetching connections for user ${userId}:`,
      error,
    )
    throw new Error('Failed to retrieve user connections from Composio.')
  }
}

/**
 * Initiates a new Composio connection for a user and a specific app.
 * Returns the redirect URL for the OAuth flow.
 */
export async function initiateComposioConnection({
  userId,
  integrationId,
  redirectUri,
}: {
  userId: string
  integrationId: string
  redirectUri: string
}): Promise<{ redirectUrl: string }> {
  const toolset = getVercelToolset({ entityId: userId })

  // Check for an existing active connection
  if (await hasActiveConnection({ userId, integrationId, toolset })) {
    throw new Error(
      `An active connection for ${integrationId} already exists for this user.`,
    )
  }

  try {
    console.log(
      `[Composio Service] Initiating connection for user ${userId}, integration ${integrationId}...`,
    )
    const connectionRequest = await toolset.client.connectedAccounts.initiate({
      entityId: userId,
      integrationId,
      redirectUri,
    })
    if (!connectionRequest?.redirectUrl) {
      console.error(
        `[Composio Service] No redirect URL returned for ${integrationId}.`,
        connectionRequest,
      )
      throw new Error('Composio failed to provide a redirect URL.')
    }
    console.log(
      `[Composio Service] Connection initiated for ${userId}, ${integrationId}.`,
    )
    return { redirectUrl: connectionRequest.redirectUrl }
  } catch (error) {
    console.error(
      `[Composio Service] Error initiating connection for user ${userId}, integration ${integrationId}:`,
      error,
    )
    if (error instanceof Error && error.message.includes('already exists')) {
      throw error
    }
    throw new Error(`Failed to initiate connection process for ${integrationId}.`)
  }
}

/**
 * Deletes a specific Composio connection by its ID.
 */
export async function deleteUserComposioConnection(
  connectionId: string,
): Promise<boolean> {
  // const toolset = getVercelToolset({ entityId: undefined })
  console.log(`[Composio Service] Attempting deletion of connection ${connectionId}...`)

  const composio = new Composio({ apiKey: getServerEnv().COMPOSIO_API_KEY })

  try {
    await composio.connectedAccounts.delete({ connectedAccountId: connectionId })

    console.log(`[Composio Service] Successfully deleted connection ${connectionId}.`)

    return true
  } catch (error) {
    console.error(`[Composio Service] Error deleting connection ${connectionId}:`, error)
    if (
      error instanceof ComposioError &&
      (error.errCode === COMPOSIO_SDK_ERROR_CODES.SDK.NO_CONNECTED_ACCOUNT_FOUND ||
        error.message.includes('not found'))
    ) {
      console.warn(
        `[Composio Service] Connection ${connectionId} not found during deletion attempt.`,
      )
      throw new Error(`Connection with ID ${connectionId} not found.`)
    }
    throw new Error('Failed to delete the connection from Composio.')
  }
}
