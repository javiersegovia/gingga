import { Suspense } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useSuspenseQueries } from '@tanstack/react-query'
import {
  skillByIdQueryOptions,
  skillOptionsQueryOptions,
} from '@/features/ai/skills/skill.query'
import { SkillForm, SkillFormSkeleton } from '@/features/ai/skills/components/skill-form'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@gingga/ui/components/sheet'

export const Route = createFileRoute('/_demo/chat/agent/$agentId/edit/skills/$skillId')({
  component: RouteComponent,

  loader: async ({ context, params: { skillId } }) => {
    context.queryClient.prefetchQuery(skillByIdQueryOptions(skillId))
    context.queryClient.prefetchQuery(skillOptionsQueryOptions)
  },
})

function RouteComponent() {
  const { agentId } = Route.useParams()
  const router = useRouter()

  const handleClose = () => {
    router.navigate({
      to: '/chat/agent/$agentId/edit/skills',
      params: { agentId },
    })
  }

  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) handleClose()
      }}
    >
      <SheetContent side="right" className="flex flex-col sm:max-w-xl">
        <Suspense fallback={<SkillFormSkeleton />}>
          <SkillSheetContent handleClose={handleClose} />
        </Suspense>
      </SheetContent>
    </Sheet>
  )
}

const SkillSheetContent = ({ handleClose }: { handleClose: () => void }) => {
  const { agentId, skillId } = Route.useParams()

  const [agentSkillQueryResult, skillOptionsQueryResult] = useSuspenseQueries({
    queries: [skillByIdQueryOptions(skillId), skillOptionsQueryOptions],
  })

  const { data: agentSkill } = agentSkillQueryResult
  const { data: skillOptions } = skillOptionsQueryResult

  if (!agentSkill) {
    // Todo: Handle this error
    return <div>Error: Agent Skill not found.</div>
  }

  const skillOption = skillOptions.find((opt) => opt.id === agentSkill.skillId)

  if (!skillOption) {
    // Todo: Handle this error
    return <div>Error: Base Skill Option not found for this active skill.</div>
  }

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-4">
          {skillOption.image && (
            <img
              src={skillOption.image}
              alt={skillOption.name}
              className="h-20 w-20 rounded object-contain"
            />
          )}
          <div>
            <SheetTitle className="text-xs font-semibold uppercase">
              Edit Skill
            </SheetTitle>
            <SheetDescription className="text-lg">{`${skillOption.name} v${skillOption.version}`}</SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <SkillForm
        isOpen
        mode="edit"
        agentId={agentId}
        agentSkill={agentSkill}
        skillOption={skillOption}
        onClose={handleClose}
      />
    </>
  )
}
