import { createFileRoute, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  skillOptionsQueryOptions,
  skillsByAgentIdQueryOptions,
} from '@/features/ai/skills/skill.query'
import { Card, CardContent, CardHeader, CardTitle } from '@gingga/ui/components/card'
import { CheckIcon } from 'lucide-react'
import { Button } from '@gingga/ui/components/button'
import { Skeleton } from '@gingga/ui/components/skeleton'

export const Route = createFileRoute('/_demo/chat/agent/$agentId/edit/skills/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { agentId } = useParams({ from: Route.id })

  const { data: activeSkills, isLoading: isLoadingActiveSkills } = useQuery(
    skillsByAgentIdQueryOptions(agentId),
  )

  const { data: skillOptions, isLoading: isLoadingSkillOptions } = useQuery(
    skillOptionsQueryOptions,
  )

  const activeSkillCount = activeSkills?.length ?? 0
  // TODO: Define max skills based on user plan or config
  const maxSkills = 5

  // Filter out skills that are already active
  const availableSkillsToAdd = skillOptions?.filter(
    (option) => !activeSkills?.some((active) => active.skillId === option.id),
  )

  return (
    <div className="space-y-8">
      {/* Active Skills Section */}
      <section>
        <h2 className="mb-1 text-xl font-semibold">
          Active Skills {activeSkillCount}/{maxSkills}
        </h2>
        <p className="text-muted-foreground mb-4 text-sm">
          Skills currently enabled for this agent.
        </p>
        <div className="space-y-4">
          {isLoadingActiveSkills ? (
            <>
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </>
          ) : activeSkills && activeSkills.length > 0 ? (
            activeSkills.map((skill) => (
              <Card key={skill.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{skill.skillId}</CardTitle>
                  <CheckIcon className="text-success h-5 w-5" />
                </CardHeader>
                <CardContent>
                  {/* TODO: Add description or config options? */}
                  {/* TODO: Add Connect Account button if needed */}
                  {/* TODO: Add Delete Skill button */}
                  <p className="text-success text-xs">
                    {/* TODO: Show connection status dynamically */}
                    Account connected
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-center text-sm">
              No skills are active yet.
            </p>
          )}
        </div>
      </section>

      {/* Add New Skill Section */}
      <section>
        <h2 className="mb-1 text-xl font-semibold">Add New Skill</h2>
        <p className="text-muted-foreground mb-4 text-sm">
          Choose from available skills to enhance your agent&apos;s capabilities.
        </p>
        <div className="space-y-3">
          {isLoadingSkillOptions ? (
            <>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </>
          ) : availableSkillsToAdd && availableSkillsToAdd.length > 0 ? (
            availableSkillsToAdd.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className="w-full justify-start"
                // TODO: Implement add skill functionality
                // onClick={() => handleAddSkill(option.id)}
              >
                {option.name}
              </Button>
            ))
          ) : (
            <p className="text-muted-foreground text-center text-sm">
              All available skills have been added.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
