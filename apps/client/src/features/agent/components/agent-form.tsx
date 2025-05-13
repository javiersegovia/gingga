import type React from 'react'
import type { AgentFormValues } from '~/features/agent/agent.schema'
import { Agents } from '@gingga/db/schema'
import { Button } from '@gingga/ui/components/button'
import { Input } from '@gingga/ui/components/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gingga/ui/components/select'
import { Skeleton } from '@gingga/ui/components/skeleton'
import { Switch } from '@gingga/ui/components/switch'
import { Textarea } from '@gingga/ui/components/textarea'
import { formOptions } from '@tanstack/react-form'
import { Trash2Icon } from 'lucide-react'
import { Suspense } from 'react'
import { z } from 'zod'
import { useAppForm } from '~/components/form/tanstack-form'
import { AgentFormSchema } from '~/features/agent/agent.schema'
import { chatSystemPrompt } from '~/server/agents/chat-agent.prompt'
import { leadCaptureSystemPrompt } from '~/server/agents/lead-capture-agent.prompt'
import { videoGeneratorSystemPrompt } from '~/server/agents/video-generator.prompt'

interface AgentFormProps {
  initialValues?: Partial<AgentFormValues>
  isSubmitting?: boolean
  formProps?: React.ComponentProps<'form'>
  onSubmit: (data: AgentFormValues) => Promise<void> | void
}

