import type { Tool } from 'ai'
import type { QualifyLeadResult } from './qualify-lead.logic'
import type { ToolResponse } from './tool.types'
import { eq } from '@gingga/db'
import { Agents, Leads } from '@gingga/db/schema' // Add Agents import
import { tool } from 'ai'
import { z } from 'zod'
import { getDB } from '~/server/context.server'
import { qualifyLead } from './qualify-lead.logic'

const saveLeadSchema = z.object({
  name: z.string().describe('The name of the lead'),
  email: z.string().email().describe('The email address of the lead'),
  phone: z.string().optional().describe('The phone number of the lead'),
  topic: z.string().describe('The topic the lead is interested in'),
  notes: z.string().optional().describe('Any additional notes about the lead or conversation.'), // Add notes field
})

type SaveLeadInput = z.infer<typeof saveLeadSchema>

// Define the output structure, including qualification results
interface SaveLeadOutput extends QualifyLeadResult {
  leadId: string | null // null if saving failed
}

export function saveLeadTool({ agentId }: { agentId: string }): Tool {
  return tool({
    description:
    'Saves lead information to the database and optionally qualifies it based on the agent\'s configured criteria.',
    parameters: saveLeadSchema,
    async execute(input: SaveLeadInput): Promise<ToolResponse<SaveLeadOutput>> {
      const startTime = new Date().toISOString()
      let endTime: string
      let qualificationResult: QualifyLeadResult | undefined
      let dbResult: { success: boolean, leadId: string | null } = {
        success: false,
        leadId: null,
      }

      try {
        const db = getDB()

        const agent = await db.query.Agents.findFirst({
          where: eq(Agents.id, agentId),
          columns: { qualificationCriteria: true },
        })

        if (!agent) {
          throw new Error(`Agent with ID ${agentId} not found.`)
        }

        // Perform qualification using fetched criteria
        qualificationResult = await qualifyLead(input, agent.qualificationCriteria)

        const leadDataToInsert = {
          fullName: input.name,
          email: input.email,
          phone: input.phone,
          subjectInterest: input.topic,
          notes: input.notes,
          qualification: (qualificationResult.qualified ? 'sales_qualified_lead' : 'not_qualified') as typeof Leads.$inferInsert['qualification'],
          qualificationScore: qualificationResult.qualificationScore,
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
            leadId: insertedLead.insertedId.toString(),
          }
        }
        else {
          console.error('Error saving lead information to the database. Insert result:', insertedLead)
          throw new Error('Failed to save lead data to the database.')
        }

        endTime = new Date().toISOString()
        return {
          success: true,
          output: {
            ...qualificationResult,
            leadId: dbResult.leadId,
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
        // Ensure output structure is consistent even on error
        // We might not have agent context here if the initial fetch failed,
        // so we can't reliably get qualificationCriteria in the catch block.
        // If qualificationResult exists, use its reason; otherwise, provide a generic failure message.
        const output: SaveLeadOutput = {
          qualificationScore: qualificationResult?.qualificationScore ?? 0,
          qualified: qualificationResult?.qualified ?? false,
          reason: qualificationResult?.reason ?? 'Qualification step failed or was not reached.',
          leadId: dbResult.leadId,
        }

        return {
          success: false,
          output,
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
