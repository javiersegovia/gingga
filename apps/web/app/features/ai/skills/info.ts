import { SkillId, SkillInfo, ToolInfo, ToolName } from './skill.types'
import { getLocalTimeSkillInfo, getLocalTimeToolInfo } from './get-local-time/info'
import {
  getWeatherInformationSkillInfo,
  getWeatherInformationToolInfo,
} from './get-weather-information/info'

export const skillsInfo: Record<SkillId, SkillInfo> = {
  getWeatherInformationSkill: getWeatherInformationSkillInfo,
  getLocalTimeSkill: getLocalTimeSkillInfo,
}

export const toolsInfo: Record<ToolName, ToolInfo> = {
  getWeatherInformationTool: getWeatherInformationToolInfo,
  getLocalTimeTool: getLocalTimeToolInfo,
}

export const getSkillInfo = (skillId: SkillId) => {
  return skillsInfo[skillId]
}

export const getToolInfo = (toolName: ToolName) => {
  return toolsInfo[toolName]
}

export function getToolsRequiringConfirmation(): ToolName[] {
  return Object.values(toolsInfo)
    .filter((tool) => tool.requiresConfirmation)
    .map((tool) => tool.id)
}

export const toolsRequiringConfirmation = getToolsRequiringConfirmation()

export const APPROVAL = {
  YES: 'Yes, confirmed.',
  NO: 'No, denied.',
} as const
