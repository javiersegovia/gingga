import type { CoreMessage } from 'ai'
import { generateObject } from 'ai'
import { z } from 'zod'
import { modelProvider } from '~/lib/ai/providers'

// Define the input for the qualification function
const qualifyInputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  topic: z.string(),
  qualificationCriteria: z.string().describe('The criteria to qualify the lead against.'),
})

type QualifyInput = z.infer<typeof qualifyInputSchema>

// Define the output structure for the qualification function
export interface QualifyLeadResult {
  qualificationScore: number // e.g., 0-100
  qualified: boolean // Simple boolean based on score threshold
  reason: string // Explanation from the LLM
}

/**
 * Qualifies a lead using an LLM based on provided details and criteria.
 * @param input - Lead details and qualification criteria.
 * @returns Qualification result.
 */
export async function qualifyLead(input: QualifyInput): Promise<QualifyLeadResult> {
  const { qualificationCriteria, ...leadDetails } = qualifyInputSchema.parse(input)

  const userMessage: CoreMessage = {
    role: 'user',
    content: [
      {
        type: 'text',
        text: `Lead Information:\n${JSON.stringify(leadDetails, null, 2)}`,
      },
    ],
  }

  const qualificationSystemPrompt = `
You are an expert lead qualification assistant.
Your task is to evaluate the provided lead information against the given criteria and determine if the lead is qualified.
Respond ONLY with a JSON object containing 'qualificationScore' (0-100), and 'qualified' (boolean).
Do not include any other text or markdown formatting.

Qualification Criteria:
${qualificationCriteria}`.trim()

  try {
    const { object } = await generateObject({
      model: modelProvider.languageModel('qualify-lead'),
      system: qualificationSystemPrompt,
      messages: [userMessage],
      temperature: 0.25, // Lower temperature for more deterministic JSON output
      schema: z.object({
        qualificationScore: z.number().describe('The score of the lead based on the qualification criteria. 0-100'),
        qualified: z.boolean().describe('Whether the lead is qualified based on the qualification criteria.'),
        reason: z.string().describe('The reason for the qualification score.'),
      }),
    })

    return object
  }
  catch (error) {
    console.error('Error during lead qualification LLM call:', error)
    // Return a default unqualified state in case of error
    return {
      qualificationScore: 0,
      qualified: false,
      reason: `Failed to qualify lead due to an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}
