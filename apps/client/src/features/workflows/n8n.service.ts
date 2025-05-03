import type { z } from 'zod'

import type {
  DeleteN8NWorkflowByIdInputSchema,
  GetN8NWorkflowByIdInputSchema,
  GetN8NWorkflowExecutionDetailsInputSchema,
  ImportN8NWorkflowInputSchema,
  ListWorkflowsInputSchema,
  SynchronizeN8NWorkflowInput,
  TriggerN8NWorkflowInputSchema,
  UpdateN8NWorkflowByIdInputSchema,
} from './n8n.schema'
import { desc, eq } from '@gingga/db'
import { N8NWorkflows } from '@gingga/db/schema'
import { TRPCError } from '@trpc/server'
import { webEnv } from '~/lib/env.server'
import { getDB } from '~/server/context.server'
import {
  ListWorkflowsOutputSchema,
  N8NExecutionDetailsSchema,
  N8NWorkflowDetailsSchema,
  N8NWorkflowListItemSchema,
} from './n8n.schema'

const N8N_BASE_URL = webEnv.N8N_BASE_URL
const N8N_API_KEY = webEnv.N8N_API_KEY

async function n8nApiRequest<T>(endpoint: string, options: RequestInit = {}, responseSchema?: z.ZodType<T>): Promise<T> {
  if (!N8N_BASE_URL || !N8N_API_KEY) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'n8n API is not configured on the server.',
    })
  }

  const url = `${N8N_BASE_URL.replace(/\/+$/, '')}/api/v1/${endpoint.replace(/^\/+/, '')}`
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    'Accept': 'application/json',
    'X-N8N-API-KEY': N8N_API_KEY,
  }

  let body: BodyInit | null = options.body ?? null

  if (body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof URLSearchParams) && !(body instanceof Blob) && !(body instanceof ArrayBuffer)) {
    try {
      body = JSON.stringify(body)
      headers['Content-Type'] = 'application/json'
    }
    catch (stringifyError) {
      console.error('Failed to stringify request body:', stringifyError)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Invalid request body.' })
    }
  }

  try {
    const response = await fetch(url, { ...options, headers, body })

    if (!response.ok) {
      let errorBody: unknown = null
      try {
        errorBody = await response.json()
      }
      catch (_e) {
        console.warn(`Response body from ${url} was not valid JSON.`)
      }

      console.error(`n8n API Error (${response.status}) on ${options.method || 'GET'} ${url}:`, errorBody ?? response.statusText)

      let message = response.statusText
      if (typeof errorBody === 'object' && errorBody !== null && 'message' in errorBody && typeof errorBody.message === 'string') {
        message = errorBody.message
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `n8n API request failed: ${message}`,
        cause: errorBody,
      })
    }

    if (response.status === 204 || !responseSchema) {
      return { status: response.status } as T
    }

    const data = await response.json()

    const parsed = responseSchema.safeParse(data)
    if (!parsed.success) {
      console.error(`n8n API response validation failed for ${options.method || 'GET'} ${url}:`, parsed.error.errors)
      console.error('Raw response data:', data)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'n8n API response validation failed.',
        cause: parsed.error,
      })
    }

    return parsed.data
  }
  catch (error: unknown) {
    if (error instanceof TRPCError) {
      throw error
    }
    console.error(`Network or other error during n8n API request to ${url}:`, error)
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to communicate with n8n API.',
      cause: error,
    })
  }
}

export async function listAvailableN8NWorkflows(input: z.infer<typeof ListWorkflowsInputSchema>) {
  const queryParams = new URLSearchParams()
  if (input.active !== undefined) {
    queryParams.set('active', String(input.active))
  }
  if (input.tags && input.tags.length > 0) {
    queryParams.set('tags', input.tags.join(','))
  }
  queryParams.set('limit', '-1') // Fetch all

  const endpoint = `workflows?${queryParams.toString()}`

  // 1. Fetch all workflows from n8n API
  const allN8nWorkflows = await n8nApiRequest(endpoint, { method: 'GET' }, ListWorkflowsOutputSchema)

  // 2. Fetch IDs of already imported workflows from DB
  const db = getDB()
  const importedWorkflows = await db
    .select({
      n8nWorkflowId: N8NWorkflows.n8nWorkflowId,
    })
    .from(N8NWorkflows)
    .execute()

  const importedIds = new Set(importedWorkflows.map(wf => wf.n8nWorkflowId))
  const availableWorkflows = allN8nWorkflows.data.filter(wf => !importedIds.has(wf.id))

  return availableWorkflows
}

