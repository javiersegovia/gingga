import { Link } from '@tanstack/react-router'
import { Card, CardTitle } from '@gingga/ui/components/card'
import { ImageIcon } from 'lucide-react'
import { SkillOption } from '../skill.types' // Assuming skill.types.ts is in the parent directory

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
      <Card design="grid" hover="reverse" className="flex items-center px-4 py-4">
        {/* Image/Icon on the left */}
        <div className="mr-2 flex-shrink-0">
          {skillOption.image ? (
            <img
              src={skillOption.image}
              alt={`${skillOption.name} logo`}
              className="h-8 w-8 object-contain"
            />
          ) : (
            <ImageIcon className="text-muted-foreground h-8 w-8" />
          )}
        </div>

        {/* Title and Description on the right */}
        <div className="flex-grow">
          <CardTitle className="text-base leading-tight font-semibold">
            {skillOption.name}
          </CardTitle>
          <p className="text-muted-foreground text-sm leading-4">
            {skillOption.description}
          </p>
        </div>
      </Card>
    </Link>
  )
}
