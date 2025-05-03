import type { TRPCClientErrorLike } from '@trpc/client'

import type { Route } from './+types/$workflowId'
import type { N8NWorkflowFormValues } from '~/features/workflows/n8n.schema'
import type { TRPCAppRouter } from '~/server/trpc/routers/app.router'
import { Button } from '@gingga/ui/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@gingga/ui/components/card'
import { Input } from '@gingga/ui/components/input'
import { Label } from '@gingga/ui/components/label'
import { Switch } from '@gingga/ui/components/switch'
import { Textarea } from '@gingga/ui/components/textarea'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { ExternalLinkIcon, RefreshCcwIcon } from 'lucide-react'
import { Suspense, useState } from 'react'
import { toast } from 'sonner'
import { useAppForm } from '~/components/form/tanstack-form'
import { N8NWorkflowFormSchema } from '~/features/workflows/n8n.schema'
import { webEnv } from '~/lib/env.server'
import { useTRPC } from '~/lib/trpc/react'
import { getQueryClient, getTRPCProxy } from '~/server/context.server'

export async function loader({ params: { workflowId } }: Route.ComponentProps) {
  if (!workflowId) {
    throw new Error('Workflow ID is missing.')
  }

  const queryClient = getQueryClient()
  const trpc = getTRPCProxy()
  const workflow = await queryClient.fetchQuery(trpc.n8n.getN8NWorkflowDetails.queryOptions({ id: workflowId }))

  return { workflowId, workflowUrl: `${webEnv.N8N_BASE_URL}/workflow/${workflow.n8nWorkflowId}` }
}