export const agentFormOptions = formOptions({
  defaultValues: {
    name: '',
    title: null,
    description: null,
    introduction: null,
    instructions: '',
    starters: [],
    modelId: null,
    image: null,
    agentType: Agents.agentType.enumValues[0],
    visibility: Agents.visibility.enumValues[0],
    hasEmailNotifications: false,
  } as AgentFormValues,
  validators: {
    onSubmit: AgentFormSchema,
  },
})

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
    } as AgentFormValues,

    onSubmit: async ({ value, formApi }) => {
      await onSubmit(value)
      formApi.reset()
    },

    validators: {
      onSubmit: AgentFormSchema,
    },
  })

  const getSystemPrompt = (agentType: AgentFormValues['agentType']): string => {
    switch (agentType) {
      case 'lead_capture':
        return leadCaptureSystemPrompt
      case 'video_generator':
        return videoGeneratorSystemPrompt
      case 'chat':
        return chatSystemPrompt
      default:
        return chatSystemPrompt
    }
  }

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
        <div className="space-y-4 rounded-md border p-4">
          <h3 className="text-lg font-medium">Basic</h3>
          <div className="flex flex-col gap-4 md:flex-row">
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
              name="title"
              validators={{
                onChange: AgentFormSchema.shape.title,
              }}
              children={field => (
                <field.FormFieldItem className="flex-1">
                  <field.FormFieldLabel>Title</field.FormFieldLabel>
                  <field.FormFieldControl>
                    <Input
                      name={field.name}
                      value={field.state.value ?? ''}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="e.g., Lead Generation Specialist"
                      aria-invalid={!!field.state.meta.errors.length}
                      aria-describedby={field.state.meta.errors.length ? `${field.name}-errors` : undefined}
                    />
                  </field.FormFieldControl>
                  <field.FormFieldMessage id={`${field.name}-errors`} />
                </field.FormFieldItem>
              )}
            />
          </div>

          {/* Visibility Field */}
          <form.AppField
            name="visibility"
            validators={{
              onChange: AgentFormSchema.shape.visibility,
            }}
            children={field => (
              <field.FormFieldItem>
                <field.FormFieldLabel>Visibility</field.FormFieldLabel>
                <field.FormFieldControl>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={value => field.handleChange(value as AgentFormValues['visibility'])}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger
                      aria-invalid={!!field.state.meta.errors.length}
                      aria-describedby={field.state.meta.errors.length ? `${field.name}-errors` : undefined}
                    >
                      <SelectValue placeholder="Select visibility..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Agents.visibility.enumValues.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </field.FormFieldControl>
                <field.FormFieldDescription>
                  Public agents can be discovered, private agents are only accessible via direct link.
                </field.FormFieldDescription>
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

          {/* Owner Email Field */}
          <form.AppField
            name="ownerEmail"
            validators={{
              onChange: AgentFormSchema.shape.ownerEmail,
            }}
            children={field => (
              <field.FormFieldItem className="flex-1">
                <field.FormFieldLabel>Owner Email</field.FormFieldLabel>
                <field.FormFieldControl>
                  <Input
                    name={field.name}
                    value={field.state.value ?? ''}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Optional: user@example.com"
                    aria-invalid={!!field.state.meta.errors.length}
                    aria-describedby={field.state.meta.errors.length ? `${field.name}-errors` : undefined}
                  />
                </field.FormFieldControl>
                <field.FormFieldDescription>
                  Optionally assign an owner by email. If left blank, the agent will not have a specific owner.
                </field.FormFieldDescription>
                <field.FormFieldMessage id={`${field.name}-errors`} />
              </field.FormFieldItem>
            )}
          />

          {/* Has Email Notifications Field */}
          <form.AppField
            name="hasEmailNotifications"
            mode="value"
            validators={{
              onChange: AgentFormSchema.shape.hasEmailNotifications,
            }}
            children={field => (
              <field.FormFieldItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <field.FormFieldLabel>Email Notifications for New Leads</field.FormFieldLabel>
                  <field.FormFieldDescription>
                    If enabled, the agent owner will receive an email when a new lead is captured by this agent.
                  </field.FormFieldDescription>
                </div>
                <field.FormFieldControl>
                  <Switch
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                    disabled={isSubmitting}
                    aria-invalid={!!field.state.meta.errors.length}
                    aria-describedby={field.state.meta.errors.length ? `${field.name}-errors` : undefined}
                  />
                </field.FormFieldControl>
                <field.FormFieldMessage id={`${field.name}-errors`} />
              </field.FormFieldItem>
            )}
          />
        </div>

        {/* Functionality Section */}
        <div className="space-y-4 rounded-md border p-4">
          <h3 className="text-lg font-medium">Functionality</h3>
          <form.AppField
            name="agentType"
            validators={{
              onChange: AgentFormSchema.shape.agentType,
            }}
            children={field => (
              <field.FormFieldItem>
                <field.FormFieldLabel>Agent Type</field.FormFieldLabel>
                <field.FormFieldControl>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={value => field.handleChange(value as AgentFormValues['agentType'])}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger
                      aria-invalid={!!field.state.meta.errors.length}
                      aria-describedby={
                        field.state.meta.errors.length ? `${field.name}-errors` : undefined
                      }
                    >
                      <SelectValue placeholder="Select agent type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Agents.agentType.enumValues.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </field.FormFieldControl>
                <field.FormFieldMessage id={`${field.name}-errors`} />
                <field.FormFieldDescription>
                  Each agent type comes with a predefined system prompt that will be combined with your custom instructions.
                </field.FormFieldDescription>
              </field.FormFieldItem>
            )}
          />

          {/* System Prompt Display */}
          <form.Subscribe
            selector={state => state.values.agentType}
          >
            {agentType => (
              <div className="space-y-2">
                <div className="text-sm font-medium">System Prompt</div>
                <Textarea
                  value={getSystemPrompt(agentType)}
                  readOnly
                  disabled
                  rows={10}
                  className="bg-muted"
                />
                <p className="text-muted-foreground text-[0.8rem] leading-5">
                  This is the base system prompt for the selected agent type. Your custom instructions below will be combined with this prompt to create the final agent behavior.
                </p>
              </div>
            )}
          </form.Subscribe>

          <form.AppField
            name="instructions"
            validators={{
              onChange: AgentFormSchema.shape.instructions,
            }}
            children={field => (
              <field.FormFieldItem>
                <field.FormFieldLabel>Custom Instructions</field.FormFieldLabel>
                <field.FormFieldControl>
                  <Textarea
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Define additional instructions or override default behavior..."
                    rows={6}
                    aria-invalid={!!field.state.meta.errors.length}
                    aria-describedby={
                      field.state.meta.errors.length ? `${field.name}-errors` : undefined
                    }
                  />
                </field.FormFieldControl>
                <field.FormFieldDescription className="mt-2">
                  These instructions will be combined with the system prompt above to create the final agent behavior.
                </field.FormFieldDescription>
                <field.FormFieldMessage id={`${field.name}-errors`} />
              </field.FormFieldItem>
            )}
          />
        </div>

        {/* Personalization Section */}
        <div className="space-y-4 rounded-md border p-4">
          <h3 className="text-lg font-medium">Personalization</h3>
          <form.AppField
            name="introduction"
            validators={{
              onChange: AgentFormSchema.shape.introduction,
            }}
            children={field => (
              <field.FormFieldItem>
                <field.FormFieldLabel>Introduction Message</field.FormFieldLabel>
                <field.FormFieldControl>
                  <Textarea
                    name={field.name}
                    value={field.state.value ?? ''}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Optional: First message the agent sends (e.g., 'Hi! How can I help you today?')"
                    rows={3}
                    aria-invalid={!!field.state.meta.errors.length}
                    aria-describedby={
                      field.state.meta.errors.length ? `${field.name}-errors` : undefined
                    }
                  />
                </field.FormFieldControl>
                <field.FormFieldDescription>
                  This message will be sent by the agent when a new chat starts.
                </field.FormFieldDescription>
                <field.FormFieldMessage id={`${field.name}-errors`} />
              </field.FormFieldItem>
            )}
          />

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

          <form.AppField name="starters" mode="array">
            {field => (
              <field.FormFieldItem>
                <field.FormFieldLabel>Conversation Starters</field.FormFieldLabel>
                <field.FormFieldDescription>
                  Optional: Suggested prompts for users to start the chat (max 5).
                </field.FormFieldDescription>
                <div className="space-y-2 pt-2">
                  {(field.state.value ?? []).map((_, idx) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={idx} className="flex items-center gap-2">
                      <form.AppField
                        name={`starters[${idx}]`}
                        validators={{ onChange: z.string().min(1, 'Starter cannot be empty') }}
                      >
                        {subField => (
                          <>
                            <subField.FormFieldControl className="flex-1">
                              <Input
                                placeholder={`Starter ${idx + 1}`}
                                name={subField.name}
                                value={subField.state.value ?? ''}
                                onBlur={subField.handleBlur}
                                onChange={e => subField.handleChange(e.target.value)}
                                disabled={isSubmitting}
                                aria-invalid={!!subField.state.meta.errors.length}
                                aria-describedby={subField.state.meta.errors.length ? `${subField.name}-errors` : undefined}
                              />
                            </subField.FormFieldControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => field.removeValue(idx)}
                              disabled={isSubmitting}
                              aria-label="Remove starter"
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                            <subField.FormFieldMessage id={`${subField.name}-errors`} className="col-span-2" />
                          </>
                        )}
                      </form.AppField>
                    </div>
                  ))}
                </div>
                {(field.state.value ?? []).length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => field.pushValue('')}
                    disabled={isSubmitting || (field.state.value ?? []).length >= 5}
                    className="mt-2"
                  >
                    Add Starter
                  </Button>
                )}
                <field.FormFieldMessage />
              </field.FormFieldItem>
            )}
          </form.AppField>
        </div>
      </Suspense>

      <form.AppForm>
        <form.FormButton variant="primary" size="xl" className="mt-10 w-full">
          {({ isSubmitting }) => (isSubmitting ? 'Saving...' : 'Save Agent')}
        </form.FormButton>
      </form.AppForm>
    </form>
  )
}
