import { getServerEnv } from '@/server/env'
import { SkillOption } from './skill.types'

export const getSkills = (): SkillOption[] => {
  return [
    {
      id: 'googlesheets-skill',
      name: 'Spreadsheet Editor',
      description: 'Read, write, and update data from your spreadsheets',
      image: `${import.meta.env.VITE_ASSETS_URL}/agents/skill_icons/spreadsheet-1.png`,
      version: '1.0',
      integration: {
        required: true,
        appName: 'googlesheets',
        appDisplayName: 'Google Sheets',
        appImage:
          'https://cdn.jsdelivr.net/gh/ComposioHQ/open-logos@master/google-sheets.svg',
        integrationId: getServerEnv().COMPOSIO_GOOGLESHEETS_INTEGRATION_ID,
        availableComposioToolNames: [
          {
            id: 'GOOGLESHEETS_CREATE_SHEET',
            name: 'Create Sheet',
            description: 'Create a new spreadsheet.',
          },
          {
            id: 'GOOGLESHEETS_UPDATE_SHEET',
            name: 'Update Sheet',
            description: 'Update data within an existing sheet.',
          },
          {
            id: 'GOOGLESHEETS_READ_SHEET',
            name: 'Read Sheet',
            description: 'Read data from a sheet.',
          },
        ],
      },
    },
    {
      id: 'googlecalendar-skill',
      name: 'Meeting Scheduler',
      description: 'Schedule events, set reminders, and manage your calendar',
      image: `${import.meta.env.VITE_ASSETS_URL}/agents/skill_icons/calendar-1.png`,
      version: '1.0',
      integration: {
        required: true,
        appName: 'googlecalendar',
        appDisplayName: 'Google Calendar',
        appImage:
          'https://cdn.jsdelivr.net/gh/ComposioHQ/open-logos@master/google-calendar.svg',
        integrationId: getServerEnv().COMPOSIO_GOOGLECALENDAR_INTEGRATION_ID,
        availableComposioToolNames: [
          {
            id: 'GOOGLECALENDAR_DUPLICATE_CALENDAR',
            name: 'Duplicate Calendar',
            description: 'Create a copy of an existing calendar.',
          },
          {
            id: 'GOOGLECALENDAR_QUICK_ADD',
            name: 'Quick Add',
            description: 'Quickly add an event using natural language.',
          },
          {
            id: 'GOOGLECALENDAR_FIND_EVENT',
            name: 'Find Event',
            description: 'Search for events in your calendar.',
          },
          {
            id: 'GOOGLECALENDAR_FIND_FREE_SLOTS',
            name: 'Find Free Slots',
            description: 'Find available time slots in your calendar.',
          },
          {
            id: 'GOOGLECALENDAR_GET_CURRENT_DATE_TIME',
            name: 'Get Current Date Time',
            description: 'Get the current date and time.',
          },
          {
            id: 'GOOGLECALENDAR_CREATE_EVENT',
            name: 'Create Event',
            description: 'Create a new calendar event.',
          },
          {
            id: 'GOOGLECALENDAR_REMOVE_ATTENDEE',
            name: 'Remove Attendee',
            description: 'Remove an attendee from an event.',
          },
          {
            id: 'GOOGLECALENDAR_GET_CALENDAR',
            name: 'Get Calendar',
            description: 'Retrieve details of a specific calendar.',
          },
          {
            id: 'GOOGLECALENDAR_LIST_CALENDARS',
            name: 'List Calendars',
            description: 'List all your calendars.',
          },
          {
            id: 'GOOGLECALENDAR_UPDATE_EVENT',
            name: 'Update Event',
            description: 'Update details of an existing event.',
          },
          {
            id: 'GOOGLECALENDAR_PATCH_CALENDAR',
            name: 'Patch Calendar',
            description: 'Update specific properties of a calendar.',
          },
          {
            id: 'GOOGLECALENDAR_DELETE_EVENT',
            name: 'Delete Event',
            description: 'Delete a calendar event.',
          },
        ],
      },
    },
    {
      id: 'googledocs-skill',
      name: 'Document Editor',
      description: 'Create, edit, and manage your documents',
      image: `${import.meta.env.VITE_ASSETS_URL}/agents/skill_icons/docs-1.png`,
      version: '1.0',
      integration: {
        required: true,
        appName: 'googledocs',
        appDisplayName: 'Google Docs',
        appImage:
          'https://cdn.jsdelivr.net/gh/ComposioHQ/open-logos@master/google-docs.svg',
        integrationId: getServerEnv().COMPOSIO_GOOGLEDOCS_INTEGRATION_ID,
        availableComposioToolNames: [
          {
            id: 'GOOGLEDOCS_CREATE_DOCUMENT_MARKDOWN',
            name: 'Create Document (Markdown)',
            description: 'Create a new Google Doc from Markdown content.',
          },
          {
            id: 'GOOGLEDOCS_UPDATE_DOCUMENT_MARKDOWN',
            name: 'Update Document (Markdown)',
            description: 'Update an existing Google Doc with Markdown content.',
          },
          {
            id: 'GOOGLEDOCS_CREATE_DOCUMENT',
            name: 'Create Document',
            description: 'Create a new blank Google Doc.',
          },
          {
            id: 'GOOGLEDOCS_GET_DOCUMENT_BY_ID',
            name: 'Get Document By Id',
            description: 'Retrieve a Google Doc by its ID.',
          },
          {
            id: 'GOOGLEDOCS_UPDATE_EXISTING_DOCUMENT',
            name: 'Update Existing Document',
            description: 'Update the content of an existing Google Doc.',
          },
        ],
      },
    },
    {
      id: 'gmail-skill',
      name: 'Email Assistant',
      description: 'Send, receive, and manage your emails',
      image: `${import.meta.env.VITE_ASSETS_URL}/agents/skill_icons/email-1.png`,
      version: '1.0',
      integration: {
        required: true,
        appName: 'gmail',
        appDisplayName: 'Gmail',
        appImage: 'https://cdn.jsdelivr.net/gh/ComposioHQ/open-logos@master/gmail.svg',
        integrationId: getServerEnv().COMPOSIO_GMAIL_INTEGRATION_ID,
        availableComposioToolNames: [
          {
            id: 'GMAIL_SEND_EMAIL',
            name: 'Send Email',
            description: 'Send a new email.',
          },
          {
            id: 'GMAIL_LIST_EMAILS',
            name: 'List Emails',
            description: 'List emails in your inbox or with specific labels.',
          },
          {
            id: 'GMAIL_GET_EMAIL',
            name: 'Get Email',
            description: 'Retrieve a specific email by its ID.',
          },
          {
            id: 'GMAIL_DELETE_EMAIL',
            name: 'Delete Email',
            description: 'Delete an email.',
          },
          {
            id: 'GMAIL_REPLY_EMAIL',
            name: 'Reply Email',
            description: 'Reply to an existing email.',
          },
          {
            id: 'GMAIL_CREATE_DRAFT',
            name: 'Create Draft',
            description: 'Create a new draft email.',
          },
          {
            id: 'GMAIL_LIST_LABELS',
            name: 'List Labels',
            description: 'List all your Gmail labels.',
          },
          {
            id: 'GMAIL_MODIFY_EMAIL',
            name: 'Modify Email',
            description: 'Modify labels or status of an email.',
          },
          {
            id: 'GMAIL_LIST_THREADS',
            name: 'List Threads',
            description: 'List email threads.',
          },
          {
            id: 'GMAIL_GET_THREAD',
            name: 'Get Thread',
            description: 'Retrieve a specific email thread.',
          },
        ],
      },
    },
  ]
}
