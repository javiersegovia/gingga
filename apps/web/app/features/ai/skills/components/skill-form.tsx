import type { SkillOption } from '../skill.types'
import type { AgentSkill } from '@/db/types'
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@gingga/ui/components/tabs'
import { Button } from '@gingga/ui/components/button'
import { Input } from '@gingga/ui/components/input'
import { Textarea } from '@gingga/ui/components/textarea'
import { Checkbox } from '@gingga/ui/components/checkbox'
import { Label } from '@gingga/ui/components/label'
import { cn } from '@gingga/ui/lib/utils'

import { toast } from 'sonner'
import { useUpsertSkillMutation } from '../skill.query'
import { useAppForm, formContext } from '@/components/form/tanstack-form'
import { formOptions } from '@tanstack/react-form'
import type { ComposioToolName } from '@/features/settings/integrations/composio.schema'
import { SheetDescription, SheetHeader, SheetTitle } from '@gingga/ui/components/sheet'
import { Skeleton } from '@gingga/ui/components/skeleton'

interface SkillFormProps {
  mode: 'create' | 'edit'
  agentId: string
  skillOption: SkillOption
  agentSkill?: AgentSkill
  onClose: () => void
  isOpen: boolean
}

// Helper to convert Record<string, string | null> to array
function recordToArray(
  record:
    | Record<string, string | null>
    | { key: string; value: string | null }[]
    | undefined
    | null,
): { key: string; value: string | null }[] {
  if (Array.isArray(record)) return record
  if (!record) return []
  return Object.entries(record).map(([key, value]) => ({ key, value }))
}

// Helper to convert array to record for backend
function arrayToRecord(
  arr: { key: string; value: string | null }[],
): Record<string, string | null> {
  const rec: Record<string, string | null> = {}
  arr.forEach(({ key, value }) => {
    if (key) rec[key] = value
  })
  return rec
}

