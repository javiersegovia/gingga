import type {
  ComposioAppName,
  ComposioIntegration,
  UserConnection,
} from './composio.schema'

import {
  COMPOSIO_SDK_ERROR_CODES,
  ComposioError,
  VercelAIToolSet,
} from 'composio-core'
import { apiEnv } from '~/api-env'
import { ComposioAppNameEnum } from './composio.schema'

// Helper to initialize the Composio SDK
export function getVercelToolset({ entityId }: { entityId?: string | null }): VercelAIToolSet {
  try {
    return new VercelAIToolSet({ apiKey: apiEnv.COMPOSIO_API_KEY, entityId: entityId ?? undefined })
  }
  catch (_error) {
    // console.error('Failed to initialize Composio SDK:', _error)
    throw new Error('Could not initialize Composio SDK.')
  }
}

function getIntegrationsInfo(): Record<
  ComposioAppName,
  Pick<
    ComposioIntegration,
    'label' | 'description' | 'appName' | 'integrationId' | 'image'
  >
> {
  return {
    googlesheets: {
      label: 'Google Sheets',
      appName: 'googlesheets',
      description: 'Agents will be able to read, write, and manage your spreadsheets.',
      integrationId: apiEnv.COMPOSIO_GOOGLESHEETS_INTEGRATION_ID,
      image: '',
    },
    googlecalendar: {
      label: 'Google Calendar',
      appName: 'googlecalendar',
      description:
        'Agents will be able to schedule events, set reminders, and manage your calendar.',
      integrationId: apiEnv.COMPOSIO_GOOGLECALENDAR_INTEGRATION_ID,
      image: '',
    },
    gmail: {
      label: 'Gmail',
      appName: 'gmail',
      description: 'Agents will be able to send, receive, and manage your emails.',
      integrationId: apiEnv.COMPOSIO_GMAIL_INTEGRATION_ID,
      image: '',
    },
    googledocs: {
      label: 'Google Docs',
      appName: 'googledocs',
      description: 'Agents will be able to create, edit, and manage your documents.',
      integrationId: apiEnv.COMPOSIO_GOOGLEDOCS_INTEGRATION_ID,
      image: '',
    },
  }
}

/**
 * Retrieves the list of available Composio integrations directly from their Server.
 */
export async function getComposioIntegrations() {
  const toolset = getVercelToolset({ entityId: undefined })
  const composioIntegrations = await toolset.client.integrations.list({
    showDisabled: true,
  })

  const filteredIntegrations = composioIntegrations.items.filter(integration =>
    ComposioAppNameEnum.options.includes(integration.appName as ComposioAppName),
  )

  const integrations = getIntegrationsInfo()

  return filteredIntegrations.map(
    ({ appName, appId, enabled, deleted, authScheme, ...otherProps }) => {
      const { label, description, integrationId, image }
        = integrations[appName as ComposioAppName]

      return {
        label,
        description,
        integrationId,
        appId,
        appName: appName as ComposioAppName,
        enabled,
        deleted,
        authScheme,
        image,
        logo:
          'logo' in otherProps && typeof otherProps.logo === 'string'
            ? otherProps.logo
            : '',
      }
    },
  )
}

/**
 * Retrieves a specific Composio integration config by its app name.
 */
export async function getComposioIntegrationByAppName(appName: ComposioAppName) {
  const integrations = await getComposioIntegrations()
  return integrations.find(integration => integration.appName === appName)
}

/**
 * Retrieves all active Composio connections for a given user (entityId).
 * Maps the SDK response to the UserConnection interface.
 * The userId is now obtained from the context within the router procedure.
 */
export async function getUserComposioConnections(
  userId: string,
): Promise<UserConnection[]> {
  const toolset = getVercelToolset({ entityId: userId })
  try {
    const response = await toolset.client.connectedAccounts.list({ entityId: userId })
    const sdkConnections = response?.items ?? []
    // console.log(
    //   `[Composio Service] Found ${sdkConnections.length} connections for user ${userId}`,
    // )
    return sdkConnections.map(conn => ({
      id: conn.id,
      appName: conn.appName as ComposioAppName | null,
      appUniqueId: conn.appUniqueId ?? null,
      status: conn.status,
      createdAt: conn.createdAt,
      integrationId: conn.integrationId,
      logo: conn.logo,
      isDisabled: conn.isDisabled,

      deleted: conn.deleted,
      enabled: conn.enabled,
    }))
  }
  catch (error) {
    if (
      error instanceof ComposioError
      && (error.errCode === COMPOSIO_SDK_ERROR_CODES.SDK.NO_CONNECTED_ACCOUNT_FOUND
        || error.message.includes('entity not found'))
    ) {
      // console.log(
      //   `[Composio Service] No entity found for user ${userId}, returning empty connections list.`,
      // )
      return []
    }
    // console.error(
    //   `[Composio Service] Error fetching connections for user ${userId}:`,
    //   error,
    // )
    throw new Error('Failed to retrieve user connections from Composio.')
  }
}

/**
 * Initiates a new Composio connection for a user and a specific app.
 * Returns the redirect URL for the OAuth flow.
 * userId is passed from the router context.
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

  try {
    const connectionRequest = await toolset.client.connectedAccounts.initiate({
      entityId: userId,
      integrationId,
      redirectUri,
    })
    if (!connectionRequest?.redirectUrl) {
      // console.error(
      //   `[Composio Service] No redirect URL returned for ${integrationId}.`,
      //   connectionRequest,
      // )
      throw new Error('Composio failed to provide a redirect URL.')
    }
    // console.log(
    //   `[Composio Service] Connection initiated for ${userId}, ${integrationId}.`,
    // )
    return { redirectUrl: connectionRequest.redirectUrl }
  }
  catch (error) {
    if (error instanceof ComposioError) {
      throw new TypeError(
        `Composio error: ${error.message} (Code: ${error.errCode})`,
      )
    }
    throw new Error('Failed to initiate connection with Composio.')
  }
}

/**
 * Deletes a Composio connection by its ID.
 * Does not require userId as connectionId is globally unique (within Composio).
 */
export async function deleteUserComposioConnection(
  connectionId: string,
): Promise<boolean> {
  const toolset = getVercelToolset({ entityId: undefined })

  try {
    await toolset.client.connectedAccounts.delete({
      connectedAccountId: connectionId,
    })
    return true
  }
  catch (error) {
    if (
      error instanceof ComposioError
      && (error.errCode === COMPOSIO_SDK_ERROR_CODES.SDK.NO_CONNECTED_ACCOUNT_FOUND
        || error.message.includes('not found'))
    ) {
      throw new Error('Connection not found.')
    }
    throw new Error('Failed to delete connection.')
  }
}
