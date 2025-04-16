/**
 * SkillToolsForm - Form for selecting tools for an AgentSkill.
 * Uses TanStack Form and ShadcnUI components.
 * Does not close the modal on save.
 */
import React from 'react'
import { useAppForm } from '@/components/form/tanstack-form'
import { useCreateSkillMutation, useUpdateSkillById } from '../skill.query'
import type { SkillOption, ToolName } from '../skill.types'
import type { AgentSkill } from '@/db/types'
import { Button } from '@gingga/ui/components/button'
import { Checkbox } from '@gingga/ui/components/checkbox'

interface SkillToolsFormProps {
  mode: 'create' | 'edit'
  agentId: string
  skillOption?: SkillOption
  agentSkill?: AgentSkill
  onClose: () => void
}

export default function SkillToolsForm({
  mode,
  agentId,
  skillOption,
  agentSkill,
  onClose,
}: SkillToolsFormProps) {
  const { mutateAsync: createSkill, isPending: isCreating } = useCreateSkillMutation()
  const { mutateAsync: updateSkill, isPending: isUpdating } = useUpdateSkillById()

  const availableTools = skillOption?.integration?.availableComposioToolNames ?? []
  const initialTools = agentSkill?.tools ?? []

  const form = useAppForm({
    defaultValues: {
      tools: initialTools as ToolName[], // Assert initial type
    },
    onSubmit: async ({ value }) => {
      if (!skillOption) return
      const submittedTools = value.tools as ToolName[] // Assert type on submit
      if (mode === 'create') {
        const integrationAppName = skillOption?.integration?.integrationAppName
        if (!integrationAppName) {
          console.error('Integration app name is missing for skill option', skillOption)
          return // Or handle error appropriately
        }

        await createSkill({
          data: {
            agentId,
            skillId: skillOption.id,
            composioIntegrationAppName: integrationAppName,
            composioToolNames: submittedTools,
            variables: {},
            instructions: '',
            tools: submittedTools,
            isEnabled: true,
            version: skillOption.version,
          },
        })
      } else if (agentSkill) {
        // Update only sends changed fields + id (schema is now partial)
        await updateSkill({
          data: {
            id: agentSkill.id,
            tools: submittedTools,
            composioToolNames: submittedTools,
          },
        })
      }
    },
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
        name="tools"
        children={(field) => (
          <div>
            <div className="mb-2 font-medium">Select Tools</div>
            <div className="flex flex-col gap-2">
              {availableTools.map((tool) => (
                <label key={tool} className="flex items-center gap-2">
                  <Checkbox
                    // Assert type for checked state comparison
                    checked={field.state.value.includes(tool as ToolName)}
                    onCheckedChange={(checked) => {
                      const currentTools = field.state.value
                      let newTools: ToolName[] // Use specific type
                      const toolName = tool as ToolName // Assert type for manipulation
                      if (checked) {
                        newTools = [...currentTools, toolName]
                      } else {
                        newTools = currentTools.filter((t) => t !== toolName)
                      }
                      // Assert type for handleChange
                      field.handleChange(newTools)
                    }}
                  />
                  <span>{tool}</span>
                </label>
              ))}
            </div>
            <field.FormFieldMessage />
          </div>
        )}
      />

      <form.AppForm>
        <form.FormButton type="submit">
          {({ isSubmitting }) =>
            isSubmitting || isCreating || isUpdating ? 'Saving...' : 'Save Tools'
          }
        </form.FormButton>
        {/* Removed direct form.status access, handle status within AppForm if needed */}
      </form.AppForm>
    </form>
  )
}
