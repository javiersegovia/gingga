import { z } from 'zod'

// Define allowed app names (exclude 'googledrive' if not active)
// export type ComposioAppName = 'googlesheets' | 'googlecalendar' | 'gmail'
export const ComposioAppNameEnum = z.enum(['googlesheets', 'googlecalendar', 'gmail'])
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
  },
  googlecalendar: {
    label: 'Google Calendar',
    appName: 'googlecalendar',
    description:
      'Agents will be able to schedule events, set reminders, and manage your calendar.',
  },
  gmail: {
    label: 'Gmail',
    appName: 'gmail',
    description: 'Agents will be able to send, receive, and manage your emails.',
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
