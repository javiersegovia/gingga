import type { AgentSkillWithStatus } from '~/features/ai/skills/skill.api'
import type { ComposioToolName } from '~/features/settings/integrations/composio.schema'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link, Outlet, useParams } from '@tanstack/react-router'
import {
  CheckIcon,
  CircleHelpIcon,
  ImageIcon,
  InfoIcon,
  LightbulbIcon,
  SettingsIcon,
  WrenchIcon,
  XIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardTitle } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import { Switch } from '~/components/ui/switch'
import { AvailableSkillCard } from '~/features/ai/skills/components/available-skill-card'
import { $updateSkillEnabledStatus } from '~/features/ai/skills/skill.api'
import {
  skillOptionsQueryOptions,
  skillsByAgentIdQueryOptions,
} from '~/features/ai/skills/skill.query'
import { ConnectionStatus } from '~/features/settings/integrations/components/connection-status'
import { userComposioConnectionsQueryOptions } from '~/features/settings/integrations/composio.query'
import { cn } from '~/lib/utils'

export const Route = createFileRoute('/_demo/chat/agent/$agentId/edit/skills')({
  component: RouteComponent,
  pendingComponent: PendingComponent,
  loader: async ({ context }) => {
    context.queryClient.prefetchQuery(userComposioConnectionsQueryOptions)
    return null
  },
})

function PendingComponent() {
  return (
    <div className="space-y-8">
      {/* Active Skills Section */}
      <section>
        <Skeleton className="mb-1 h-6 w-1/3" />
        <Skeleton className="mb-4 h-4 w-1/2" />
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </section>

      {/* Add New Skill Section */}
      <section>
        <Skeleton className="mb-1 h-6 w-1/4" />
        <Skeleton className="mb-4 h-4 w-3/4" />
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </section>
    </div>
  )
}

