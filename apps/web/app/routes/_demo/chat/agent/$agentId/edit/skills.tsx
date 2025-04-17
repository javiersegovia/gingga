import { createFileRoute, Link, useParams, Outlet } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  skillOptionsQueryOptions,
  skillsByAgentIdQueryOptions,
} from '@/features/ai/skills/skill.query'
import { Card, CardTitle } from '@gingga/ui/components/card'
import { CheckIcon, ImageIcon, LightbulbIcon } from 'lucide-react'
import { Skeleton } from '@gingga/ui/components/skeleton'
import { AvailableSkillCard } from '@/features/ai/skills/components/available-skill-card'
import { ComposioToolName } from '@/features/settings/integrations/composio.schema'

export const Route = createFileRoute('/_demo/chat/agent/$agentId/edit/skills')({
  component: RouteComponent,
  pendingComponent: PendingComponent,
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

  const { data: activeSkills } = useSuspenseQuery(skillsByAgentIdQueryOptions(agentId))
  const { data: skillOptions } = useSuspenseQuery(skillOptionsQueryOptions)

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

            <h2 className="text-xl font-semibold">
              {activeSkillCount}/{maxSkills} <span className="text-md">Skills</span>
            </h2>
          </div>
          <p className="text-muted-foreground mb-4 text-sm">
            These are the superpowers your agent currently wields. Click to fine-tune
            them!
          </p>
          {/* Active skills list remains structurally similar */}
          <div className="grid grid-cols-1 gap-4 rounded-sm border border-dashed p-4">
            {activeSkills && activeSkills.length > 0 ? (
              activeSkills.map((skill) => {
                const skillOption = skillOptions?.find((opt) => opt.id === skill.skillId)
                const displayName = skill.name || skillOption?.name || skill.skillId
                const displayDescription =
                  skill.description ||
                  skillOption?.description ||
                  'No description available.'
                // Integration block logic
                const integrationRequired =
                  skillOption?.integration?.required &&
                  skill.composioIntegrationAppName &&
                  skill.composioToolNames &&
                  skill.composioToolNames.length > 0
                const integration = skillOption?.integration
                const availableTools =
                  integration?.availableComposioToolNames?.filter((tool) =>
                    skill.composioToolNames?.includes(tool.id as ComposioToolName),
                  ) || []
                return (
                  <Link
                    key={skill.id}
                    to="/chat/agent/$agentId/edit/skills/$skillId"
                    params={{ agentId, skillId: skill.id }}
                    className="block"
                  >
                    <Card
                      design="grid"
                      hover="reverse"
                      className="flex flex-col px-4 py-4"
                    >
                      <div className="flex items-center gap-2">
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
                        <CheckIcon className="text-success h-5 w-5 shrink-0" />
                      </div>
                      {/* Integration block */}
                      {integrationRequired && (
                        <div className="bg-muted/50 mt-4 flex flex-col gap-2 rounded-lg border px-4 py-3">
                          <div className="flex items-center gap-2">
                            {integration?.appImage && (
                              <img
                                src={integration.appImage}
                                alt={`${integration.appDisplayName} logo`}
                                className="h-6 w-6 object-contain"
                              />
                            )}
                            <span className="text-success font-medium">Connected</span>
                          </div>
                          <ul className="text-muted-foreground ml-8 list-disc space-y-1 text-xs">
                            {availableTools.map((tool) => (
                              <li key={tool.id}>{tool.description}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Card>
                  </Link>
                )
              })
            ) : (
              <p className="text-muted-foreground text-center text-sm">
                Your agent is waiting for its first superpower! Add one below.
              </p>
            )}
          </div>
        </section>

        {/* Add New Skill Section - Updated Copywriting & Layout */}
        <section>
          <h2 className="mb-1 text-xl font-semibold">Unlock New Abilities</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            Power up your agent! Choose from these available skills.
          </p>
          {/* Use the new component, make grid 1 column */}
          <div className="grid grid-cols-1 gap-4">
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
