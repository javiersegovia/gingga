import { z } from 'zod'

export interface ToolTiming {
  startTime: string
  endTime: string
  duration: number
}

export interface ToolSuccessResponse<TOutput> {
  success: true
  output: TOutput
  timing: ToolTiming
}

export interface ToolErrorResponse<TOutput> {
  success: false
  output: TOutput | Partial<TOutput> // Allow partial output on error
  error: string
  timing: ToolTiming
}

// eslint-disable-next-line ts/no-explicit-any
export type ToolResponse<TOutput = any> = ToolSuccessResponse<TOutput> | ToolErrorResponse<TOutput>

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
