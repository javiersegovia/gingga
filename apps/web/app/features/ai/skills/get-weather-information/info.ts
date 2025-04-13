import { SkillInfo, ToolInfo } from '../skill.types'

const requiresConfirmation = true

export const getWeatherInformationSkillInfo: SkillInfo = {
  id: 'getWeatherInformationSkill',
  name: 'Get Weather Information',
  description: 'Get the weather information for a given city',
  version: '1.0',
  image: '',
  instructions:
    '[getWeatherInformationTool]: show the weather in a given city to the user.',

  requiresConfirmation,
}

export const getWeatherInformationToolInfo: ToolInfo = {
  id: 'getWeatherInformationTool',
  name: 'Get Weather Information',
  description: 'Get the weather information for a given city',
  loading: 'Getting weather information...',
  approval: 'I will search the web for retrieving the weather information. Are you sure?',
  success: 'Weather information retrieved successfully',
  error: 'Failed to get weather information',

  requiresConfirmation,
}
