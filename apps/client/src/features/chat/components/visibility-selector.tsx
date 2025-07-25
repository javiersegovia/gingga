import type { ReactNode } from 'react'
import { Button } from '@gingga/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gingga/ui/components/dropdown-menu'
import { cn } from '@gingga/ui/lib/utils'
import { CheckCircleIcon, ChevronDownIcon, GlobeIcon, LockIcon } from 'lucide-react'

import { useMemo, useState } from 'react'
import { useChatVisibility } from './use-chat-visibility'

export type VisibilityType = 'private' | 'public'

const visibilities: Array<{
  id: VisibilityType
  label: string
  description: string
  icon: ReactNode
}> = [
  {
    id: 'private',
    label: 'Private',
    description: 'Only you can access this chat',
    icon: <LockIcon />,
  },
  {
    id: 'public',
    label: 'Public',
    description: 'Anyone with the link can access this chat',
    icon: <GlobeIcon />,
  },
]

export function VisibilitySelector({
  chatId,
  className,
  selectedVisibilityType,
}: {
  chatId: string
  selectedVisibilityType: VisibilityType
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false)

  const { visibilityType, setVisibilityType } = useChatVisibility({
    chatId,
    initialVisibility: selectedVisibilityType,
  })

  const selectedVisibility = useMemo(
    () => visibilities.find(visibility => visibility.id === visibilityType),
    [visibilityType],
  )

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'data-[state=open]:bg-primary-accent data-[state=open]:text-primary-accent-foreground w-fit',
          className,
        )}
      >
        <Button variant="outline" className="hidden md:flex md:px-2">
          {selectedVisibility?.icon}
          {selectedVisibility?.label}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-[300px]">
        {visibilities.map(visibility => (
          <DropdownMenuItem
            key={visibility.id}
            onSelect={async () => {
              await setVisibilityType(visibility.id)
              setOpen(false)
            }}
            className="group/item flex flex-row items-center justify-between gap-4"
            data-active={visibility.id === visibilityType}
          >
            <div className="flex flex-col items-start gap-1">
              {visibility.label}
              {visibility.description && (
                <div className="text-muted-foreground text-xs">
                  {visibility.description}
                </div>
              )}
            </div>
            <div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
              <CheckCircleIcon />
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
