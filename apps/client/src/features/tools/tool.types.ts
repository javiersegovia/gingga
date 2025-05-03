/* eslint-disable ts/no-explicit-any */

import { z } from 'zod'

export interface ToolResponse<TOutput = any> {
  success: boolean // Whether the tool execution was successful
  output: TOutput // The structured output from the tool
  label?: string // The label of the tool, to be displayed in the UI
  error?: string // Error message if success is false
  timing?: {
    startTime: string // ISO timestamp when the tool execution started
    endTime: string // ISO timestamp when the tool execution ended
    duration: number // Duration in milliseconds
  }
}

export const SEARCH_FAQ = 'search_faq' as const
export const SAVE_LEAD = 'save_lead' as const
export const QUALIFY_LEAD = 'qualify_lead' as const
export const TRIGGER_N8N_WORKFLOW = 'trigger_n8n_workflow' as const

export const toolNames = [
  SEARCH_FAQ,
  SAVE_LEAD,
  QUALIFY_LEAD,
  TRIGGER_N8N_WORKFLOW,
] as const

export const ToolNamesSchema = z.enum(toolNames)
export type ToolName = z.infer<typeof ToolNamesSchema>

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