function RouteComponent() {
  const { agentId } = useParams({ from: Route.id })
  const queryClient = useQueryClient()

  const { data: activeSkills } = useSuspenseQuery(skillsByAgentIdQueryOptions(agentId))
  const { data: skillOptions } = useSuspenseQuery(skillOptionsQueryOptions)

  const updateSkillEnabledMutation = useMutation({
    mutationFn: $updateSkillEnabledStatus,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: skillsByAgentIdQueryOptions(agentId).queryKey,
      })

      const previousSkills = queryClient.getQueryData(
        skillsByAgentIdQueryOptions(agentId).queryKey,
      )

      queryClient.setQueryData(skillsByAgentIdQueryOptions(agentId).queryKey, oldData =>
        oldData?.map(skill =>
          skill.id === variables.data.id
            ? { ...skill, isEnabled: variables.data.isEnabled }
            : skill,
        ))

      return { previousSkills }
    },

    onError: (err, _, context) => {
      if (context?.previousSkills) {
        queryClient.setQueryData(
          skillsByAgentIdQueryOptions(agentId).queryKey,
          context.previousSkills,
        )
      }
      console.error('Error updating skill status:', err)
      toast.error('Error updating skill status')
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: skillsByAgentIdQueryOptions(agentId).queryKey,
      })
    },
  })

  const activeSkillCount = activeSkills?.length ?? 0
  const maxSkills = 5
  const availableSkillOptions = skillOptions
  const isAddSkillDisabled = activeSkillCount >= maxSkills

  return (
    <>
      <div className="space-y-8">
        {/* Active Skills Section - Updated Copywriting */}
        <section>
          <div className="flex items-center gap-2">
            <div className="bg-secondary-accent border-secondary-accent-foreground rounded-sm border p-2">
              <LightbulbIcon className="text-secondary-accent-foreground h-6 w-6" />
            </div>

            <div className="flex items-baseline gap-2 font-bold">
              <h2 className="text-4xl">
                {activeSkillCount}
                /
                {maxSkills}
                {' '}
              </h2>
              <span className="font-title inline-block text-xl">SKILLS</span>
            </div>
          </div>
          <p className="text-muted-foreground mb-4 text-sm">
            These are the superpowers your agent currently wields. Click to fine-tune them
            or toggle their status.
          </p>

          <div className="grid grid-cols-1 gap-4">
            {activeSkills && activeSkills.length > 0
              ? (
                  activeSkills.map((skill) => {
                    const skillOption = skill.skillOption
                    const displayName = skill.name || skillOption?.name || skill.skillId

                    const displayDescription
                  = skill.description
                    || skillOption?.description
                    || 'No description available.'

                    const isIntegrationRequired = !!skillOption?.integration?.required
                    const integration = skillOption?.integration

                    const isConnected = skill.isConnected
                    const isEnabledComposio = skill.isEnabledComposio
                    const isDeletedComposio = skill.isDeletedComposio

                    const availableTools
                  = integration?.availableComposioToolNames?.filter(tool =>
                    skill.composioToolNames?.includes(tool.id as ComposioToolName),
                  ) || []

                    const hasInstructions = !!skill.instructions
                    const variableCount = skill.variables
                      ? Object.keys(skill.variables).length
                      : 0

                    const toolsCount
                  = (skill.composioToolNames?.length ?? 0) + (skill.tools?.length ?? 0)

                    const isSwitchDisabled
                  = isIntegrationRequired && (isDeletedComposio || isConnected === false)

                    return (
                      <div key={skill.id} className="relative">
                        <Card
                          design="grid"
                          hover="noShadow"
                          className={cn(
                            'hover:border-shadow-border flex flex-col px-4 py-4',
                            {
                              'opacity-70 grayscale': isSwitchDisabled,
                            },
                          )}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-grow items-center gap-2">
                              <div className="mr-2 flex-shrink-0">
                                {skillOption?.image
                                  ? (
                                      <img
                                        src={skillOption.image}
                                        alt={`${displayName} logo`}
                                        className="h-16 w-16 object-contain"
                                      />
                                    )
                                  : (
                                      <ImageIcon className="text-muted-foreground h-8 w-8" />
                                    )}
                              </div>
                              <div className="flex flex-grow flex-col">
                                <CardTitle className="text-base leading-tight font-semibold">
                                  {displayName}
                                </CardTitle>
                                <p className="text-muted-foreground text-sm leading-4">
                                  {displayDescription}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-shrink-0 items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="h-8 w-8 flex-shrink-0"
                                disabled={isSwitchDisabled}
                              >
                                <Link
                                  to="/chat/agent/$agentId/edit/skills/$skillId"
                                  params={{ agentId, skillId: skill.id }}
                                  aria-label={`Edit ${displayName} skill settings`}
                                >
                                  <SettingsIcon className="h-4 w-4" />
                                </Link>
                              </Button>
                              {isIntegrationRequired
                                ? (
                                    <Switch
                                      variant="status"
                                      checked={skill.isEnabled ?? true}
                                      disabled={isSwitchDisabled}
                                      onCheckedChange={(checked) => {
                                        updateSkillEnabledMutation.mutate({
                                          data: {
                                            id: skill.id,
                                            isEnabled: checked,
                                          },
                                        })
                                      }}
                                      aria-label={`Enable/Disable ${displayName} skill`}
                                    />
                                  )
                                : (
                                    <div className="h-8 w-[44px]"></div>
                                  )}
                            </div>
                          </div>
                          <div className="mb-3 flex gap-2 text-sm">
                            <Badge
                              size="xs"
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              {hasInstructions
                                ? (
                                    <CheckIcon className="text-brand-green h-4 w-4 flex-shrink-0" />
                                  )
                                : (
                                    <XIcon className="text-destructive h-4 w-4 flex-shrink-0" />
                                  )}
                              <span
                                className={cn({
                                  'text-muted-foreground': !hasInstructions,
                                })}
                              >
                                {hasInstructions
                                  ? 'Has instructions'
                                  : 'Instructions are missing'}
                              </span>
                            </Badge>

                            <Badge
                              size="xs"
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              {variableCount > 0
                                ? (
                                    <CheckIcon className="text-brand-green h-4 w-4 flex-shrink-0" />
                                  )
                                : (
                                    <CircleHelpIcon className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                                  )}
                              <span
                                className={cn({
                                  'text-muted-foreground': variableCount === 0,
                                })}
                              >
                                {variableCount > 0
                                  ? `${variableCount} Variable${variableCount > 1 ? 's' : ''} found`
                                  : 'No variables in use'}
                              </span>
                            </Badge>

                            {toolsCount === 0 && (
                              <Badge
                                size="xs"
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                <XIcon className="text-destructive h-4 w-4 flex-shrink-0" />
                                No tools
                              </Badge>
                            )}
                          </div>

                          {isIntegrationRequired && toolsCount > 0 && (
                            <Accordion type="single" collapsible className="mt-4 w-full">
                              <AccordionItem
                                variant="ghost"
                                value="item-1"
                                className="border-b-0"
                              >
                                <AccordionTrigger
                                  className={cn(
                                    'text-foreground bg-accent border py-1 pr-3 pl-1 font-semibold hover:no-underline',
                                    {
                                      'cursor-default hover:bg-transparent': isSwitchDisabled,
                                    },
                                  )}
                                  disabled={isSwitchDisabled}
                                >
                                  <span className="bg-card border-border rounded-base mr-2 inline-flex items-center gap-1 border px-2 py-0.5">
                                    <WrenchIcon className="h-4 w-4" />
                                    {toolsCount}
                                  </span>
                                  Show
                                  {' '}
                                  {toolsCount > 1 ? ' Tools' : ' Tool'}
                                </AccordionTrigger>
                                <AccordionContent className="bg-muted border p-4">
                                  {isSwitchDisabled && (
                                    <div className="bg-destructive/10 text-destructive mb-3 flex items-start gap-2 rounded-md p-3 text-sm">
                                      <InfoIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                      <span>
                                        {isDeletedComposio
                                          ? 'The connection for this integration has been deleted.'
                                          : 'This integration is not connected.'}
                                        {' '}
                                        Please connect or manage the integration in settings
                                        to enable this skill.
                                      </span>
                                    </div>
                                  )}

                                  {availableTools.length > 0 && (
                                    <div>
                                      <p className="mb-1 text-sm font-medium">
                                        Enabled tools:
                                      </p>
                                      <ul className="text-muted-foreground list-disc space-y-1 pl-4 text-sm">
                                        {availableTools.map(tool => (
                                          <li key={tool.id}>{tool.description}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          )}

                          <div className="mt-4 ml-auto">
                            <ConnectionStatus
                              integration={integration}
                              isDeletedComposio={isDeletedComposio}
                              isConnected={isConnected}
                              isEnabledComposio={isEnabledComposio}
                            />
                          </div>
                        </Card>
                      </div>
                    )
                  })
                )
              : (
                  <p className="text-muted-foreground border-border rounded-sm border border-dashed p-4 py-8 text-center text-sm">
                    Your agent is waiting for its first superpower! Add one below.
                  </p>
                )}
          </div>
        </section>

        <section className="pt-20">
          <h2 className="mb-1 text-center text-2xl font-semibold">
            Unlock New Abilities
          </h2>
          <p className="text-muted-foreground mb-4 text-center text-sm">
            Power up your agent! Choose from these available skills.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {availableSkillOptions && availableSkillOptions.length > 0
              ? (
                  availableSkillOptions.map((option) => {
                    let initialConnectionStatus: Pick<
                      AgentSkillWithStatus,
                  'isConnected' | 'isEnabledComposio' | 'isDeletedComposio'
                    > | null = null
                    const relevantActiveSkill = activeSkills?.find(
                      s =>
                        s.skillOption?.integration?.appName === option.integration?.appName,
                    )
                    if (option.integration?.required && relevantActiveSkill) {
                      initialConnectionStatus = {
                        isConnected: relevantActiveSkill.isConnected,
                        isEnabledComposio: relevantActiveSkill.isEnabledComposio,
                        isDeletedComposio: relevantActiveSkill.isDeletedComposio,
                      }
                    }

                    return (
                      <AvailableSkillCard
                        key={option.id}
                        skillOption={option}
                        agentId={agentId}
                        initialConnectionStatus={initialConnectionStatus}
                        isDisabledByLimit={isAddSkillDisabled}
                      />
                    )
                  })
                )
              : (
                  <p className="text-muted-foreground text-center text-sm">
                    No skill templates available.
                  </p>
                )}
          </div>
        </section>
      </div>

      <Outlet />
    </>
  )
}
