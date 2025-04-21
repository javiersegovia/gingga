// import { DataStreamWriter } from 'ai'
// import { Session } from 'better-auth'
// import { VercelAIToolSet } from 'composio-core'
// import { eq } from '@gingga/db'
// import { AgentSkills } from '@gingga/db/schema'
// import { getDatabase } from '~/middleware/setup-context.server'
// import { ComposioAppName } from '../../../settings/integrations/composio.schema'
// import { getServerEnv } from '../../../../server/env'
// import { SkillId } from '../skill.types'

// export const getComposioIntegrationId = (appName: ComposioAppName) => {
//   const env = getServerEnv()
//   switch (appName) {
//     case 'googlesheets':
//       return env.COMPOSIO_GOOGLESHEETS_INTEGRATION_ID
//     case 'googlecalendar':
//       return env.COMPOSIO_GOOGLECALENDAR_INTEGRATION_ID
//     case 'gmail':
//       return env.COMPOSIO_GMAIL_INTEGRATION_ID
//     case 'googledocs':
//       return env.COMPOSIO_GOOGLEDOCS_INTEGRATION_ID
//     default:
//       throw new Error(`Unsupported app name: ${appName}`)
//   }
// }

// type ToolName = 'getWeatherInformationTool' | 'getLocalTimeTool'

// type SkillOption = {
//   id: SkillId
//   name: string
//   description: string
//   image: string
//   availableToolNames?: ToolName[]
//   integration?: {
//     required: boolean
//     integrationAppName: ComposioAppName
//     integrationId: string
//     availableComposioToolNames: string[]
//   }
// }

// export const GoogleSheetsSkillOption: SkillOption = {
//   id: 'googlesheets-skill',
//   name: 'Google Sheets',
//   description: 'Read, write, and update data from Google Sheets',
//   image: '',

//   integration: {
//     required: true,
//     integrationAppName: 'googlesheets',
//     integrationId: getComposioIntegrationId('googlesheets'),
//     availableComposioToolNames: [
//       'GOOGLESHEETS_BATCH_GET',
//       'GOOGLESHEETS_SHEET_FROM_JSON',
//       'GOOGLESHEETS_LOOKUP_SPREADSHEET_ROW',
//       'GOOGLESHEETS_GET_SHEET_NAMES',
//       'GOOGLESHEETS_BATCH_UPDATE',
//       'GOOGLESHEETS_CREATE_GOOGLE_SHEET1',
//       'GOOGLESHEETS_CLEAR_VALUES',
//       'GOOGLESHEETS_GET_SPREADSHEET_INFO',
//     ],
//   },
// }

// interface GetComposioToolsFromAgentSkillProps {
//   appName: ComposioAppName
//   toolset: VercelAIToolSet
//   composioToolNames: string[]
// }

// const getAgentSkillById = async (id: string) => {
//   return getDatabase().query.AgentSkills.findFirst({
//     where: eq(AgentSkills.id, id),
//   })
// }

// export const getComposioToolsFromAgentSkill = async ({
//   appName,
//   composioToolNames,
//   toolset,
// }: GetComposioToolsFromAgentSkillProps) => {
//   const integrationId = getComposioIntegrationId(appName)
//   const composioTools = await toolset.getTools({
//     integrationId,
//     actions: composioToolNames,
//   })
//   return composioTools
// }

// /** PSEUDO CODE */
// const getAgentSkillTools = async (agentSkillId: string) => {
//   const agentSkill = await getAgentSkillById(agentSkillId)
//   const tools = agentSkill?.composioToolNames
//   return tools
// }

// interface ReadSpreadsheetProps {
//   session: Session
//   dataStream: DataStreamWriter
//   toolset: VercelAIToolSet
//   agentId: string
// }