export async function getN8NWorkflowById(input: z.infer<typeof GetN8NWorkflowByIdInputSchema>) {
  const endpoint = `workflows/${input.id}`
  return await n8nApiRequest(endpoint, { method: 'GET' }, N8NWorkflowDetailsSchema)
}

export async function importN8NWorkflow(input: z.infer<typeof ImportN8NWorkflowInputSchema>) {
  const { n8nWorkflowId } = input

  if (!/^[a-z0-9-]+$/i.test(n8nWorkflowId)) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid n8n Workflow ID format.',
    })
  }

  // Check if workflow already exists in DB
  const db = getDB()
  const existingWorkflow = await db
    .select({ id: N8NWorkflows.id })
    .from(N8NWorkflows)
    .where(eq(N8NWorkflows.n8nWorkflowId, n8nWorkflowId))
    .limit(1)
    .execute()

  if (existingWorkflow.length > 0) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: `Workflow with n8n ID ${n8nWorkflowId} is already imported.`,
    })
  }

  // Fetch workflow details from n8n
  const workflowDetails = await getN8NWorkflowById({ id: n8nWorkflowId })

  console.log('workflowDetails', workflowDetails)

  // Find webhook node to extract webhook URL
  let webhookUrl = ''
  if (workflowDetails.nodes) {
    const webhookNode = workflowDetails.nodes.find(node =>
      node.type === 'n8n-nodes-base.webhook'
      || node.type.toLowerCase().includes('webhook'),
    )

    if (webhookNode?.parameters?.path) {
      // Construct webhook URL
      const path = String(webhookNode.parameters.path).replace(/^\/+/, '')
      webhookUrl = `${N8N_BASE_URL?.replace(/\/+$/, '') ?? ''}/webhook/${path}`
    }
  }

  if (!webhookUrl || !N8N_BASE_URL) {
    console.error('Could not determine webhook URL or N8N_BASE_URL is not set. Webhook Node: ', workflowDetails.nodes?.find(node => node.type.toLowerCase().includes('webhook')))
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Could not find a valid webhook path in the workflow.',
    })
  }

  // Generate input and output schemas using workflow structure
  const { inputSchema, outputSchema } = generateN8NWorkflowSchemas(workflowDetails)

  const [workflow] = await db
    .insert(N8NWorkflows)
    .values({
      n8nWorkflowId,
      name: workflowDetails.name || `Workflow ${n8nWorkflowId}`,
      description: workflowDetails.description || '',
      status: workflowDetails.active ? 'active' : 'inactive',
      webhookUrl,
      inputSchema,
      outputSchema,
      lastSyncAt: new Date(),
    })
    .returning()
    .execute()

  return workflow
}

export async function synchronizeN8NWorkflow(input: SynchronizeN8NWorkflowInput) {
  const { id } = input

  const db = getDB()

  const [existingWorkflow] = await db
    .select({
      id: N8NWorkflows.id,
      n8nWorkflowId: N8NWorkflows.n8nWorkflowId,
    })
    .from(N8NWorkflows)
    .where(eq(N8NWorkflows.id, id))
    .limit(1)
    .execute()

  if (!existingWorkflow) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `Workflow with ID ${id} not found.`,
    })
  }

  const n8nWorkflowId = existingWorkflow.n8nWorkflowId

  const workflowDetails = await getN8NWorkflowById({ id: n8nWorkflowId })

  // Find webhook node to extract webhook URL
  let webhookUrl = ''
  if (workflowDetails.nodes) {
    const webhookNode = workflowDetails.nodes.find(node =>
      node.type === 'n8n-nodes-base.webhook'
      || node.type.toLowerCase().includes('webhook'),
    )

    if (webhookNode?.parameters?.path) {
      // Construct webhook URL
      webhookUrl = `${N8N_BASE_URL}/webhook/${webhookNode.parameters.path}`
    }
  }

  if (!webhookUrl) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'No webhook node found in the workflow after synchronization.',
    })
  }

  // Generate input and output schemas using workflow structure
  const { inputSchema, outputSchema } = generateN8NWorkflowSchemas(workflowDetails)

  // Update workflow in database
  const [updatedWorkflow] = await db
    .update(N8NWorkflows)
    .set({
      name: workflowDetails.name || `Workflow ${n8nWorkflowId}`,
      description: workflowDetails.description || '',
      status: workflowDetails.active ? 'active' : 'inactive',
      webhookUrl,
      inputSchema,
      outputSchema,
      lastSyncAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(N8NWorkflows.id, id))
    .returning()
    .execute()

  return updatedWorkflow
}

