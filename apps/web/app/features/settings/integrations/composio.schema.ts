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

export const ComposioToolNames = [
  // Google Sheets
  'GOOGLESHEETS_CREATE_SHEET',
  'GOOGLESHEETS_UPDATE_SHEET',
  'GOOGLESHEETS_READ_SHEET',
  // Google Calendar
  'GOOGLECALENDAR_DUPLICATE_CALENDAR',
  'GOOGLECALENDAR_QUICK_ADD',
  'GOOGLECALENDAR_FIND_EVENT',
  'GOOGLECALENDAR_FIND_FREE_SLOTS',
  'GOOGLECALENDAR_GET_CURRENT_DATE_TIME',
  'GOOGLECALENDAR_CREATE_EVENT',
  'GOOGLECALENDAR_REMOVE_ATTENDEE',
  'GOOGLECALENDAR_GET_CALENDAR',
  'GOOGLECALENDAR_LIST_CALENDARS',
  'GOOGLECALENDAR_UPDATE_EVENT',
  'GOOGLECALENDAR_PATCH_CALENDAR',
  'GOOGLECALENDAR_DELETE_EVENT',
  // Google Docs
  'GOOGLEDOCS_CREATE_DOCUMENT_MARKDOWN',
  'GOOGLEDOCS_UPDATE_DOCUMENT_MARKDOWN',
  'GOOGLEDOCS_CREATE_DOCUMENT',
  'GOOGLEDOCS_GET_DOCUMENT_BY_ID',
  'GOOGLEDOCS_UPDATE_EXISTING_DOCUMENT',
  // Gmail
  'GMAIL_SEND_EMAIL',
  'GMAIL_LIST_EMAILS',
  'GMAIL_GET_EMAIL',
  'GMAIL_DELETE_EMAIL',
  'GMAIL_REPLY_EMAIL',
  'GMAIL_CREATE_DRAFT',
  'GMAIL_LIST_LABELS',
  'GMAIL_MODIFY_EMAIL',
  'GMAIL_LIST_THREADS',
  'GMAIL_GET_THREAD',
] as const
export const ComposioToolNameEnum = z.enum(ComposioToolNames)
export type ComposioToolName = z.infer<typeof ComposioToolNameEnum>

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
  image?: string
}

// Flattened type for connection information returned to our API/UI
export interface UserConnection {
  id: string
  appName: string | null
  status: string
  createdAt: string
}

/** Here we add static information about the integrations */

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
