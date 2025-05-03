import { z } from 'zod'

export const N8NWorkflowListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  active: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  description: z.string().optional(),
  tags: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .optional(),
})
export type N8NWorkflowListItem = z.infer<typeof N8NWorkflowListItemSchema>

export const ListWorkflowsInputSchema = z.object({
  active: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
})
export type ListWorkflowsInput = z.infer<typeof ListWorkflowsInputSchema>

export const ListWorkflowsOutputSchema = z.object({
  data: z.array(N8NWorkflowListItemSchema),
  nextCursor: z.string().optional().nullable(),
})

export const N8NWorkflowDetailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  description: z.string().optional(),
  tags: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .optional(),
  nodes: z.array(z.any()).optional(),
  connections: z.any(),
  settings: z.any(),
  staticData: z.any(),
})
export type N8NWorkflowDetails = z.infer<typeof N8NWorkflowDetailsSchema>

export const TriggerN8NWorkflowInputSchema = z.object({
  workflowId: z.string(),
  data: z.record(z.any()).optional(),
})
export type TriggerN8NWorkflowInput = z.infer<typeof TriggerN8NWorkflowInputSchema>

export const TriggerN8NWorkflowOutputSchema = z.object({
  message: z.string().optional(),
  executionId: z.string().optional(),
  runId: z.string().optional(),
})

export const GetN8NWorkflowExecutionDetailsInputSchema = z.object({
  executionId: z.string(),
})
export type GetN8NWorkflowExecutionDetailsInput = z.infer<typeof GetN8NWorkflowExecutionDetailsInputSchema>

export const N8NExecutionDetailsSchema = z.object({
  id: z.string(),
  finished: z.boolean(),
  mode: z.string(),
  retryOf: z.string().nullable(),
  retrySuccessId: z.string().nullable(),
  startedAt: z.string(),
  stoppedAt: z.string().nullable(),
  workflowId: z.string(),
  workflowData: z.any(),
  data: z.any(),
})
export type N8NExecutionDetails = z.infer<typeof N8NExecutionDetailsSchema>

export const ImportN8NWorkflowInputSchema = z.object({
  n8nWorkflowId: z.string().nonempty('n8n Workflow ID is required'),
})
export type ImportN8NWorkflowInput = z.infer<typeof ImportN8NWorkflowInputSchema>

export const SynchronizeN8NWorkflowInputSchema = z.object({
  id: z.string().nonempty('Workflow ID is required'),
})
export type SynchronizeN8NWorkflowInput = z.infer<typeof SynchronizeN8NWorkflowInputSchema>

export const GetN8NWorkflowByIdInputSchema = z.object({
  id: z.string().nonempty('Workflow ID is required'),
})
export type GetN8NWorkflowByIdInput = z.infer<typeof GetN8NWorkflowByIdInputSchema>

export const UpdateN8NWorkflowByIdInputSchema = z.object({
  id: z.string().nonempty('Workflow ID is required'),
  name: z.string().min(1, 'Workflow name is required').optional(),
  description: z.string().nullable().optional(),
})
export type UpdateN8NWorkflowByIdInput = z.infer<typeof UpdateN8NWorkflowByIdInputSchema>

export const DeleteN8NWorkflowByIdInputSchema = z.object({
  id: z.string().nonempty('Workflow ID is required'),
})
export type DeleteN8NWorkflowByIdInput = z.infer<typeof DeleteN8NWorkflowByIdInputSchema>

export const N8NWorkflowFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Workflow name is required'),
  description: z.string().nullable().optional(),
  status: z.enum(['active', 'inactive', 'error']),
  webhookUrl: z.string().url('Must be a valid URL'),
  inputSchema: z.record(z.any()).optional(),
  outputSchema: z.record(z.any()).optional(),
})
export type N8NWorkflowFormValues = z.infer<typeof N8NWorkflowFormSchema>
