import { Link } from '@tanstack/react-router'
import { Card, CardTitle } from '@gingga/ui/components/card'
import { ImageIcon } from 'lucide-react'
import { SkillOption } from '../skill.types' // Assuming skill.types.ts is in the parent directory
import { Badge } from '@gingga/ui/components/badge'

interface AvailableSkillCardProps {
  skillOption: SkillOption
  agentId: string
}

export function AvailableSkillCard({ skillOption, agentId }: AvailableSkillCardProps) {
  return (
    <Link
      to="/chat/agent/$agentId/edit/skills/new"
      params={{ agentId }}
      search={{ skillOptionId: skillOption.id }}
      className="block"
    >
      <Card design="grid" hover="reverse" className="flex flex-col px-4 py-4">
        {/* Image/Icon on the left */}
        <div className="flex items-center gap-2">
          <div className="mr-2 flex-shrink-0">
            {skillOption.image ? (
              <img
                src={skillOption.image}
                alt={`${skillOption.name} logo`}
                className="h-16 w-16 object-contain"
              />
            ) : (
              <ImageIcon className="text-muted-foreground h-8 w-8" />
            )}
          </div>
          {/* Title and Description on the right */}
          <div className="flex flex-grow flex-col">
            <CardTitle className="text-base leading-tight font-semibold">
              {skillOption.name}
            </CardTitle>
            <p className="text-muted-foreground text-sm leading-4">
              {skillOption.description}
            </p>
          </div>
        </div>

        {skillOption.integration?.required && (
          <Badge className="my-0 ml-auto inline-flex w-auto items-center gap-1 px-2 py-0">
            {skillOption.integration.appImage && (
              <img
                src={skillOption.integration.appImage}
                alt={`${skillOption.integration.appDisplayName} logo`}
                className="h-6 w-6 object-contain"
              />
            )}

            <p className="text-muted-foreground text-xs leading-4">
              {skillOption.integration.appDisplayName}
            </p>
          </Badge>
        )}
      </Card>
    </Link>
  )
}