export function SkillForm({
  mode,
  agentId,
  skillOption,
  agentSkill,
  onClose,
}: SkillFormProps) {
  const [tab, setTab] = useState<'tools' | 'instructions' | 'variables'>('tools')
  const upsertMutation = useUpsertSkillMutation()

  const formOpts = formOptions({
    defaultValues: {
      ...agentSkill,
      agentId,
      skillId: skillOption.id,
      variables: recordToArray(agentSkill?.variables),
      composioToolNames: agentSkill?.composioToolNames,
      name: agentSkill?.name ?? '',
      description: agentSkill?.description ?? '',
      instructions: agentSkill?.instructions ?? '',
      tools: agentSkill?.tools ?? [],
    },
  })

  // Optionally override default values for edit mode
  const form = useAppForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      upsertMutation.mutate(
        {
          data: {
            ...value,
            variables: arrayToRecord(value.variables),
            composioToolNames: value.composioToolNames,
            isEnabled: !!value.isEnabled,
            composioIntegrationAppName: value.composioIntegrationAppName,
            tools: value.tools,
          },
        },
        {
          onSuccess: () => {
            toast.success(
              `Skill ${mode === 'create' ? 'added' : 'updated'} successfully!`,
            )
            onClose()
          },
          onError: (err) => {
            console.error('Failed to save skill:', err)
            toast.error('Failed to save skill.')
          },
        },
      )
    },
  })

  const isSaving = upsertMutation.isPending || form.state.isSubmitting

  return (
    <>
      <formContext.Provider value={form}>
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as typeof tab)}
          className="mt-4 flex flex-1 flex-col"
        >
          <TabsList className="mb-4 shrink-0">
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
            <TabsTrigger value="variables">Variables</TabsTrigger>
          </TabsList>
          <div className="flex-grow pr-2">
            <TabsContent value="tools">
              <form.AppField name="composioToolNames">
                {(field) => (
                  <field.FormFieldItem>
                    <field.FormFieldLabel className="text-lg font-medium">
                      Select Tools
                    </field.FormFieldLabel>
                    {(skillOption.integration?.availableComposioToolNames?.length ??
                      0) === 0 ? (
                      <div className="text-muted-foreground text-sm">
                        No tools available for this skill yet.
                      </div>
                    ) : (
                      <div className="h-[calc(100vh-400px)] space-y-4 overflow-y-auto pr-1">
                        {skillOption.integration?.availableComposioToolNames?.map(
                          (tool) => {
                            const isChecked = field.state.value?.includes(
                              tool.id as ComposioToolName,
                            )
                            return (
                              <div
                                key={tool.id}
                                className={cn(
                                  'border-input flex items-start space-x-4 rounded-md border p-4 transition-colors',
                                  isChecked
                                    ? 'border-secondary dark:bg-secondary-accent bg-secondary-accent'
                                    : 'hover:bg-muted/50',
                                )}
                              >
                                <field.FormFieldControl>
                                  <Checkbox
                                    id={tool.id}
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      const checkedVal = !!checked
                                      const current = field.state.value || []
                                      if (checkedVal) {
                                        if (
                                          !current.includes(tool.id as ComposioToolName)
                                        ) {
                                          field.handleChange([
                                            ...current,
                                            tool.id as ComposioToolName,
                                          ])
                                        }
                                      } else {
                                        field.handleChange(
                                          current.filter(
                                            (id: ComposioToolName) => id !== tool.id,
                                          ),
                                        )
                                      }
                                    }}
                                    className="mt-1"
                                    disabled={isSaving}
                                  />
                                </field.FormFieldControl>
                                <div className="flex-grow space-y-1">
                                  <Label
                                    htmlFor={tool.id}
                                    className="mx-0 cursor-pointer text-base leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {tool.name}
                                  </Label>
                                  <p className="text-muted-foreground text-sm">
                                    {tool.description}
                                  </p>
                                </div>
                              </div>
                            )
                          },
                        )}
                      </div>
                    )}
                    <field.FormFieldMessage />
                  </field.FormFieldItem>
                )}
              </form.AppField>
            </TabsContent>
            <TabsContent value="instructions">
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label>Available Variables</Label>
                  {(form.state.values.variables ?? []).filter((v) => v.key).length ===
                  0 ? (
                    <div className="text-muted-foreground rounded border p-2 text-xs">
                      There are no variables created yet. Create a new one inside the
                      Variables tab.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {(form.state.values.variables ?? [])
                        .map((v) => v.key)
                        .filter((k) => k)
                        .map((key) => (
                          <span
                            key={key}
                            className="bg-muted rounded px-2 py-1 font-mono text-xs"
                          >
                            {'{{' + key + '}}'}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
                <form.AppField name="instructions">
                  {(field) => (
                    <field.FormFieldItem>
                      <field.FormFieldLabel>Instructions</field.FormFieldLabel>
                      <field.FormFieldControl>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          placeholder="Write instructions for this skill. Use {{variableName}} to reference variables."
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          rows={6}
                          disabled={isSaving}
                        />
                      </field.FormFieldControl>
                      <field.FormFieldMessage />
                    </field.FormFieldItem>
                  )}
                </form.AppField>
                <form.AppField name="name">
                  {(field) => (
                    <field.FormFieldItem>
                      <field.FormFieldLabel>Skill Name (Optional)</field.FormFieldLabel>
                      <field.FormFieldControl>
                        <Input
                          id={field.name}
                          name={field.name}
                          placeholder="Enter a custom name for this skill instance"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={isSaving}
                        />
                      </field.FormFieldControl>
                      <field.FormFieldDescription>
                        Leave blank to use the default skill name.
                      </field.FormFieldDescription>
                      <field.FormFieldMessage />
                    </field.FormFieldItem>
                  )}
                </form.AppField>
                <form.AppField name="description">
                  {(field) => (
                    <field.FormFieldItem>
                      <field.FormFieldLabel>
                        Skill Description (Optional)
                      </field.FormFieldLabel>
                      <field.FormFieldControl>
                        <Input
                          id={field.name}
                          name={field.name}
                          placeholder="Enter a custom description"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={isSaving}
                        />
                      </field.FormFieldControl>
                      <field.FormFieldDescription>
                        Leave blank to use the default skill description.
                      </field.FormFieldDescription>
                      <field.FormFieldMessage />
                    </field.FormFieldItem>
                  )}
                </form.AppField>
              </div>
            </TabsContent>
            <TabsContent value="variables">
              <form.AppField name="variables" mode="array">
                {(field) => {
                  if (field.state.value.length === 0) {
                    field.pushValue({ key: '', value: null })
                    return null
                  }
                  return (
                    <field.FormFieldItem>
                      <field.FormFieldLabel>Variables</field.FormFieldLabel>
                      <p className="text-muted-foreground mb-4 text-sm">
                        Define variables here that can be used in the skill&apos;s
                        instructions. Save your changes for the variables to be available
                        in the Instructions tab.
                      </p>
                      <div className="flex max-h-[50vh] min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
                        {field.state.value.map((_, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <form.AppField name={`variables[${idx}].key`}>
                              {(subField) => (
                                <subField.FormFieldControl className="flex-1">
                                  <Input
                                    placeholder="Key"
                                    name={subField.name}
                                    value={subField.state.value}
                                    onBlur={subField.handleBlur}
                                    onChange={(e) =>
                                      subField.handleChange(e.target.value)
                                    }
                                    disabled={isSaving}
                                  />
                                </subField.FormFieldControl>
                              )}
                            </form.AppField>
                            <form.AppField name={`variables[${idx}].value`}>
                              {(subField) => (
                                <subField.FormFieldControl className="flex-1">
                                  <Input
                                    placeholder="Value (Optional)"
                                    name={subField.name}
                                    value={subField.state.value ?? ''}
                                    onBlur={subField.handleBlur}
                                    onChange={(e) =>
                                      subField.handleChange(e.target.value)
                                    }
                                    disabled={isSaving}
                                  />
                                </subField.FormFieldControl>
                              )}
                            </form.AppField>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => field.removeValue(idx)}
                              disabled={field.state.value.length <= 1 || isSaving}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-auto"
                          onClick={() => field.pushValue({ key: '', value: null })}
                          disabled={isSaving}
                        >
                          Add Variable
                        </Button>
                      </div>
                      <field.FormFieldMessage />
                    </field.FormFieldItem>
                  )
                }}
              </form.AppField>
            </TabsContent>
          </div>
        </Tabs>
        <div className="mt-6 mb-2 px-2">
          <Button
            variant="primary"
            size="xl"
            className="w-full"
            onClick={() => form.handleSubmit()}
            disabled={!form.state.canSubmit || form.state.isSubmitting}
          >
            {form.state.isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </formContext.Provider>
    </>
  )
}

export function SkillFormSkeleton() {
  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded border" />
          <div>
            <SheetTitle>
              <Skeleton className="h-6 w-32" />
            </SheetTitle>
            <SheetDescription>
              <Skeleton className="mt-1 h-4 w-48" />
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>
      <div className="mt-4 flex flex-1 flex-col">
        <div className="bg-muted mb-4 flex shrink-0 space-x-1 rounded-lg p-1">
          <Skeleton className="h-9 flex-1 rounded-md" />
          <Skeleton className="h-9 flex-1 rounded-md" />
          <Skeleton className="h-9 flex-1 rounded-md" />
        </div>
        <div className="flex-grow space-y-4 pr-2">
          <Skeleton className="h-6 w-1/4" />
          <div className="h-[calc(100vh-400px)] space-y-4 overflow-y-auto pr-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4 rounded-md border p-4">
                <Skeleton className="mt-1 h-5 w-5" />
                <div className="flex-grow space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 mb-2 px-2">
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </>
  )
}
