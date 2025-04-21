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
  'GOOGLESHEETS_BATCH_GET',
  'GOOGLESHEETS_SHEET_FROM_JSON',
  'GOOGLESHEETS_LOOKUP_SPREADSHEET_ROW',
  'GOOGLESHEETS_GET_SHEET_NAMES',
  'GOOGLESHEETS_BATCH_UPDATE',
  'GOOGLESHEETS_CREATE_GOOGLE_SHEET1',
  'GOOGLESHEETS_CLEAR_VALUES',
  'GOOGLESHEETS_GET_SPREADSHEET_INFO',
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
  'GMAIL_MODIFY_THREAD_LABELS',
  'GMAIL_SEND_EMAIL',
  'GMAIL_MOVE_TO_TRASH',
  'GMAIL_FETCH_MESSAGE_BY_MESSAGE_ID',
  'GMAIL_LIST_DRAFTS',
  'GMAIL_GET_ATTACHMENT',
  'GMAIL_LIST_THREADS',
  'GMAIL_FETCH_MESSAGE_BY_THREAD_ID',
  'GMAIL_LIST_LABELS',
  'GMAIL_DELETE_DRAFT',
  'GMAIL_SEARCH_PEOPLE',
  'GMAIL_REPLY_TO_THREAD',
  'GMAIL_GET_PROFILE',
  'GMAIL_REMOVE_LABEL',
  'GMAIL_GET_CONTACTS',
  'GMAIL_FETCH_EMAILS',
  'GMAIL_CREATE_LABEL',
  'GMAIL_CREATE_EMAIL_DRAFT',
  'GMAIL_DELETE_MESSAGE',
  'GMAIL_GET_PEOPLE',
  'GMAIL_ADD_LABEL_TO_EMAIL',
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
  enabled?: boolean
  deleted?: boolean
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
