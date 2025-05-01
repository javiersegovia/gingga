import { z } from 'zod'

export const N8nWorkflowListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  active: z.boolean(),
  tags: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})
export type N8nWorkflowListItem = z.infer<typeof N8nWorkflowListItemSchema>

export const ListWorkflowsInputSchema = z.object({
  tags: z.array(z.string()).optional().describe('Filter by tag names (exact match)'),
  active: z.boolean().optional().describe('Filter by active status'),
})
export type ListWorkflowsInput = z.infer<typeof ListWorkflowsInputSchema>

export const ListWorkflowsOutputSchema = z.object({
  data: z.array(N8nWorkflowListItemSchema),
})

export const GetWorkflowDetailsInputSchema = z.object({
  workflowId: z.string(),
})
export type GetWorkflowDetailsInput = z.infer<typeof GetWorkflowDetailsInputSchema>

export const N8nWorkflowDetailsSchema = N8nWorkflowListItemSchema.extend({
  nodes: z.array(z.any()).optional(),
  connections: z.any().optional(),
  settings: z.any().optional(),
  staticData: z.any().optional(),
})
export type N8nWorkflowDetails = z.infer<typeof N8nWorkflowDetailsSchema>

export const TriggerWorkflowInputSchema = z.object({
  workflowId: z.string(),
  data: z.record(z.any()).optional().describe('Input data for the workflow trigger'),
})
export type TriggerWorkflowInput = z.infer<typeof TriggerWorkflowInputSchema>

export const TriggerWorkflowOutputSchema = z.object({
  message: z.string().optional(),
  executionId: z.string().optional(),
  runId: z.string().optional(),
})

export const GetExecutionDetailsInputSchema = z.object({
  executionId: z.string(),
})
export type GetExecutionDetailsInput = z.infer<typeof GetExecutionDetailsInputSchema>

export const N8nExecutionDetailsSchema = z.object({
  id: z.string(),
  workflowId: z.string(),
  status: z.enum(['waiting', 'running', 'success', 'failed', 'unknown']),
  startedAt: z.string().datetime().optional(),
  finishedAt: z.string().datetime().optional().nullable(),
  mode: z.string().optional(),
  data: z.any().optional(),
})
export type N8nExecutionDetails = z.infer<typeof N8nExecutionDetailsSchema>
