import type { z } from 'zod' // External

// Parent Imports (Corrected path and names based on trpc/index.ts)
import { protectedProcedure, router } from '../../server/trpc' // Import 'router' and 'protectedProcedure'

// Sibling Value Imports (Schemas - used for input validation and type inference)
import {
  GetExecutionDetailsInputSchema,
  GetWorkflowDetailsInputSchema,
  ListWorkflowsInputSchema,
  TriggerWorkflowInputSchema,
} from './n8n.schema'

// Sibling Service Imports (Service functions)
import {
  getN8NWorkflowById,
  getN8nWorkflowExecutionDetails,
  listWorkflows,
  triggerWorkflow,
} from './n8n.service'

export const n8nRouter = router({
  /**
   * List n8n workflows
   */
  list: protectedProcedure
    .input(ListWorkflowsInputSchema) // Use schema directly as value
    .query(async ({ input }: { input: z.infer<typeof ListWorkflowsInputSchema> }) => {
      return await listWorkflows(input)
    }),

  /**
   * Get details for a specific n8n workflow
   */
  getDetails: protectedProcedure // Renamed from getById for clarity
    .input(GetWorkflowDetailsInputSchema) // Use schema directly as value
    .query(async ({ input }: { input: z.infer<typeof GetWorkflowDetailsInputSchema> }) => {
      return await getN8NWorkflowById(input)
    }),

  /**
   * Trigger an n8n workflow run
   */
  trigger: protectedProcedure
    .input(TriggerWorkflowInputSchema) // Use schema directly as value
    .mutation(async ({ input }: { input: z.infer<typeof TriggerWorkflowInputSchema> }) => {
      return await triggerWorkflow(input)
    }),

  /**
   * Get details for a specific n8n workflow execution
   */
  getExecution: protectedProcedure
    .input(GetExecutionDetailsInputSchema) // Use schema directly as value
    .query(async ({ input }: { input: z.infer<typeof GetExecutionDetailsInputSchema> }) => {
      return await getN8nWorkflowExecutionDetails(input)
    }),
})
