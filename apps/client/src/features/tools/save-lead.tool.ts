import type { Tool } from 'ai'
import type { QualifyLeadResult } from './qualify-lead.logic'
import type { ToolResponse } from './tool.types'
import { eq } from '@gingga/db'
import { Agents, Leads, Users } from '@gingga/db/schema' // Add Agents import and Users import
import { tool } from 'ai'
import { z } from 'zod'
import { NOTIFICATIONS_EMAIL } from '~/lib/constants'
import { sendEmail } from '~/lib/email'
import LeadNotificationEmail from '~/lib/email/templates/lead-notification.email'
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

interface SaveLeadOutput extends QualifyLeadResult {
  notificationSent?: boolean // To indicate if email was attempted/sent
}

export function saveLeadTool({ agentId }: { agentId: string }): Tool {
  return tool({
    description:
    'Saves lead information to the database and optionally qualifies it based on the agent\'s configured criteria.',
    parameters: saveLeadSchema,
    async execute(input: SaveLeadInput): Promise<ToolResponse<SaveLeadOutput>> {
      let qualificationResult: QualifyLeadResult | undefined
      let dbResult: { success: boolean, leadId: string | null } = {
        success: false,
        leadId: null,
      }
      let notificationSent = false

      try {
        const db = getDB()

        const agent = await db.query.Agents.findFirst({
          where: eq(Agents.id, agentId),
          columns: { qualificationCriteria: true, hasEmailNotifications: true, ownerId: true }, // Fetch required fields
        })

        if (!agent) {
          throw new Error(`Agent with ID ${agentId} not found.`)
        }

        qualificationResult = await qualifyLead(input, agent.qualificationCriteria)

        const leadDataToInsert = {
          agentId,
          fullName: input.name,
          email: input.email,
          phone: input.phone,
          subjectInterest: input.topic,
          notes: input.notes,
          qualification: (qualificationResult.qualified ? 'sales_qualified_lead' : 'not_qualified') as typeof Leads.$inferInsert['qualification'],
          qualificationScore: qualificationResult.qualificationScore,
          rawMessageJson: JSON.stringify(input), // rawMessageJson should now be the input to the tool
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

          // Send email notification if enabled and lead saved successfully
          if (agent.hasEmailNotifications && agent.ownerId && dbResult.leadId) {
            const owner = await db.query.Users.findFirst({
              where: eq(Users.id, agent.ownerId),
              columns: { email: true },
            })

            // Prepare props for the email template
            // We need to fetch the full lead object or construct it carefully
            const fullLeadData = await db.query.Leads.findFirst({
              where: eq(Leads.id, dbResult.leadId),
            })

            if (fullLeadData) {
              const emailProps = {
                leadId: fullLeadData.id,
                agentId: fullLeadData.agentId,
                fullName: fullLeadData.fullName,
                email: fullLeadData.email,
                phone: fullLeadData.phone,
                subjectInterest: fullLeadData.subjectInterest,
                notes: fullLeadData.notes,
                utmSource: fullLeadData.utmSource,
                qualification: fullLeadData.qualification,
                qualificationScore: fullLeadData.qualificationScore,
                createdAt: fullLeadData.createdAt || new Date(), // Fallback, though createdAt should exist
                rawMessageJson: fullLeadData.rawMessageJson ? JSON.stringify(fullLeadData.rawMessageJson) : undefined,
              }
              try {
                const destination = [NOTIFICATIONS_EMAIL, owner?.email].filter(Boolean) as string[]
                await sendEmail({
                  to: destination,
                  subject: `New Lead from Gingga: ${input.name || input.email}`,
                  react: LeadNotificationEmail({ ...emailProps }),
                })

                notificationSent = true
              }
              catch (emailError) {
                console.error('Error sending lead notification email:', emailError)
                // Decide if this error should make the whole tool fail or just log
              }
            }
            else {
              console.error(`Error fetching full lead data for notification: Lead ID ${dbResult.leadId}`)
            }
          }
        }
        else {
          console.error('Error saving lead information to the database. Insert result:', insertedLead)
          throw new Error('Failed to save lead data to the database.')
        }

        return {
          success: true,
          output: {},
        } as ToolResponse<SaveLeadOutput>
      }
      catch (error: unknown) {
        console.error('Error in saveLeadTool:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error during save/qualification'
        // Ensure output structure is consistent even on error
        // We might not have agent context here if the initial fetch failed,
        // so we can't reliably get qualificationCriteria in the catch block.
        // If qualificationResult exists, use its reason; otherwise, provide a generic failure message.
        const output: SaveLeadOutput = {
          qualificationScore: qualificationResult?.qualificationScore ?? 0,
          qualified: qualificationResult?.qualified ?? false,
          reason: qualificationResult?.reason ?? 'Qualification step failed or was not reached.',
          notificationSent, // Ensure this is part of the error output too
        }

        return {
          success: false,
          output,
          error: errorMessage,
        } as ToolResponse<SaveLeadOutput>
      }
    },
  })
}
