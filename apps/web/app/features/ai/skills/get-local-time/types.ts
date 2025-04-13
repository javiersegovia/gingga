import type { Tool } from 'ai'
import { z } from 'zod'
import { ExecutionFunction, ToolResponse } from '../skill.types'

type GetLocalTimeToolResponse = ToolResponse<string>
export const GetLocalTimeToolParamsSchema = z.object({ location: z.string() })

export type GetLocalTimeTool = Tool<
  typeof GetLocalTimeToolParamsSchema,
  GetLocalTimeToolResponse
>
export type GetLocalTimeToolParams = z.infer<typeof GetLocalTimeToolParamsSchema>
export type GetLocalTimeExecution = ExecutionFunction<
  GetLocalTimeToolParams,
  GetLocalTimeToolResponse
>
