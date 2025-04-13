import { Tool, ToolExecutionOptions } from 'ai'
import { z } from 'zod'

// export const ComposioAppNameEnum = z.enum(['googlesheets', 'googlecalendar', 'gmail'])
// export type ComposioAppName = z.infer<typeof ComposioAppNameEnum>
// export const ComposioServiceIdEnum = z.enum([
//   'google-sheets',
//   'google-calendar',
//   'google-gmail',
// ])
// export type ComposioServiceId = z.infer<typeof ComposioServiceIdEnum>

/**
 * Response interface for AI tool executions
 * @template TOutput The type of data returned by the tool
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

/**
 * Schema for valid skill IDs in the system
 */
export const SkillIdsSchema = z.enum(['getWeatherInformationSkill', 'getLocalTimeSkill'])
/**
 * Type alias for valid skill ID values
 */
export type SkillId = z.infer<typeof SkillIdsSchema>

/**
 * Schema for valid tool names in the system
 */
export const ToolNamesSchema = z.enum(['getWeatherInformationTool', 'getLocalTimeTool'])
/**
 * Type alias for valid tool name values
 */
export type ToolName = z.infer<typeof ToolNamesSchema>

/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 * Generic type for any AI tool with any parameter schema and tool response
 */
export type AnyTool = Tool<z.ZodTypeAny, ToolResponse>

/**
 * Tool type that must include an execute function
 * @template T Base tool type
 */
type ToolWithExecute<T extends AnyTool> = T & {
  execute: NonNullable<AnyTool['execute']>
}

/**
 * Tool type that must not include an execute function
 * @template T Base tool type
 */
type ToolWithoutExecute<T extends AnyTool> = T & {
  execute?: never
}

/**
 * Function signature for tool execution functions
 * @template TParams Parameter type for the execution function
 * @template TResponse Return type for the execution function
 */
export type ExecutionFunction<
  TParams = unknown,
  TResponse extends ToolResponse = ToolResponse,
> = (args: TParams, options: ToolExecutionOptions) => Promise<TResponse>

/**
 * Extracts parameter type from a tool definition
 * @template T Tool type to extract parameters from
 */
type ToolParamsType<T extends AnyTool> = T extends { parameters: infer P }
  ? P extends z.ZodTypeAny
    ? z.infer<P>
    : unknown
  : unknown

/**
 * Extracts result type from a tool definition
 * @template T Tool type to extract result from
 */
type ToolResultType<T extends AnyTool> =
  T extends Tool<z.ZodTypeAny, infer R>
    ? R extends ToolResponse
      ? R
      : ToolResponse
    : ToolResponse

// --- Discriminated Union for SkillConfig ---

/**
 * Configuration interface for skills that require user confirmation
 * @template TTools Record of tool definitions for this skill
 */
export interface SkillConfigWithConfirmation<
  TTools extends Partial<Record<ToolName, AnyTool>>,
> {
  id: SkillId
  name: string
  description: string
  version: string
  image: string
  instructions: string
  requiresConfirmation: true
  tools: {
    [K in keyof TTools & ToolName]?: TTools extends { [key: string]: infer U } ? U : never
  }
  executions: {
    [K in keyof TTools & ToolName]: ExecutionFunction<
      ToolParamsType<TTools extends { [key: string]: infer U } ? U : never>,
      ToolResultType<TTools extends { [key: string]: infer U } ? U : never>
    >
  }
}

/**
 * Configuration interface for skills that do NOT require user confirmation
 * @template TTools Record of tool definitions with execute functions
 */
export interface SkillConfigWithoutConfirmation<
  TTools extends Partial<Record<ToolName, ToolWithExecute<AnyTool>>>,
> {
  id: SkillId
  name: string
  description: string
  version: string
  image: string
  instructions: string
  requiresConfirmation: false
  tools: {
    [K in keyof TTools & ToolName]?: TTools extends { [key: string]: infer U } ? U : never
  }
  executions?: Record<never, never>
}

/**
 * Union type for skill configurations, either requiring confirmation or not
 */
export type SkillConfig =
  | SkillConfigWithConfirmation<Partial<Record<ToolName, AnyTool>>>
  | SkillConfigWithoutConfirmation<Record<ToolName, ToolWithExecute<AnyTool>>>

/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/**
 * Type for any function with any parameters
 * @template R Return type of the function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction<R = any> = (...args: any[]) => R

/**
 * Type for any execution function that returns a Promise<ToolResponse>
 */
type AnyExecutionFunction = AnyFunction<Promise<ToolResponse>>