/**
 * Extracts input and output JSON schemas for an n8n workflow directly from the
 * 'notes' field of specific trigger (webhook) and response nodes.
 *
 * Assumes the 'notes' field contains a valid JSON string representing a JSON Schema.
 * Throws a TRPCError if parsing fails or notes are missing/invalid.
 *
 * @param workflowDetails - The detailed structure of the n8N workflow.
 * @returns An object containing the extracted input and output schemas as Record<string, unknown>.
 * @throws {TRPCError} If notes are missing, invalid JSON string.
 */
function generateN8NWorkflowSchemas(workflowDetails: z.infer<typeof N8NWorkflowDetailsSchema>): {
  inputSchema: Record<string, unknown>
  outputSchema: Record<string, unknown>
} {
  let inputSchema: Record<string, unknown> = {}
  let outputSchema: Record<string, unknown> = {}

  try {
    // 1. Process Input Schema (Webhook Node)
    const webhookNode = workflowDetails.nodes?.find(
      node => node.type === 'n8n-nodes-base.webhook',
    )
    const inputNotes = webhookNode?.notes

    if (!inputNotes || typeof inputNotes !== 'string') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Workflow ${workflowDetails.id}: Missing or invalid input notes (expected JSON string) on webhook node.`,
      })
    }

    try {
      // Try to parse the JSON
      const parsedSchema = JSON.parse(inputNotes)
      // Basic check: Ensure it's an object after parsing
      if (typeof parsedSchema !== 'object' || parsedSchema === null) {
        throw new Error('Parsed input schema is not an object.')
      }
      inputSchema = parsedSchema
    }
    catch (parseError: unknown) {
      console.error(`Failed to parse input notes JSON for workflow ${workflowDetails.id}:`, parseError, '\nNotes:', inputNotes)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Workflow ${workflowDetails.id}: Failed to parse input schema JSON.`,
        cause: parseError instanceof Error ? parseError.message : String(parseError),
      })
    }

    // 2. Process Output Schema (RespondToWebhook Node)
    const responseNode = workflowDetails.nodes?.find(
      node => node.type === 'n8n-nodes-base.respondToWebhook',
    )
    const outputNotes = responseNode?.notes

    if (!outputNotes || typeof outputNotes !== 'string') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Workflow ${workflowDetails.id}: Missing or invalid output notes (expected JSON string) on respondToWebhook node.`,
      })
    }

    try {
      // Try to parse the JSON
      const parsedSchema = JSON.parse(outputNotes)
      // Basic check: Ensure it's an object after parsing
      if (typeof parsedSchema !== 'object' || parsedSchema === null) {
        throw new Error('Parsed output schema is not an object.')
      }
      outputSchema = parsedSchema
    }
    catch (parseError: unknown) {
      console.error(`Failed to parse output notes JSON for workflow ${workflowDetails.id}:`, parseError, '\nNotes:', outputNotes)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Workflow ${workflowDetails.id}: Failed to parse output schema JSON.`,
        cause: parseError instanceof Error ? parseError.message : String(parseError),
      })
    }
  }
  catch (error: unknown) {
    // Handle TRPCErrors thrown within the try block or other unexpected errors
    if (error instanceof TRPCError) {
      throw error // Re-throw TRPCErrors
    }
    console.error(`Unexpected error processing schemas for workflow ${workflowDetails.id}:`, error)
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `An unexpected error occurred while generating schemas for workflow ${workflowDetails.id}.`,
      cause: error,
    })
  }

  console.log(`Schemas generated for workflow ${workflowDetails.id}: Input schema parsed, Output schema parsed.`)
  return { inputSchema, outputSchema }
}

