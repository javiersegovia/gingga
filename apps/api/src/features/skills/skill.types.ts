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

export const skillIds = [
  'getWeatherInformationSkill',
  'getLocalTimeSkill',
  'googlesheets-skill',
  'googlecalendar-skill',
  'googledocs-skill',
  'gmail-skill',
] as const

export type SkillId = (typeof skillIds)[number]
export const toolNames = [
  'getWeatherInformationTool',
  'getLocalTimeTool',
  'readSpreadsheetTool',
] as const

export const ToolNamesSchema = z.enum(toolNames)
export type ToolName = z.infer<typeof ToolNamesSchema>
