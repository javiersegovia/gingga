import { z } from 'zod'

// Define allowed app names (exclude 'googledrive' if not active)
// export type ComposioAppName = 'googlesheets' | 'googlecalendar' | 'gmail'
export const ComposioAppNames = [
  'googlesheets',
  'googlecalendar',
  'gmail',
  'googledocs',
] as const
export const ComposioAppNameEnum = z.enum(ComposioAppNames)
export type ComposioAppName = z.infer<typeof ComposioAppNameEnum>

// Integration details used by our UI
export interface ComposioIntegration {
  label: string
  appName: ComposioAppName
  description: string
  authScheme: string
  integrationId: string
  appId: string
  logo?: string
  enabled?: boolean
  deleted?: boolean
}

// Flattened type for connection information returned to our API/UI
export interface UserConnection {
  id: string
  appName: string | null
  status: string
  createdAt: string
}

/** Here we add static information about the integrations */
export const INTEGRATIONS_INFO: Record<
  ComposioAppName,
  Pick<ComposioIntegration, 'label' | 'description' | 'appName'>
> = {
  googlesheets: {
    label: 'Google Sheets',
    appName: 'googlesheets',
    description: 'Agents will be able to read, write, and manage your spreadsheets.',
    integrationId: process.env.COMPOSIO_GOOGLESHEETS_INTEGRATION_ID,
  },
  googlecalendar: {
    label: 'Google Calendar',
    appName: 'googlecalendar',
    description:
      'Agents will be able to schedule events, set reminders, and manage your calendar.',
    integrationId: process.env.COMPOSIO_GOOGLECALENDAR_INTEGRATION_ID,
  },
  gmail: {
    label: 'Gmail',
    appName: 'gmail',
    description: 'Agents will be able to send, receive, and manage your emails.',
    integrationId: process.env.COMPOSIO_GMAIL_INTEGRATION_ID,
  },
  googledocs: {
    label: 'Google Docs',
    appName: 'googledocs',
    description: 'Agents will be able to create, edit, and manage your documents.',
    integrationId: process.env.COMPOSIO_GOOGLEDOCS_INTEGRATION_ID,
  },
}

/**
 * Schema for initiating a new connection.
 * Requires the `appName` to specify which integration to connect to.
 */
export const InitiateConnectionSchema = z.object({
  integrationId: z.string().min(1, 'Integration ID cannot be empty'),
})

/**
 * Schema for deleting an existing connection.
 * Requires the `connectionId` of the connection to be deleted.
 */
export const DeleteConnectionSchema = z.object({
  connectionId: z.string().min(1, 'Connection ID cannot be empty'),
})

/**
 * Schema for retrieving details of a specific integration.
 * Requires the `appName` of the integration.
 */
export const GetIntegrationSchema = z.object({
  appName: ComposioAppNameEnum,
})
