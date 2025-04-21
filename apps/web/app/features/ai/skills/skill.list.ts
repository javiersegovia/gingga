import { getServerEnv } from '~/server/env'
import type { SkillOption } from './skill.types'

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
            id: 'GOOGLESHEETS_BATCH_GET',
            name: 'Batch Get Spreadsheet Data',
            description:
              "Perform a batch get on a specific spreadsheet. Note: if ranges aren't provided, data from the first sheet will be returned.",
          },
          {
            id: 'GOOGLESHEETS_SHEET_FROM_JSON',
            name: 'Create Sheet From JSON',
            description: 'Create a new google sheet from a json object.',
          },
          {
            id: 'GOOGLESHEETS_LOOKUP_SPREADSHEET_ROW',
            name: 'Lookup Spreadsheet Row',
            description: 'Lookup a row in a specific spreadsheet by a column and value.',
          },
          {
            id: 'GOOGLESHEETS_GET_SHEET_NAMES',
            name: 'Get Sheet Names',
            description: 'Get all the worksheet names in a spreadsheet.',
          },
          {
            id: 'GOOGLESHEETS_BATCH_UPDATE',
            name: 'Batch Update Spreadsheet',
            description:
              'Perform a batch update operation on a specified google sheets spreadsheet.',
          },
          {
            id: 'GOOGLESHEETS_CREATE_GOOGLE_SHEET1',
            name: 'Create Google Sheet',
            description: 'Create a new google sheet.',
          },
          {
            id: 'GOOGLESHEETS_CLEAR_VALUES',
            name: 'Clear Sheet Values',
            description: 'Clear values from a specified range in a spreadsheet.',
          },
          {
            id: 'GOOGLESHEETS_GET_SPREADSHEET_INFO',
            name: 'Get Spreadsheet Info',
            description: 'Retrieve information about an existing google sheet.',
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
            name: 'Quick Add Event',
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
            name: 'Get Calendar Details',
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
            name: 'Update Calendar Properties',
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
            description:
              'Creates a new google docs document with an optional title and markdown text.',
          },
          {
            id: 'GOOGLEDOCS_UPDATE_DOCUMENT_MARKDOWN',
            name: 'Update Document (Markdown)',
            description:
              'Updates an existing google docs document created using markdown with new markdown text.',
          },
          {
            id: 'GOOGLEDOCS_CREATE_DOCUMENT',
            name: 'Create Document',
            description:
              'Creates a new google docs document with an optional title and text.',
          },
          {
            id: 'GOOGLEDOCS_GET_DOCUMENT_BY_ID',
            name: 'Get Document By ID',
            description: 'Retrieves a specific google document by its ID.',
          },
          {
            id: 'GOOGLEDOCS_UPDATE_EXISTING_DOCUMENT',
            name: 'Update Existing Document',
            description:
              'Updates an existing google docs document with the provided edits.',
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
            id: 'GMAIL_MODIFY_THREAD_LABELS',
            name: 'Modify Thread Labels',
            description: 'Action to modify labels of a thread in gmail.',
          },
          {
            id: 'GMAIL_SEND_EMAIL',
            name: 'Send Email',
            description: "Send an email using gmail's api.",
          },
          {
            id: 'GMAIL_MOVE_TO_TRASH',
            name: 'Move Email to Trash',
            description: "Move an email message to trash using gmail's api.",
          },
          {
            id: 'GMAIL_FETCH_MESSAGE_BY_MESSAGE_ID',
            name: 'Fetch Message by Message ID',
            description: 'Fetch messages by message id from gmail.',
          },
          {
            id: 'GMAIL_LIST_DRAFTS',
            name: 'List Drafts',
            description: "List all email drafts using gmail's api.",
          },
          {
            id: 'GMAIL_GET_ATTACHMENT',
            name: 'Get Attachment',
            description: 'Get an attachment from a mail.',
          },
          {
            id: 'GMAIL_LIST_THREADS',
            name: 'List Threads',
            description: 'Action to list threads in gmail.',
          },
          {
            id: 'GMAIL_FETCH_MESSAGE_BY_THREAD_ID',
            name: 'Fetch Message by Thread ID',
            description:
              'Fetch messages by thread id from gmail with pagination support.',
          },
          {
            id: 'GMAIL_LIST_LABELS',
            name: 'List Labels',
            description: "List all labels in the user's gmail account.",
          },
          {
            id: 'GMAIL_DELETE_DRAFT',
            name: 'Delete Draft',
            description: "Delete an email draft using gmail's api.",
          },
          {
            id: 'GMAIL_SEARCH_PEOPLE',
            name: 'Search People',
            description:
              "Provides a list of contacts in the authenticated user's grouped contacts that matches the search query.",
          },
          {
            id: 'GMAIL_REPLY_TO_THREAD',
            name: 'Reply to Thread',
            description: 'Action to reply to an email thread in gmail.',
          },
          {
            id: 'GMAIL_GET_PROFILE',
            name: 'Get Profile',
            description: 'Get the profile of the authenticated user.',
          },
          {
            id: 'GMAIL_REMOVE_LABEL',
            name: 'Remove Label',
            description: 'Action to remove a label in gmail.',
          },
          {
            id: 'GMAIL_GET_CONTACTS',
            name: 'Get Contacts',
            description:
              'Action to get info of contacts saved in google for an authorized account.',
          },
          {
            id: 'GMAIL_FETCH_EMAILS',
            name: 'Fetch Emails',
            description: 'Action to fetch all emails from gmail.',
          },
          {
            id: 'GMAIL_CREATE_LABEL',
            name: 'Create Label',
            description: 'Action to create a new label in gmail.',
          },
          {
            id: 'GMAIL_CREATE_EMAIL_DRAFT',
            name: 'Create Email Draft',
            description: "Create a draft email using gmail's api.",
          },
          {
            id: 'GMAIL_DELETE_MESSAGE',
            name: 'Delete Message',
            description: "Delete an email message using gmail's api.",
          },
          {
            id: 'GMAIL_GET_PEOPLE',
            name: 'Get People',
            description: 'Action to get contacts info of people.',
          },
          {
            id: 'GMAIL_ADD_LABEL_TO_EMAIL',
            name: 'Add Label to Email',
            description: 'Modify a label to an email in gmail.',
          },
        ],
      },
    },
  ]
}
