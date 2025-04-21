import type { Tool } from 'ai'
import type { ExecutionFunction, ToolResponse } from '../skill.types'
import { z } from 'zod'

// // Input schema based on GOOGLESHEETS_BATCH_GET parameters
// export const ReadSpreadsheetInputSchema = z.object({
//   spreadsheet_id: z
//     .string()
//     .describe('The ID of the Google Sheets spreadsheet to read from.'),
//   ranges: z
//     .array(z.string())
//     .optional()
//     .describe(
//       'Specific ranges to retrieve data from (e.g., ["Sheet1!A1:B2", "Sheet2!C1:C5"]). If not provided, data from the first sheet will be returned.',
//     ),
//   entityId: z.string().describe('The userId of the user to read the spreadsheet for.'),
// })

// export type ReadSpreadsheetInput = z.infer<typeof ReadSpreadsheetInputSchema>

// // Output schema based on Composio action response structure
export const ReadSpreadsheetOutputSchema = z.object({
  successful: z.boolean().describe('Indicates if the operation was successful.'),
  data: z
    .object({
      spreadsheetId: z.string().optional(),
      valueRanges: z
        .array(
          z.object({
            range: z.string().optional(),
            majorDimension: z.string().optional(),
            values: z.array(z.array(z.any())).optional(), // Represents the grid of values
          }),
        )
        .optional(),
    })
    .optional()
    .describe('The data returned from the spreadsheet.'),
  error: z.any().optional().describe('Error details if the operation failed.'),
})

export type ReadSpreadsheetOutput = z.infer<typeof ReadSpreadsheetOutputSchema>

type ReadSpreadsheetToolResponse = ToolResponse<ReadSpreadsheetOutput>
export const ReadSpreadsheetToolParamsSchema = z.object({
  spreadsheet_id: z
    .string()
    .describe('The ID of the Google Sheets spreadsheet to read from.'),
  ranges: z
    .array(z.string())
    .optional()
    .describe('Specific ranges to retrieve data from.'),
})

export type ReadSpreadsheetTool = Tool<
  typeof ReadSpreadsheetToolParamsSchema,
  ReadSpreadsheetToolResponse
>
export type ReadSpreadsheetToolParams = z.infer<typeof ReadSpreadsheetToolParamsSchema>
export type ReadSpreadsheetToolExecution = ExecutionFunction<
  ReadSpreadsheetToolParams,
  ReadSpreadsheetToolResponse
>

// type GetLocalTimeToolResponse = ToolResponse<string>
// export const GetLocalTimeToolParamsSchema = z.object({ location: z.string() })

// export type GetLocalTimeTool = Tool<
//   typeof GetLocalTimeToolParamsSchema,
//   GetLocalTimeToolResponse
// >
// export type GetLocalTimeToolParams = z.infer<typeof GetLocalTimeToolParamsSchema>
// export type GetLocalTimeExecution = ExecutionFunction<
//   GetLocalTimeToolParams,
//   GetLocalTimeToolResponse
// >