function WorkflowDetailsContent({ workflowId, workflowUrl }: { workflowId: string, workflowUrl: string }) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const workflowQuery = useSuspenseQuery(trpc.n8n.getN8NWorkflowDetails.queryOptions({ id: workflowId }))
  const workflow = workflowQuery.data

  const updateMutation = useMutation(trpc.n8n.updateN8NWorkflowById.mutationOptions({
    onSuccess: (updatedWorkflow) => {
      toast.success(`Workflow "${updatedWorkflow.name}" updated successfully.`)
      queryClient.setQueryData(trpc.n8n.getN8NWorkflowDetails.queryKey({ id: workflowId }), updatedWorkflow)
      void queryClient.invalidateQueries({ queryKey: trpc.n8n.listImportedN8NWorkflows.queryKey() })
    },
    onError: (error: TRPCClientErrorLike<TRPCAppRouter>) => {
      toast.error(`Update failed: ${error.message}`)
    },
  }))

  const form = useAppForm({
    defaultValues: {
      name: workflow.name ?? '',
      description: workflow.description ?? '',
      status: workflow.status ?? 'error',
      webhookUrl: workflow.webhookUrl ?? '',
      inputSchema: workflow.inputSchema ?? {},
      outputSchema: workflow.outputSchema ?? {},
    } as N8NWorkflowFormValues,

    onSubmit: async ({ value }: { value: N8NWorkflowFormValues }) => {
      updateMutation.mutate({ id: workflowId, ...value })
    },
  })

  const synchronizeMutation = useMutation(trpc.n8n.synchronizeN8NWorkflow.mutationOptions({
    onSuccess: (syncedWorkflow) => {
      toast.success(`Workflow "${syncedWorkflow.name}" synchronized successfully.`)
      queryClient.setQueryData(trpc.n8n.getN8NWorkflowDetails.queryKey({ id: workflowId }), syncedWorkflow)
      void queryClient.invalidateQueries({ queryKey: trpc.n8n.listImportedN8NWorkflows.queryKey() })
      form.reset()
    },

    onError: (error: TRPCClientErrorLike<TRPCAppRouter>) => {
      toast.error(`Synchronization failed: ${error.message}`)
    },
  }))

  const handleSync = () => {
    synchronizeMutation.mutate({ id: workflowId })
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{workflow.name ?? 'Workflow Details'}</h1>
          <p className="text-muted-foreground">Edit workflow details and view generated schemas.</p>
        </div>
        <div className="flex items-center space-x-2">
          {workflow.webhookUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={workflowUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLinkIcon className="mr-2 h-4 w-4" />
                Open in n8n
              </a>
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={handleSync} disabled={synchronizeMutation.isPending}>
            <RefreshCcwIcon className={`mr-2 h-4 w-4 ${synchronizeMutation.isPending ? 'animate-spin' : ''}`} />
            {synchronizeMutation.isPending ? 'Syncing...' : 'Synchronize'}
          </Button>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
        className="space-y-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>Update the name and description stored in Gingga.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form.AppField
              name="name"
              validators={{ onChange: N8NWorkflowFormSchema.shape.name }}
              children={field => (
                <field.FormFieldItem>
                  <field.FormFieldLabel>Name</field.FormFieldLabel>
                  <field.FormFieldControl>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      aria-invalid={!!field.state.meta.errors.length}
                      aria-describedby={
                        field.state.meta.errors.length ? `${field.name}-errors` : undefined
                      }
                    />
                  </field.FormFieldControl>
                  <field.FormFieldMessage id={`${field.name}-errors`} />
                </field.FormFieldItem>
              )}
            />
            <form.AppField
              name="description"
              validators={{ onChange: N8NWorkflowFormSchema.shape.description }}
              children={field => (
                <field.FormFieldItem>
                  <field.FormFieldLabel>Description</field.FormFieldLabel>
                  <field.FormFieldControl>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value ?? ''}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      rows={3}
                      aria-invalid={!!field.state.meta.errors.length}
                      aria-describedby={
                        field.state.meta.errors.length ? `${field.name}-errors` : undefined
                      }
                    />
                  </field.FormFieldControl>
                  <field.FormFieldMessage id={`${field.name}-errors`} />
                </field.FormFieldItem>
              )}
            />
            {/* Add other fields here if needed */}
            <Button type="submit" disabled={!form.state.canSubmit || updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schemas</CardTitle>
            <CardDescription>Input and output schemas generated based on the n8n workflow structure.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SchemaDisplay title="Input Schema" schema={workflow.inputSchema} />
            <SchemaDisplay title="Output Schema" schema={workflow.outputSchema} />
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

// Enhanced display for schema with toggle
interface JsonSchema {
  type?: string
  properties?: Record<string, JsonSchemaProperty>
  required?: string[]
  items?: JsonSchema
  // Add other potential JSON Schema fields if needed
}

interface JsonSchemaProperty extends JsonSchema {
  description?: string
}

function SchemaDisplay({ title, schema }: { title: string, schema: unknown }) {
  const [showRaw, setShowRaw] = useState(false)

  const renderFormattedSchema = (schemaData: unknown): React.ReactNode => {
    if (!schemaData || typeof schemaData !== 'object' || Object.keys(schemaData).length === 0) {
      return <p className="text-muted-foreground text-sm">Schema not available or empty.</p>
    }

    try {
      // Attempt to ensure it's a JS object if it was stringified somewhere
      const parsedSchema = typeof schemaData === 'string' ? JSON.parse(schemaData) : schemaData as JsonSchema

      if (parsedSchema.type === 'object' && parsedSchema.properties) {
        return (
          <ul className="space-y-2 text-sm">
            {Object.entries(parsedSchema.properties).map(([key, prop]) => (
              <li key={key} className="flex items-start space-x-2">
                <span className="font-medium text-foreground">
                  {key}
                  :
                </span>
                <span className="text-muted-foreground">
                  {prop && typeof prop === 'object' && 'type' in prop && prop.type}
                  {parsedSchema.required?.includes(key) && <span className="ml-1 text-red-500">*</span>}
                  {prop && typeof prop === 'object' && 'description' in prop && typeof prop.description === 'string' && (
                    <span className="ml-1 italic">
                      (
                      {prop.description}
                      )
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )
      }

      // Handle other schema types (e.g., array) or basic display
      return (
        <p className="text-sm">
          Non-object schema type:
          {parsedSchema.type || 'Unknown'}
        </p>
      )
    }
    catch (error) {
      console.error('Error parsing schema for formatted display:', error)
      return <p className="text-destructive text-sm">Error displaying formatted schema.</p>
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">{title}</h4>
        <div className="flex items-center space-x-2">
          <Switch
            id={`${title}-toggle`}
            checked={showRaw}
            onCheckedChange={setShowRaw}
          />
          <Label htmlFor={`${title}-toggle`} className="text-sm">
            Show RAW
          </Label>
        </div>
      </div>
      {showRaw ? (
        <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto">
          {schema ? JSON.stringify(schema, null, 2) : 'Not generated.'}
        </pre>
      ) : (
        <div className="p-4 border bg-background rounded-md">
          {renderFormattedSchema(schema)}
        </div>
      )}
    </div>
  )
}

export default function WorkflowDetailsRoute({ loaderData: { workflowId, workflowUrl } }: Route.ComponentProps) {
  return (
    <Suspense fallback={<WorkflowDetailsSkeleton />}>
      <WorkflowDetailsContent workflowId={workflowId} workflowUrl={workflowUrl} />
    </Suspense>
  )
}

function WorkflowDetailsSkeleton() {
  return (
    <div className="p-8 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-4 w-64 bg-muted rounded mt-2" />
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-24 bg-muted rounded" />
          <div className="h-8 w-24 bg-muted rounded" />
        </div>
      </div>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="h-6 w-24 bg-muted rounded" />
            <div className="h-4 w-48 bg-muted rounded mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-10 bg-muted rounded" />
            <div className="h-24 bg-muted rounded" />
            <div className="h-9 w-24 bg-muted rounded" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-6 w-24 bg-muted rounded" />
            <div className="h-4 w-64 bg-muted rounded mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-32 bg-muted rounded" />
            <div className="h-32 bg-muted rounded" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
