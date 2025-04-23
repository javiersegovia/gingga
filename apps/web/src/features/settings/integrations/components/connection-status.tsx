import type { AgentSkillWithStatus } from '../../../ai/skills/skill.api'
import type { SkillOption } from '../../../ai/skills/skill.types'
import { Link } from '@tanstack/react-router'
import { AlertTriangleIcon, ExternalLinkIcon, PlugZapIcon, XIcon } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { cn } from '~/lib/utils'

type ConnectionStatusType = 'connected' | 'disabled' | 'deleted' | 'connection-required'

const statusData: Record<
  ConnectionStatusType,
  {
    statusText: string
    statusIcon: React.ReactNode
    badgeVariant: 'success' | 'warning' | 'error' | 'destructive'
    tooltipContent: string
  }
> = {
  'connected': {
    statusText: 'Connected',
    statusIcon: <PlugZapIcon className="h-4 w-4" />,
    badgeVariant: 'success',
    tooltipContent: 'Connection is active.',
  },
  'disabled': {
    statusText: 'Disabled',
    statusIcon: <AlertTriangleIcon className="h-4 w-4" />,
    badgeVariant: 'destructive',
    tooltipContent: 'This connection is disabled temporarily.',
  },
  'deleted': {
    statusText: 'Connection Deleted',
    statusIcon: <XIcon className="h-3 w-3" />,
    badgeVariant: 'error',
    tooltipContent: 'This connection was deleted. Please reconnect.',
  },
  'connection-required': {
    statusText: 'Connection Required',
    statusIcon: <ExternalLinkIcon className="h-4 w-4" />,
    badgeVariant: 'warning',
    tooltipContent: 'Click the button to setup the connection.',
  },
}

export function ConnectionStatus({
  integration,
  isDeletedComposio,
  isConnected,
  isEnabledComposio,
}: {
  integration: SkillOption['integration']
  isDeletedComposio: AgentSkillWithStatus['isDeletedComposio']
  isConnected: AgentSkillWithStatus['isConnected']
  isEnabledComposio: AgentSkillWithStatus['isEnabledComposio']
}) {
  const statusType: ConnectionStatusType = isDeletedComposio
    ? 'deleted'
    : !isEnabledComposio
        ? 'disabled'
        : isConnected
          ? 'connected'
          : 'connection-required'

  const StatusContent = (
    <span className={cn('flex items-center gap-1')}>
      {statusData[statusType].statusText}
      {statusData[statusType].statusIcon}
    </span>
  )

  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>
          <div className="flex flex-grow items-center justify-between gap-2">
            <Badge
              variant={statusData[statusType].badgeVariant}
              className="flex items-center gap-1 text-xs"
            >
              {integration?.appImage && (
                <img
                  src={integration.appImage}
                  alt={`${integration.appDisplayName} logo`}
                  className="h-6 w-6 object-contain"
                />
              )}

              <p className="m-0 flex flex-wrap items-center gap-x-2 leading-4 font-medium">
                {statusType === 'connection-required'
                  ? (
                      <Link to="/settings/integrations">{StatusContent}</Link>
                    )
                  : (
                      StatusContent
                    )}
              </p>
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{statusData[statusType].tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
