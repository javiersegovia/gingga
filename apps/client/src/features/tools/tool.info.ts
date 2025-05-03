import type { ToolName } from './tool.types'
import { QUALIFY_LEAD, SAVE_LEAD, SEARCH_FAQ, TRIGGER_N8N_WORKFLOW } from './tool.types'

export function getToolsRequiringConfirmation(): ToolName[] {
  return []
}

export const toolsRequiringConfirmation: ToolName[] = getToolsRequiringConfirmation()

export const APPROVAL = {
  YES: 'yes',
  NO: 'no',
} as const

export const toolsInfo: Record<ToolName, { approval: string, success: string }> = {
  [SEARCH_FAQ]: {
    approval: 'Do you want to search for an answer?',
    success: 'Answer found successfully!',
  },
  [SAVE_LEAD]: {
    approval: 'Do you want to create a lead?',
    success: 'Lead created successfully!',
  },
  [QUALIFY_LEAD]: {
    approval: 'Do you want to qualify a lead?',
    success: 'Lead qualified successfully!',
  },
  [TRIGGER_N8N_WORKFLOW]: {
    approval: 'Do you want to trigger an N8N workflow?',
    success: 'N8N workflow triggered successfully!',
  },
}