/**
 * Parameters for the createSkill function
 * @template TTools Record mapping tool names to tool definitions
 * @template TExecutions Record mapping tool names to execution functions
 */
type CreateSkillParams<
  TTools extends Partial<Record<ToolName, AnyTool>>,
  TExecutions extends {
    [K in keyof TTools & ToolName]?: AnyExecutionFunction
  },
> = {
  id: SkillId
  name: string
  description: string
  version: string
  image: string
  instructions: string
  requiresConfirmation: boolean
  tools: TTools

  /**
   * The execution functions that require approval from the user before execution
   */
  executions: TExecutions
}

/**
 * Creates a skill configuration based on provided parameters
 *
 * @template TTools Record mapping tool names to tool definitions
 * @template TExecutions Record mapping tool names to execution functions
 * @param params Configuration parameters for the skill
 * @returns A properly structured SkillConfig object
 *
 * @example
 * ```ts
 * const getWeatherInformationSkill = createSkill({
 *   id: 'getWeatherInformationSkill',
 *   name: 'Get Weather Information',
 *   description: 'Get the weather information for a given city',
 *   version: '1.0',
 *   image: '',
 *   instructions: '[getWeatherInformationTool]: show the weather in a given city to the user.',
 *   requiresConfirmation: true,
 *   tools: {
 *     getWeatherInformationTool,
 *   },
 *   executions: {
 *     getWeatherInformationTool: getWeatherInformationExecution,
 *   },
 * })
 * ```
 */
export function createSkill<
  TTools extends Partial<Record<ToolName, AnyTool>>,
  TExecutions extends {
    [K in keyof TTools & ToolName]?: AnyExecutionFunction
  },
>(params: CreateSkillParams<TTools, TExecutions>): SkillConfig {
  const {
    id,
    name,
    description,
    version,
    image,
    instructions,
    requiresConfirmation,
    tools,
    executions,
  } = params

  const toolNames = Object.keys(tools) as ToolName[]

  if (toolNames.length === 0) {
    return params as SkillConfig
  }

  // Validate all keys are valid ToolNames
  toolNames.forEach((key) => {
    if (!ToolNamesSchema.safeParse(key).success) {
      throw new Error(`Invalid tool name: ${key}`)
    }
  })

  if (requiresConfirmation) {
    // Create a new object to store tools without execute
    const toolsWithoutExecute: Partial<Record<ToolName, ToolWithoutExecute<AnyTool>>> = {}

    // Process each tool
    for (const key of toolNames) {
      const tool = tools[key]

      if (!tool) {
        throw new Error(`Tool "${key}" is undefined.`)
      }

      // Remove execute property
      const { execute: _, ...restProps } = tool
      toolsWithoutExecute[key] = restProps as ToolWithoutExecute<AnyTool>
    }

    // Return the config with confirmation structure
    return {
      id,
      name,
      description,
      version,
      image,
      instructions,
      requiresConfirmation: true,
      tools: toolsWithoutExecute,
      executions,
    } as SkillConfigWithConfirmation<Partial<Record<ToolName, AnyTool>>>
  } else {
    // For tools without confirmation, ensure they all have execute functions
    const toolsWithExecute: Record<ToolName, ToolWithExecute<AnyTool>> = {} as Record<
      ToolName,
      ToolWithExecute<AnyTool>
    >

    // Process each tool
    for (const key of Object.keys(tools) as ToolName[]) {
      const tool = tools[key]

      // Check that execute is present at runtime
      if (typeof (tool as { execute?: unknown }).execute !== 'function') {
        throw new Error(
          `Tool "${key}" passed to createSkill with requiresConfirmation: false is missing the execute function.`,
        )
      }

      toolsWithExecute[key] = tool as unknown as ToolWithExecute<AnyTool>
    }

    // Return the config without confirmation structure
    return {
      id,
      name,
      description,
      version,
      image,
      instructions,
      requiresConfirmation: false,
      tools: toolsWithExecute,
      executions: undefined,
    } as SkillConfigWithoutConfirmation<Record<ToolName, ToolWithExecute<AnyTool>>>
  }
}

/**
 * This is intended to be consumed by the UI to display information about the tool
 */
export type ToolInfo = {
  id: ToolName
  name: string
  description: string
  loading: string
  approval: string
  success: string
  error: string
  requiresConfirmation: boolean
}

/**
 * This is intended to be consumed both by the UI to display information about the skill
 * and by the AI to execute the skill
 */
export interface SkillInfo {
  id: SkillId
  name: string
  description: string
  version: string
  image: string
  instructions: string
  requiresConfirmation: boolean
}
