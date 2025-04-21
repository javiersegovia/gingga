import type { availableModelIds } from '@gingga/db/schema'
import type React from 'react'
import type { AgentFormValues } from '../agent.schema'
import { Input } from '@gingga/ui/components/input'
import { Skeleton } from '@gingga/ui/components/skeleton'
import { Textarea } from '@gingga/ui/components/textarea'
import { Suspense } from 'react'
import { useAppForm } from '~/components/form/tanstack-form'
import { SelectAIModel } from '~/components/ui/select-ai-model'
import { availableModels } from '~/features/ai/utils/ai-models'
import { agentFormOptions, AgentFormSchema } from '../agent.schema'

interface AgentFormProps {
  initialValues?: Partial<AgentFormValues>
  isSubmitting?: boolean
  formProps?: React.ComponentProps<'form'>
  onSubmit: (data: AgentFormValues) => Promise<void> | void
}

export function AgentForm({
  initialValues,
  isSubmitting = false,
  formProps,
  onSubmit,
}: AgentFormProps) {
  const form = useAppForm({
    ...agentFormOptions,
    defaultValues: {
      ...agentFormOptions.defaultValues,
      ...initialValues,
    },

    onSubmit: async ({ value, formApi }) => {
      await onSubmit(value)
      formApi.reset()
    },

    validators: {
      onSubmit: AgentFormSchema,
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
      {...formProps}
      className="space-y-4"
    >
      <Suspense
        fallback={(
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}
      >
        <form.AppField
          name="name"
          validators={{
            onChange: AgentFormSchema.shape.name,
          }}
          children={field => (
            <field.FormFieldItem>
              <field.FormFieldLabel>Agent Name</field.FormFieldLabel>
              <field.FormFieldControl>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="e.g., Customer Support Pro"
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
          validators={{
            onChange: AgentFormSchema.shape.description,
          }}
          children={field => (
            <field.FormFieldItem>
              <field.FormFieldLabel>Description</field.FormFieldLabel>
              <field.FormFieldControl>
                <Textarea
                  name={field.name}
                  value={field.state.value ?? ''}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Describe the agent's purpose and capabilities..."
                  rows={4}
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

        {/* Instructions Field */}
        <form.AppField
          name="instructions"
          validators={{
            onChange: AgentFormSchema.shape.instructions,
          }}
          children={field => (
            <field.FormFieldItem>
              <field.FormFieldLabel>Instructions</field.FormFieldLabel>
              <field.FormFieldControl>
                <Textarea
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Define the agent core behavior..."
                  rows={6}
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

        {/* Model Field */}
        <form.AppField
          name="modelId"
          validators={{
            onChange: AgentFormSchema.shape.modelId,
          }}
          children={field => (
            <field.FormFieldItem>
              <field.FormFieldLabel>Model</field.FormFieldLabel>
              <field.FormFieldControl>
                <SelectAIModel
                  models={availableModels}
                  value={field.state.value ?? undefined}
                  isClearable={true}
                  onChange={(value) => {
                    field.handleChange(value as (typeof availableModelIds)[number])
                  }}
                />
              </field.FormFieldControl>
              <field.FormFieldMessage id={`${field.name}-errors`} />
            </field.FormFieldItem>
          )}
        />

        {/* Image Field */}
        <form.AppField
          name="image"
          validators={{
            onChange: AgentFormSchema.shape.image,
          }}
          children={field => (
            <field.FormFieldItem>
              <field.FormFieldLabel>Image URL</field.FormFieldLabel>
              <field.FormFieldControl>
                <Input
                  name={field.name}
                  value={field.state.value ?? ''}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="https://example.com/agent.png"
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
      </Suspense>

      {/* Subscribe to form state for button disable logic */}
      <form.AppForm>
        <form.FormButton variant="primary" size="xl" className="mt-10 w-full">
          {({ isSubmitting }) => (isSubmitting ? 'Saving...' : 'Save Agent')}
        </form.FormButton>
      </form.AppForm>
    </form>
  )
}
