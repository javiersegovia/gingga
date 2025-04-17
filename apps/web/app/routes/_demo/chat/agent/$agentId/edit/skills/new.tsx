import { Suspense } from 'react'
import { createFileRoute, useRouter, ErrorComponent } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { skillOptionsQueryOptions } from '@/features/ai/skills/skill.query'
import { SkillForm, SkillFormSkeleton } from '@/features/ai/skills/components/skill-form'
import { z } from 'zod'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@gingga/ui/components/sheet'

const skillSearchSchema = z.object({
  skillOptionId: z.string().optional(),
})

export const Route = createFileRoute('/_demo/chat/agent/$agentId/edit/skills/new')({
  validateSearch: (search) => skillSearchSchema.parse(search),
  loaderDeps: ({ search: { skillOptionId } }) => ({ skillOptionId }),
  loader: ({ deps: { skillOptionId } }) => {
    if (!skillOptionId) {
      throw new Error('Skill option ID is required.')
    }
    return { skillOptionId }
  },
  component: RouteComponent,
  errorComponent: RouteErrorComponent,
})

function RouteErrorComponent({ error }: { error: Error }) {
  return <ErrorComponent error={error} />
}

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
  const { agentId } = Route.useParams()
  const { skillOptionId } = Route.useSearch()

  const { data: skillOptions } = useSuspenseQuery(skillOptionsQueryOptions)
  const selectedSkillOption = skillOptions.find((opt) => opt.id === skillOptionId)

  if (!selectedSkillOption) {
    return <div>Error: Skill option not found.</div>
  }

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-4">
          {selectedSkillOption.image && (
            <img
              src={selectedSkillOption.image}
              alt={selectedSkillOption.name}
              className="h-20 w-20 rounded object-contain"
            />
          )}
          <div>
            <SheetTitle className="text-lg font-semibold">Unlock Skill</SheetTitle>
            <SheetDescription className="text-lg">{`${selectedSkillOption.name} v${selectedSkillOption.version}`}</SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <SkillForm
        isOpen
        mode="create"
        agentId={agentId}
        skillOption={selectedSkillOption}
        onClose={handleClose}
      />
    </>
  )
}
