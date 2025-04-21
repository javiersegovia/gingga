import type { Tool } from 'ai'
import type { ExecutionFunction, ToolResponse } from '../skill.types'
import { z } from 'zod'

type GetWeatherInformationToolResponse = ToolResponse<string>
export const GetWeatherInformationToolParamsSchema = z.object({ city: z.string() })

export type GetWeatherInformationTool = Tool<
  typeof GetWeatherInformationToolParamsSchema,
  GetWeatherInformationToolResponse
>
export type GetWeatherInformationToolParams = z.infer<
  typeof GetWeatherInformationToolParamsSchema
>
export type GetWeatherInformationExecution = ExecutionFunction<
  GetWeatherInformationToolParams,
  GetWeatherInformationToolResponse
>
