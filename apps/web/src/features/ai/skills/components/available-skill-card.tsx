import type { AgentSkillWithStatus } from '../skill.api' // Import for connection status type
import type { SkillOption } from '../skill.types'
import { Link } from '@tanstack/react-router'
import { ImageIcon } from 'lucide-react'
import { Card, CardTitle } from '~/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip' // Import Tooltip components
import { ConnectionStatus } from '~/features/settings/integrations/components/connection-status'
import { cn } from '~/lib/utils'

// Type for the optional connection status prop
type ConnectionStatusProps = Pick<
  AgentSkillWithStatus,
  'isConnected' | 'isEnabledComposio' | 'isDeletedComposio'
>

export interface AvailableSkillCardProps {
  skillOption: SkillOption
  agentId: string
  initialConnectionStatus: ConnectionStatusProps | null
  isDisabledByLimit: boolean // Add the new prop
}

export function AvailableSkillCard({
  skillOption,
  agentId,
  initialConnectionStatus,
  isDisabledByLimit, // Destructure the new prop
}: AvailableSkillCardProps) {
  const isIntegrationRequired = !!skillOption.integration?.required
  const isConnected = !!initialConnectionStatus?.isConnected
  const isEnabledComposio = !!initialConnectionStatus?.isEnabledComposio
  const isDeletedComposio = !!initialConnectionStatus?.isDeletedComposio

  // Final effective disabled state considers both connection and limit
  const isEffectivelyDisabled = isDisabledByLimit

  // Define the card content separately to reuse it
  const cardContent = (
    <Card
      design="grid"
      hover="reverse"
      className={cn('flex h-full flex-col px-8 py-4', {
        // Ensure card fills height
        // Apply visual disabled styles based on the effective state
        'opacity-60 grayscale': isEffectivelyDisabled,
      })}
    >
      {/* Image/Icon */}
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="mr-2 flex-shrink-0">
          {skillOption.image
            ? (
                <img
                  src={skillOption.image}
                  alt={`${skillOption.name} logo`}
                  className="h-40 w-40 object-contain"
                />
              )
            : (
                <ImageIcon className="text-muted-foreground h-8 w-8" />
              )}
        </div>
        {/* Title and Description */}
        <div className="flex flex-grow flex-col text-center">
          <CardTitle className="text-base leading-normal font-semibold">
            {skillOption.name}
          </CardTitle>
          <p className="text-muted-foreground text-sm leading-4">
            {skillOption.description}
          </p>
        </div>
      </div>

      {isIntegrationRequired && (
        <div className="mt-6 flex flex-col items-center gap-1">
          {initialConnectionStatus && (
            <div className="flex flex-wrap items-center justify-center gap-x-2 text-xs font-medium">
              <ConnectionStatus
                integration={skillOption.integration}
                isDeletedComposio={isDeletedComposio}
                isConnected={isConnected}
                isEnabledComposio={isEnabledComposio}
              />
            </div>
          )}
        </div>
      )}
    </Card>
  )

  // If disabled by the skill limit (and not by connection), wrap with Tooltip
  if (isDisabledByLimit) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            {/* Use a div instead of Link, apply disabled styles */}
            <div className="block cursor-not-allowed" aria-disabled="true">
              {cardContent}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Cannot add more skills. Limit of
              {5}
              {' '}
              reached.
            </p>
            {' '}
            {/* TODO: Get maxSkills dynamically? */}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Otherwise, render the standard Link component (potentially disabled by connection)
  return (
    <Link
      to="/chat/agent/$agentId/edit/skills/new"
      params={{ agentId }}
      search={{ skillOptionId: skillOption.id }}
      className={cn('block', {
        // Disable link click ONLY if disabled by connection
        'pointer-events-none': isDisabledByLimit,
      })}
      aria-disabled={isDisabledByLimit}
      tabIndex={isDisabledByLimit ? -1 : undefined}
    >
      {cardContent}
    </Link>
  )
}
