// Sibling Type Imports (alphabetized)
import type {
  GetExecutionDetailsInputSchema,
  GetWorkflowDetailsInputSchema,
  ListWorkflowsInputSchema,
  TriggerWorkflowInputSchema,
} from './n8n.schema'
import { eq } from '@gingga/db'

import { N8nWorkflows } from '@gingga/db/schema'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { webEnv } from '~/lib/env.server'
import { getDB } from '~/server/context.server'
import {
  N8nExecutionDetailsSchema,
  N8nWorkflowDetailsSchema,
  N8nWorkflowListItemSchema,
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

export async function listWorkflows(input: z.infer<typeof ListWorkflowsInputSchema>) {
  const queryParams = new URLSearchParams()
  if (input.active !== undefined) {
    queryParams.set('active', String(input.active))
  }
  if (input.tags && input.tags.length > 0) {
    queryParams.set('tags', input.tags.join(','))
  }
  queryParams.set('limit', '-1')

  const endpoint = `workflows?${queryParams.toString()}`

  const responseSchema = z.array(N8nWorkflowListItemSchema)

  const workflows = await n8nApiRequest(endpoint, { method: 'GET' }, responseSchema)
  return { data: workflows }
}

export async function getN8NWorkflowById(input: z.infer<typeof GetWorkflowDetailsInputSchema>) {
  const endpoint = `workflows/${input.workflowId}`
  return await n8nApiRequest(endpoint, { method: 'GET' }, N8nWorkflowDetailsSchema)
}

export async function triggerWorkflow(input: z.infer<typeof TriggerWorkflowInputSchema>) {
  const { workflowId, data } = input

  const db = getDB()
  const workflowRecord = await db
    .select({
      webhookUrl: N8nWorkflows.webhookUrl,
    })
    .from(N8nWorkflows)
    .where(eq(N8nWorkflows.n8nWorkflowId, workflowId))
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

export async function getN8nWorkflowExecutionDetails(input: z.infer<typeof GetExecutionDetailsInputSchema>) {
  const endpoint = `executions/${input.executionId}`
  try {
    return await n8nApiRequest(endpoint, { method: 'GET' }, N8nExecutionDetailsSchema)
  }
  catch (error: unknown) {
    if (error instanceof TRPCError) {
      throw error
    }
    console.error('Unexpected error in getExecutionDetails:', error)
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to retrieve execution details.' })
  }
}
