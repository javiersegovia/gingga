import { SkillInfo, ToolInfo } from '../skill.types'

const requiresConfirmation = true

export const getLocalTimeSkillInfo: SkillInfo = {
  id: 'getLocalTimeSkill',
  name: 'Get Local Time',
  description: 'Get the local time for a given location',
  version: '1.0',
  image: '',
  instructions: '[getLocalTimeTool]: get the local time for a given location',

  requiresConfirmation,
}

export const getLocalTimeToolInfo: ToolInfo = {
  id: 'getLocalTimeTool',
  name: 'Get Local Time',
  description: 'Get the local time for a given location',
  loading: 'Getting local time...',
  approval: 'Do you want to get the local time?',
  success: 'Local time retrieved successfully',
  error: 'Failed to get local time',

  requiresConfirmation,
}
