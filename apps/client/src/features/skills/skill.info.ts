import type { ToolName } from './skill.types'

export function getToolsRequiringConfirmation(): ToolName[] {
  return []
}

// Export as used in message.tsx
export const toolsRequiringConfirmation: ToolName[] = getToolsRequiringConfirmation()

export const APPROVAL = {
  YES: 'yes',
  NO: 'no',
} as const

// All ToolName values must be present
export const toolsInfo: Record<ToolName, { approval: string, success: string }> = {
  getWeatherInformationTool: {
    approval: 'Do you want to get the weather information?',
    success: 'Weather information retrieved successfully!',
  },
  getLocalTimeTool: {
    approval: 'Do you want to get the local time?',
    success: 'Local time retrieved successfully!',
  },
  readSpreadsheetTool: {
    approval: 'Do you want to read the spreadsheet?',
    success: 'Spreadsheet read successfully!',
  },
}
