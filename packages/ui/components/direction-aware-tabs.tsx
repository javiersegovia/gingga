import type { ReactNode } from 'react'
import { cn } from '@gingga/ui/lib/utils'
import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import { useMemo, useState } from 'react'

interface Tab {
  id: number
  label: string
  content: ReactNode
}

interface DirectionAwareTabsProps {
  tabs: Tab[]
  className?: string
  onChange?: () => void
}

function DirectionAwareTabs({ tabs, className, onChange }: DirectionAwareTabsProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const content = useMemo(() => {
    const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content
    return activeTabContent || null
  }, [activeTab, tabs])

  const handleTabClick = (newTabId: number) => {
    if (newTabId !== activeTab && !isAnimating) {
      const newDirection = newTabId > activeTab ? 1 : -1
      setDirection(newDirection)
      setActiveTab(newTabId)
      onChange?.()
    }
  }

  const variants = {
    initial: (direction: number) => ({
      x: 300 * direction,
      opacity: 0,
      filter: 'blur(4px)',
    }),
    active: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
    },
    exit: (direction: number) => ({
      x: -300 * direction,
      opacity: 0,
      filter: 'blur(4px)',
    }),
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div
        className={cn(
          'bg-background border-border shadow-shadow relative flex space-x-1 rounded-sm border-2 px-1.5 py-1.5',
          className,
        )}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              'relative flex cursor-pointer items-center gap-2 rounded-sm px-4 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none',
              activeTab === tab.id
                ? 'text-primary-foreground dark:text-primary'
                : 'text-muted-foreground hover:text-foreground/80',
            )}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {activeTab === tab.id && (
              <motion.span
                layoutId="bubble"
                className={cn(
                  'bg-primary dark:bg-primary/20 dark:border-primary dark:text-primary border-border absolute inset-0 z-10 rounded-xs border-2',
                )}
                transition={{ type: 'spring', bounce: 0.19, duration: 0.4 }}
              />
            )}
            <span className="relative z-20">{tab.label}</span>
          </button>
        ))}
      </div>
      <MotionConfig transition={{ duration: 0, type: 'spring', bounce: 0.4 }}>
        <motion.div className="relative mx-auto h-full w-full overflow-hidden">
          <div className="p-1">
            <AnimatePresence
              custom={direction}
              mode="popLayout"
              onExitComplete={() => setIsAnimating(false)}
            >
              <motion.div
                key={activeTab}
                variants={variants}
                initial="initial"
                animate="active"
                exit="exit"
                custom={direction}
                onAnimationStart={() => setIsAnimating(true)}
                onAnimationComplete={() => setIsAnimating(false)}
              >
                {content}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </MotionConfig>
    </div>
  )
}

export { DirectionAwareTabs }
