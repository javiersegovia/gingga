/**
 * SkillVariablesForm - Form for editing variables for an AgentSkill.
 * Uses TanStack Form and ShadcnUI components.
 * Does not close the modal on save.
 */
import React from 'react'
import { useAppForm } from '@/components/form/tanstack-form'
import { useCreateSkillMutation, useUpdateSkillById } from '../skill.query'
import type { SkillOption } from '../skill.types'
import type { AgentSkill } from '@/db/types'
import { Button } from '@gingga/ui/components/button'
import { Input } from '@gingga/ui/components/input'
import { z } from 'zod'
import { CreateSkillInputSchema } from '../skill.schema'

interface SkillVariablesFormProps {
  mode: 'create' | 'edit'
  agentId: string
  skillOption?: SkillOption
  agentSkill?: AgentSkill
  onClose: () => void
}

type VariableRow = { key: string; value: string }

function variablesToRows(variables: Record<string, string | null> = {}): VariableRow[] {
  return Object.entries(variables).map(([key, value]) => ({ key, value: value ?? '' }))
}
function rowsToVariables(rows: VariableRow[]): Record<string, string | null> {
  const obj: Record<string, string | null> = {}
  for (const { key, value } of rows) {
    if (key) obj[key] = value
  }
  return obj
}

export default function SkillVariablesForm({
  mode,
  agentId,
  skillOption,
  agentSkill,
  onClose,
}: SkillVariablesFormProps) {
  const { mutateAsync: createSkill, isPending: isCreating } = useCreateSkillMutation()
  const { mutateAsync: updateSkill, isPending: isUpdating } = useUpdateSkillById()

  const initialRows = variablesToRows(agentSkill?.variables || {})

  const form = useAppForm({
    defaultValues: {
      variables: initialRows.length ? initialRows : [{ key: '', value: '' }],
    },
    onSubmit: async ({ value }) => {
      const variables = rowsToVariables(value.variables)
      if (!skillOption) return
      if (mode === 'create') {
        const integrationAppName = skillOption?.integration?.integrationAppName
        if (!integrationAppName) {
          console.error('Integration app name is missing for skill option', skillOption)
          return
        }
        await createSkill({
          data: {
            agentId,
            skillId: skillOption.id,
            composioIntegrationAppName: integrationAppName,
            composioToolNames: [],
            variables,
            instructions: '',
            tools: [],
            isEnabled: true,
            version: skillOption.version,
          },
        })
      } else if (agentSkill) {
        const updateData: Partial<z.infer<typeof CreateSkillInputSchema>> & {
          id: string
        } = {
          id: agentSkill.id,
          variables,
        }
        await updateSkill({ data: updateData })
      }
    },
  })

  const { pushFieldValue, removeFieldValue } = form

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
      className="space-y-4"
    >
      <form.AppField name="variables">
        {(field) => (
          <div>
            <div className="mb-2 font-medium">Variables</div>
            <div className="flex flex-col gap-2">
              {field.state.value.map((row, index) => (
                <div key={`variable-row-${index}`} className="flex items-center gap-2">
                  <form.AppField name={`variables[${index}].key`}>
                    {(keyField) => (
                      <keyField.FormFieldItem className="flex-1">
                        <keyField.FormFieldControl>
                          <Input
                            name={keyField.name}
                            placeholder="Key"
                            value={keyField.state.value ?? ''}
                            onBlur={keyField.handleBlur}
                            onChange={(e) => keyField.handleChange(e.target.value)}
                            aria-invalid={!!keyField.state.meta.errors.length}
                            aria-describedby={
                              keyField.state.meta.errors.length
                                ? `${keyField.name}-errors`
                                : undefined
                            }
                          />
                        </keyField.FormFieldControl>
                        <keyField.FormFieldMessage id={`${keyField.name}-errors`} />
                      </keyField.FormFieldItem>
                    )}
                  </form.AppField>
                  <form.AppField name={`variables[${index}].value`}>
                    {(valueField) => (
                      <valueField.FormFieldItem className="flex-1">
                        <valueField.FormFieldControl>
                          <Input
                            name={valueField.name}
                            placeholder="Value"
                            value={valueField.state.value ?? ''}
                            onBlur={valueField.handleBlur}
                            onChange={(e) => valueField.handleChange(e.target.value)}
                            aria-invalid={!!valueField.state.meta.errors.length}
                            aria-describedby={
                              valueField.state.meta.errors.length
                                ? `${valueField.name}-errors`
                                : undefined
                            }
                          />
                        </valueField.FormFieldControl>
                        <valueField.FormFieldMessage id={`${valueField.name}-errors`} />
                      </valueField.FormFieldItem>
                    )}
                  </form.AppField>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeFieldValue('variables', index)}
                    disabled={field.state.value.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-2"
              onClick={() => pushFieldValue('variables', { key: '', value: '' })}
            >
              Add Variable
            </Button>
          </div>
        )}
      </form.AppField>
      <form.AppForm>
        <form.FormButton variant="primary" size="lg">
          {({ isSubmitting }) =>
            isSubmitting || isCreating || isUpdating ? 'Saving...' : 'Save Variables'
          }
        </form.FormButton>
      </form.AppForm>
    </form>
  )
}
