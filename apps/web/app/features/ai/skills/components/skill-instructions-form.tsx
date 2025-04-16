/**
 * SkillInstructionsForm - Form for editing instructions for an AgentSkill.
 * Uses TanStack Form and ShadcnUI components.
 * Does not close the modal on save.
 */
import React from 'react'
import { useAppForm } from '@/components/form/tanstack-form'
import { useCreateSkillMutation, useUpdateSkillById } from '../skill.query'
import type { SkillOption } from '../skill.types'
import type { AgentSkill } from '@/db/types'
import { Button } from '@gingga/ui/components/button'
import { Textarea } from '@gingga/ui/components/textarea'

interface SkillInstructionsFormProps {
  mode: 'create' | 'edit'
  agentId: string
  skillOption?: Required<SkillOption>
  agentSkill?: AgentSkill
  onClose: () => void
}

export default function SkillInstructionsForm({
  mode,
  agentId,
  skillOption,
  agentSkill,
  onClose,
}: SkillInstructionsFormProps) {
  const createMutation = useCreateSkillMutation()
  const updateMutation = useUpdateSkillById()

  const initialInstructions = agentSkill?.instructions ?? ''

  const form = useAppForm({
    defaultValues: {
      instructions: initialInstructions,
    },
    onSubmit: async ({ value }) => {
      if (!skillOption) return
      if (mode === 'create') {
        await createMutation.mutateAsync({
          data: {
            agentId,
            skillId: skillOption.id,
            composioIntegrationAppName:
              skillOption.integration?.integrationAppName ?? undefined,
            composioToolNames: [],
            variables: {},
            instructions: value.instructions,
            tools: [],
            isEnabled: true,
            version: skillOption.version,
          },
        })
      } else if (agentSkill) {
        await updateMutation.mutateAsync({
          data: {
            id: agentSkill.id,
            instructions: value.instructions,
          },
        })
      }
    },
    // Optionally add validation schema here
    // validators: {
    //   onSubmit: InstructionsSchema // Example if you create a Zod schema
    // }
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
      className="space-y-4"
    >
      <form.AppField
        name="instructions"
        // Add validators if needed, e.g., using a Zod schema
        // validators={{ onChange: InstructionsSchema.shape.instructions }}
        children={(field) => (
          <field.FormFieldItem>
            <field.FormFieldLabel>Instructions</field.FormFieldLabel>
            <field.FormFieldControl>
              <Textarea
                name={field.name}
                placeholder="Write instructions for this skill. Use {{variableName}} to reference variables."
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={6}
                aria-invalid={!!field.state.meta.errors.length}
                aria-describedby={
                  field.state.meta.errors.length ? `${field.name}-errors` : undefined
                }
              />
            </field.FormFieldControl>
            <div className="text-muted-foreground mt-1 text-xs">
              Use <code>{'{{variableName}}'}</code> to reference variables in your
              instructions.
            </div>
            <field.FormFieldMessage id={`${field.name}-errors`} />
          </field.FormFieldItem>
        )}
      />
      {/* Use form.AppForm and form.FormButton to access form state */}
      <form.AppForm>
        <form.FormButton type="submit">
          {({ isSubmitting }) =>
            isSubmitting || createMutation.isPending || updateMutation.isPending
              ? 'Saving...'
              : 'Save Instructions'
          }
        </form.FormButton>
        {/* Optionally show status messages based on form state */}
        {/* {form.state.submissionAttempts > 0 && form.state.status === 'success' && (
          <div className="text-green-600">Saved!</div>
        )}
         {form.state.error && (
          <div className="text-red-600">Error: {form.state.error.message}</div>
        )} */}
      </form.AppForm>
    </form>
  )
}