export async function triggerN8NWorkflow(input: z.infer<typeof TriggerN8NWorkflowInputSchema>) {
  const { workflowId, data } = input

  const db = getDB()
  const workflowRecord = await db
    .select({
      webhookUrl: N8NWorkflows.webhookUrl,
    })
    .from(N8NWorkflows)
    .where(eq(N8NWorkflows.n8nWorkflowId, workflowId))
    .limit(1)
    .execute()

  if (!workflowRecord || workflowRecord.length === 0 || !workflowRecord[0].webhookUrl) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `Workflow with ID ${workflowId} not found or has no configured webhook.`,
    })
  }

  const webhookUrl = workflowRecord[0].webhookUrl

  // 2. Call the webhook URL directly
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-N8N-API-KEY': N8N_API_KEY,
      },
      body: JSON.stringify(data ?? {}),
    })

    if (!response.ok) {
      let errorBody: unknown = null
      try {
        errorBody = await response.json()
      }
      catch (_e) {}

      console.error(`Webhook call failed (${response.status}) for ${webhookUrl}:`, errorBody ?? response.statusText)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Webhook call failed: ${response.statusText}`,
        cause: errorBody,
      })
    }

    return { success: true, status: response.status }
  }
  catch (error: unknown) {
    if (error instanceof TRPCError) {
      throw error
    }
    console.error(`Error calling webhook ${webhookUrl}:`, error)
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to trigger workflow via webhook.',
      cause: error,
    })
  }
}

export async function getN8nWorkflowExecutionDetails(input: z.infer<typeof GetN8NWorkflowExecutionDetailsInputSchema>) {
  const endpoint = `executions/${input.executionId}`
  try {
    return await n8nApiRequest(endpoint, { method: 'GET' }, N8NExecutionDetailsSchema)
  }
  catch (error: unknown) {
    if (error instanceof TRPCError) {
      throw error
    }
    console.error('Unexpected error in getExecutionDetails:', error)
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to retrieve execution details.' })
  }
}

export async function getN8NWorkflowDetails(input: z.infer<typeof GetN8NWorkflowByIdInputSchema>) {
  const { id } = input
  const db = getDB()

  const workflow = await db
    .select()
    .from(N8NWorkflows)
    .where(eq(N8NWorkflows.id, id))
    .limit(1)
    .execute()

  if (!workflow.length) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `Workflow with ID ${id} not found in the database.`,
    })
  }

  return workflow[0]
}

export async function updateN8NWorkflowById(input: z.infer<typeof UpdateN8NWorkflowByIdInputSchema>) {
  const { id, ...updateData } = input
  const db = getDB()

  if (Object.keys(updateData).length === 0) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'No fields provided for update.',
    })
  }

  const [updatedWorkflow] = await db
    .update(N8NWorkflows)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(eq(N8NWorkflows.id, id))
    .returning()
    .execute()

  if (!updatedWorkflow) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `Workflow with ID ${id} not found for update.`,
    })
  }

  return updatedWorkflow
}

export async function deleteN8NWorkflowById(input: z.infer<typeof DeleteN8NWorkflowByIdInputSchema>) {
  const { id } = input
  const db = getDB()

  const [deletedWorkflow] = await db
    .delete(N8NWorkflows)
    .where(eq(N8NWorkflows.id, id))
    .returning({ deletedId: N8NWorkflows.id })
    .execute()

  if (!deletedWorkflow) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `Workflow with ID ${id} not found for deletion.`,
    })
  }

  return { success: true, deletedId: deletedWorkflow.deletedId }
}

/**
 * List all imported n8n workflows from our database.
 */
export async function listImportedN8NWorkflows() {
  const db = getDB()
  const workflows = await db
    .select()
    .from(N8NWorkflows)
    .orderBy(desc(N8NWorkflows.createdAt))
    .execute()
  return workflows
}
