import { createFileRoute, Link, useParams, Outlet } from '@tanstack/react-router'
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from '@tanstack/react-query'
import {
  skillOptionsQueryOptions,
  skillsByAgentIdQueryOptions,
} from '@/features/ai/skills/skill.query'
import { $updateSkillEnabledStatus } from '@/features/ai/skills/skill.api'
import { Card, CardTitle } from '@gingga/ui/components/card'
import { Switch } from '@gingga/ui/components/switch'
import { Button } from '@gingga/ui/components/button'
import {
  CheckIcon,
  ImageIcon,
  LightbulbIcon,
  XIcon,
  CircleHelpIcon,
  ExternalLinkIcon,
  SettingsIcon,
} from 'lucide-react'
import { Skeleton } from '@gingga/ui/components/skeleton'
import { AvailableSkillCard } from '@/features/ai/skills/components/available-skill-card'
import { ComposioToolName } from '@/features/settings/integrations/composio.schema'
import { userComposioConnectionsQueryOptions } from '@/features/settings/integrations/composio.query'
import { cn } from '@gingga/ui/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@gingga/ui/components/accordion'
import { toast } from 'sonner'

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
  const { data: userConnectionsData } = useQuery(userComposioConnectionsQueryOptions)

  const connections = userConnectionsData || []

  const updateSkillEnabledMutation = useMutation({
    mutationFn: $updateSkillEnabledStatus,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: skillsByAgentIdQueryOptions(agentId).queryKey,
      })

      const previousSkills = queryClient.getQueryData<typeof activeSkills>(
        skillsByAgentIdQueryOptions(agentId).queryKey,
      )

      queryClient.setQueryData<typeof activeSkills>(
        skillsByAgentIdQueryOptions(agentId).queryKey,
        (oldData) =>
          oldData?.map((skill) =>
            skill.id === variables.data.id
              ? { ...skill, isEnabled: variables.data.isEnabled }
              : skill,
          ),
      )

      return { previousSkills }
    },
    // eslint-disable-next-line max-params
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
                {activeSkillCount}/{maxSkills}{' '}
              </h2>
              <span className="font-title inline-block text-xl">SKILLS</span>
            </div>
          </div>
          <p className="text-muted-foreground mb-4 text-sm">
            These are the superpowers your agent currently wields. Click to fine-tune
            them!
          </p>

          {/* Active skills list remains structurally similar */}
          <div className="grid grid-cols-1 gap-4">
            {activeSkills && activeSkills.length > 0 ? (
              activeSkills.map((skill) => {
                const skillOption = skillOptions?.find((opt) => opt.id === skill.skillId)
                const displayName = skill.name || skillOption?.name || skill.skillId

                const displayDescription =
                  skill.description ||
                  skillOption?.description ||
                  'No description available.'

                const isIntegrationRequired = !!skillOption?.integration?.required
                const integration = skillOption?.integration

                const relevantConnection = connections.find(
                  (c) => c.appName === integration?.appName,
                )

                const isConnected =
                  relevantConnection && relevantConnection.status === 'ACTIVE'

                const availableTools =
                  integration?.availableComposioToolNames?.filter((tool) =>
                    skill.composioToolNames?.includes(tool.id as ComposioToolName),
                  ) || []

                const hasInstructions = !!skill.instructions
                const variableCount = skill.variables
                  ? Object.keys(skill.variables).length
                  : 0

                return (
                  <div key={skill.id} className="relative">
                    <Card
                      design="grid"
                      hover="noShadow"
                      className="hover:border-shadow-border flex flex-col px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-grow items-center gap-2">
                          <div className="mr-2 flex-shrink-0">
                            {skillOption?.image ? (
                              <img
                                src={skillOption.image}
                                alt={`${displayName} logo`}
                                className="h-16 w-16 object-contain"
                              />
                            ) : (
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
                          >
                            <Link
                              to="/chat/agent/$agentId/edit/skills/$skillId"
                              params={{ agentId, skillId: skill.id }}
                              aria-label={`Edit ${displayName} skill settings`}
                            >
                              <SettingsIcon className="h-4 w-4" />
                            </Link>
                          </Button>
                          {isIntegrationRequired && (
                            <Switch
                              variant="status"
                              checked={skill.isEnabled ?? true}
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
                          )}
                        </div>
                      </div>

                      {isIntegrationRequired && (
                        <Accordion type="single" collapsible className="mt-4 w-full">
                          <AccordionItem
                            variant="ghost"
                            value="item-1"
                            className="border-b-0"
                          >
                            <AccordionTrigger
                              // variant="ghost"
                              className="text-foreground border p-3 hover:no-underline"
                            >
                              <div className="flex flex-grow items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  {integration?.appImage && (
                                    <img
                                      src={integration.appImage}
                                      alt={`${integration.appDisplayName} logo`}
                                      className="h-10 w-10 object-contain"
                                    />
                                  )}
                                  <div className="flex items-center gap-2 text-sm">
                                    <span>{integration?.appDisplayName}</span>
                                    <p className="m-0 text-sm leading-4 font-medium">
                                      {isConnected ? (
                                        <div className="text-brand-green flex animate-pulse items-center gap-1">
                                          <div className="bg-brand-green h-1 w-1 rounded-full" />
                                          Connected
                                        </div>
                                      ) : (
                                        <div className="text-destructive flex animate-pulse items-center gap-1">
                                          <div className="bg-destructive h-1 w-1 rounded-full" />
                                          Not Connected
                                        </div>
                                      )}
                                    </p>
                                  </div>
                                </div>
                                {!isConnected && integration?.appName && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    onClick={(e) => e.stopPropagation()}
                                    className="mr-2"
                                  >
                                    <Link to="/settings/integrations">
                                      Connect
                                      <ExternalLinkIcon className="ml-1.5 h-3 w-3" />
                                    </Link>
                                  </Button>
                                )}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="border p-4">
                              <div className="mb-3 flex flex-col gap-1 text-sm">
                                <div className="flex items-center gap-1.5">
                                  {hasInstructions ? (
                                    <CheckIcon className="text-brand-green h-4 w-4 flex-shrink-0" />
                                  ) : (
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
                                </div>

                                <div className="flex items-center gap-1.5">
                                  {variableCount > 0 ? (
                                    <CheckIcon className="text-brand-green h-4 w-4 flex-shrink-0" />
                                  ) : (
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
                                </div>
                              </div>

                              {availableTools.length > 0 && (
                                <div>
                                  <p className="mb-1 text-sm font-medium">
                                    Enabled tools:
                                  </p>
                                  <ul className="text-muted-foreground list-disc space-y-1 pl-4 text-xs">
                                    {availableTools.map((tool) => (
                                      <li key={tool.id}>{tool.description}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}
                    </Card>
                  </div>
                )
              })
            ) : (
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
            {skillOptions && skillOptions.length > 0 ? (
              skillOptions.map((option) => (
                <AvailableSkillCard
                  key={option.id}
                  skillOption={option}
                  agentId={agentId}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-center text-sm">
                No skills available.
              </p>
            )}
          </div>
        </section>
      </div>

      <Outlet />
    </>
  )
}
