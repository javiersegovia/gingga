import type { z } from 'zod' // External

import { adminProcedure, protectedProcedure, router } from '../../server/trpc'
import {
  DeleteN8NWorkflowByIdInputSchema,
  GetN8NWorkflowByIdInputSchema,
  GetN8NWorkflowExecutionDetailsInputSchema,
  ImportN8NWorkflowInputSchema,
  ListWorkflowsInputSchema,
  SynchronizeN8NWorkflowInputSchema,
  TriggerN8NWorkflowInputSchema,
  UpdateN8NWorkflowByIdInputSchema,
} from './n8n.schema'

import {
  deleteN8NWorkflowById,
  getN8NWorkflowById,
  getN8NWorkflowDetails,
  getN8nWorkflowExecutionDetails,
  importN8NWorkflow,
  listAvailableN8NWorkflows,
  listImportedN8NWorkflows,
  synchronizeN8NWorkflow,
  triggerN8NWorkflow,
  updateN8NWorkflowById,
} from './n8n.service'

export const n8nRouter = router({
  /**
   * List available (unimported) n8n workflows from the n8n API.
   */
  listAvailableN8NWorkflows: protectedProcedure
    .input(ListWorkflowsInputSchema)
    .query(async ({ input }: { input: z.infer<typeof ListWorkflowsInputSchema> }) => {
      return await listAvailableN8NWorkflows(input)
    }),

  /**
   * List all imported n8n workflows from our database.
   */
  listImportedN8NWorkflows: adminProcedure.query(async () => {
    return await listImportedN8NWorkflows()
  }),

  /**
   * Get details for a specific n8n workflow directly from the n8n API.
   */
  getN8NWorkflowById: protectedProcedure
    .input(GetN8NWorkflowByIdInputSchema)
    .query(async ({ input }: { input: z.infer<typeof GetN8NWorkflowByIdInputSchema> }) => {
      return await getN8NWorkflowById(input)
    }),

  /**
   * Import a workflow from n8n into our database by its n8n ID.
   */
  importN8NWorkflow: adminProcedure
    .input(ImportN8NWorkflowInputSchema)
    .mutation(async ({ input }: { input: z.infer<typeof ImportN8NWorkflowInputSchema> }) => {
      return await importN8NWorkflow(input)
    }),

  /**
   * Synchronize an imported workflow (in our DB) with the latest data from n8n.
   */
  synchronizeN8NWorkflow: adminProcedure
    .input(SynchronizeN8NWorkflowInputSchema)
    .mutation(async ({ input }: { input: z.infer<typeof SynchronizeN8NWorkflowInputSchema> }) => {
      return await synchronizeN8NWorkflow(input)
    }),

  /**
   * Get details for an imported workflow from our database.
   */
  getN8NWorkflowDetails: protectedProcedure
    .input(GetN8NWorkflowByIdInputSchema)
    .query(async ({ input }: { input: z.infer<typeof GetN8NWorkflowByIdInputSchema> }) => {
      return await getN8NWorkflowDetails(input)
    }),

  /**
   * Update editable fields (e.g., name, description) for an imported workflow in our database.
   */
  updateN8NWorkflowById: adminProcedure
    .input(UpdateN8NWorkflowByIdInputSchema)
    .mutation(async ({ input }: { input: z.infer<typeof UpdateN8NWorkflowByIdInputSchema> }) => {
      return await updateN8NWorkflowById(input)
    }),

  /**
   * Delete an imported workflow from our database.
   */
  deleteN8NWorkflowById: adminProcedure
    .input(DeleteN8NWorkflowByIdInputSchema)
    .mutation(async ({ input }: { input: z.infer<typeof DeleteN8NWorkflowByIdInputSchema> }) => {
      return await deleteN8NWorkflowById(input)
    }),

  /**
   * Trigger an n8n workflow run via its webhook.
   */
  triggerN8NWorkflow: protectedProcedure
    .input(TriggerN8NWorkflowInputSchema)
    .mutation(async ({ input }: { input: z.infer<typeof TriggerN8NWorkflowInputSchema> }) => {
      return await triggerN8NWorkflow(input)
    }),

  /**
   * Get execution details for a specific n8n workflow run from the n8n API.
   */
  getN8NWorkflowExecutionDetails: protectedProcedure
    .input(GetN8NWorkflowExecutionDetailsInputSchema)
    .query(async ({ input }: { input: z.infer<typeof GetN8NWorkflowExecutionDetailsInputSchema> }) => {
      return await getN8nWorkflowExecutionDetails(input)
    }),
})
