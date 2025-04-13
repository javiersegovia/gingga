import { tool } from 'ai'
import { createSkill } from '../skill.types'
import {
  GetWeatherInformationExecution,
  GetWeatherInformationTool,
  GetWeatherInformationToolParamsSchema,
} from './types'

const getWeatherInformationExecution: GetWeatherInformationExecution = async ({
  city,
}) => {
  console.log(`Getting weather information for ${city}`)
  // Simulate API call or actual weather fetching logic
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    success: true,
    label: `Successfully retrieved weather information for "${city}"`,
    output: `It is currently 70 degrees and cloudy in "${city}"`,
  }
}

const getWeatherInformationTool = tool({
  description: 'show the weather in a given city to the user',
  parameters: GetWeatherInformationToolParamsSchema,
  execute: getWeatherInformationExecution,
}) satisfies GetWeatherInformationTool

export const getWeatherInformationSkill = createSkill({
  id: 'getWeatherInformationSkill',
  name: 'Get Weather Information',
  description: 'Get the weather information for a given city',
  version: '1.0',
  image: '',
  instructions:
    '[getWeatherInformationTool]: show the weather in a given city to the user.',

  requiresConfirmation: true,

  tools: {
    getWeatherInformationTool,
  },

  executions: {
    getWeatherInformationTool: getWeatherInformationExecution,
  },
})
