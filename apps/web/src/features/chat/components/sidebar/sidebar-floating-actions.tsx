import type { ComponentProps } from 'react'
import { Link } from '@tanstack/react-router'

import { PlusIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { useWindowSize } from 'usehooks-ts'
import { Button } from '~/components/ui/button'
import { SidebarTrigger, useSidebar } from '~/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import { cn } from '~/lib/utils'

export function SidebarFloatingActions({
  className,
}: ComponentProps<typeof SidebarTrigger>) {
  const { state } = useSidebar()

  const { width: windowWidth } = useWindowSize()

  return (
    <div className={cn('pointer-events-auto z-50 flex flex-row gap-2 p-1', className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* <Button onClick={toggleSidebar} variant="outline" className="md:h-fit md:px-2">
            <SidebarLeftIcon size={16} />
          </Button> */}
          <SidebarTrigger />
        </TooltipTrigger>
        <TooltipContent align="start">Toggle Sidebar</TooltipContent>
      </Tooltip>

      <AnimatePresence>
        {(state === 'collapsed' || windowWidth < 768) && (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Button hover="noShadow" variant="default" size="icon" className="size-9">
                  <Link to="/chat">
                    <PlusIcon />
                    <span className="sr-only">New Chat</span>
                  </Link>
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>New Chat</TooltipContent>
          </Tooltip>
        )}
      </AnimatePresence>
    </div>
  )
}
