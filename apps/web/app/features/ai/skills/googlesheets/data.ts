import { getServerEnv } from '@/server/env'
import { SkillOption } from '../skill.types'

export const googlesheetsSkill = (): SkillOption => {
  const env = getServerEnv()

  return {
    id: 'googlesheets-skill',
    name: 'Google Sheets',
    description: 'Read, write, and update data from Google Sheets',
    image: '', // Add an image path or URL if available
    version: '1.0',
    integration: {
      required: true,
      integrationAppName: 'googlesheets',
      integrationId: env.COMPOSIO_GOOGLESHEETS_INTEGRATION_ID,
      availableComposioToolNames: [
        'GOOGLESHEETS_BATCH_GET',
        'GOOGLESHEETS_SHEET_FROM_JSON',
        'GOOGLESHEETS_LOOKUP_SPREADSHEET_ROW',
        'GOOGLESHEETS_GET_SHEET_NAMES',
        'GOOGLESHEETS_BATCH_UPDATE',
        'GOOGLESHEETS_CREATE_GOOGLE_SHEET1',
        'GOOGLESHEETS_CLEAR_VALUES',
        'GOOGLESHEETS_GET_SPREADSHEET_INFO',
      ],
    },
  }
}
