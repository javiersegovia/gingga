import type { Tool } from 'ai'
import type { QualifyLeadResult } from './qualify-lead.logic'
import type { ToolResponse } from './tool.types' // Updated path
import { Leads } from '@gingga/db/schema' // Updated path, assuming schema name is Leads
import { tool } from 'ai'
import { z } from 'zod'
import { getDB } from '~/server/context.server' // Updated path
import { qualifyLead } from './qualify-lead.logic'

// Define the input schema for the save lead tool, including qualification criteria
const saveLeadSchema = z.object({
  name: z.string().describe('The name of the lead'),
  email: z.string().email().describe('The email address of the lead'),
  phone: z.string().optional().describe('The phone number of the lead'),
  topic: z.string().describe('The topic the lead is interested in'),
  qualificationCriteria: z
    .string()
    .describe(
      'The criteria used by the LLM to qualify the lead (e.g., budget > $10k AND timeline < 3 months)',
    ),
})

type SaveLeadInput = z.infer<typeof saveLeadSchema>

// Define the output structure, including qualification results
interface SaveLeadOutput extends QualifyLeadResult {
  leadId: string | null // null if saving failed
  dbSaveSuccess: boolean
  dbSaveMessage: string
}

export function saveLeadTool({ agentId }: { agentId: string }): Tool {
  return tool({
    description:
    'Qualifies a lead using an LLM based on criteria and then saves the information to the database.',
    parameters: saveLeadSchema,
    async execute(input: SaveLeadInput): Promise<ToolResponse<SaveLeadOutput>> {
      const startTime = new Date().toISOString()
      let endTime: string
      let qualificationResult: QualifyLeadResult | undefined
      let dbResult: { success: boolean, leadId: string | null, message: string } = {
        success: false,
        leadId: null,
        message: 'DB save not attempted.',
      }

      try {
        qualificationResult = await qualifyLead(input)

        const db = getDB()

        const leadDataToInsert = {
          name: input.name,
          email: input.email,
          phone: input.phone,
          topic: input.topic,
          isQualified: qualificationResult.qualified,
          qualificationScore: qualificationResult.qualificationScore,
          qualificationReason: qualificationResult.reason,
          rawMessageJson: JSON.stringify(input),
          agentId,
        }

        const [insertedLead] = await db
          .insert(Leads)
          .values(leadDataToInsert)
          .returning({ insertedId: Leads.id })

        if (insertedLead && insertedLead.insertedId) {
          dbResult = {
            success: true,
            leadId: insertedLead.insertedId.toString(), // Assuming ID is number or string
            message: 'Lead saved successfully.',
          }
        }
        else {
          console.error('Error saving lead information to the database.')
          throw new Error('We got an error. Please try again later.')
        }

        endTime = new Date().toISOString()
        return {
          success: true,
          output: {
            ...qualificationResult,
            leadId: dbResult.leadId,
            dbSaveSuccess: dbResult.success,
            dbSaveMessage: dbResult.message,
          },
          timing: {
            startTime,
            endTime,
            duration: new Date(endTime).getTime() - new Date(startTime).getTime(),
          },
        } as ToolResponse<SaveLeadOutput>
      }
      catch (error: unknown) {
        console.error('Error in saveLeadTool:', error)
        endTime = new Date().toISOString()
        const errorMessage = error instanceof Error ? error.message : 'Unknown error during save/qualification'
        const output = qualificationResult
          ? {
              ...qualificationResult,
              leadId: dbResult.leadId,
              dbSaveSuccess: dbResult.success,
              dbSaveMessage: dbResult.success ? dbResult.message : errorMessage,
            }
          : {
              qualificationScore: 0,
              qualified: false,
              reason: 'Qualification step failed or was not reached.',
              leadId: null,
              dbSaveSuccess: false,
              dbSaveMessage: errorMessage,
            }

        return {
          success: false,
          output: output as SaveLeadOutput, // Cast needed due to conditional structure
          error: errorMessage,
          timing: {
            startTime,
            endTime,
            duration: new Date(endTime).getTime() - new Date(startTime).getTime(),
          },
        } as ToolResponse<SaveLeadOutput>
      }
    },
  })
}
