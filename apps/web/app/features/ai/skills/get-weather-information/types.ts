import type { Tool } from 'ai'
import { z } from 'zod'
import { ExecutionFunction, ToolResponse } from '../skill.types'

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
