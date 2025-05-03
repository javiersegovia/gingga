import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@gingga/ui/components/tooltip'
import { InfoIcon } from 'lucide-react'

interface FormFieldInfoProps {
  info: string | React.ReactNode
}

export function FormFieldInfo({ info }: FormFieldInfoProps) {
  if (!info)
    return null

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <span className="ml-1.5 cursor-help">
            <InfoIcon className="h-3.5 w-3.5 text-muted-foreground" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          {typeof info === 'string' ? <p>{info}</p> : info}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
