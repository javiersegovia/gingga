import { tool } from 'ai'
import { createSkill } from '../skill.types'
import {
  GetLocalTimeExecution,
  GetLocalTimeTool,
  GetLocalTimeToolParamsSchema,
} from './types'

const getLocalTimeToolExecution: GetLocalTimeExecution = async ({ location }) => {
  console.log(`Getting local time for ${location}`)
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    success: true,
    output: '10am',
    label: `Successfully retrieved the local time`,
  }
}

const getLocalTimeToolDefinition = tool({
  args: {
    action: 'Get local time',
  },
  description: 'Get the local time for a specified location',
  parameters: GetLocalTimeToolParamsSchema,
  execute: getLocalTimeToolExecution,
}) satisfies GetLocalTimeTool

export const getLocalTimeSkill = createSkill({
  id: 'getLocalTimeSkill',
  name: 'Get Local Time',
  description: 'Get the local time for a given location',
  version: '1.0',
  image: '',
  instructions: '[getLocalTime]: Get the local time for a given location',

  requiresConfirmation: true,

  tools: {
    getLocalTimeTool: getLocalTimeToolDefinition,
  },
  executions: {
    getLocalTimeTool: getLocalTimeToolExecution,
  },
})
