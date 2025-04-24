// import type { LinkOptions } from 'react-router'
import type { ReactNode } from 'react'
import { Button } from '@gingga/ui/components/button'
import { Card } from '@gingga/ui/components/card'
import { cn } from '@gingga/ui/lib/utils'
import { motion } from 'motion/react'
import { Link } from 'react-router'

export interface Tab {
  label: string
  icon?: ReactNode // Optional icon
  to: string
  params?: Record<string, string>
  pathname: string
}

interface AnimatedLinkTabsProps {
  tabs: Tab[]
  className?: string
  pathname: string
}

function AnimatedLinkTabs({ tabs, className, pathname }: AnimatedLinkTabsProps) {
  return (
    <Card
      design="grid"
      hover="reverse"
      className={cn(
        'relative mb-6 inline-flex w-auto space-x-1 rounded-lg border-2 px-1.5 py-1.5',
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.pathname

        return (
          <Button asChild key={tab.to} size="sm" variant="ghost" hover="noShadow">
            <Link
              to={tab.to}
              // params={tab.params}
              // activeOptions={{ exact: false }}
              className={cn(
                'relative w-auto',
                isActive
                  ? 'text-primary-foreground dark:text-primary'
                  : 'text-muted-foreground dark:hover:text-primary hover:underline',
              )}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {isActive && (
                <motion.span
                  layoutId="active-tab-bubble"
                  className={cn(
                    'bg-primary dark:bg-primary/20 dark:border-primary dark:text-primary border-shadow-border absolute inset-0 z-10 rounded-lg border-2',
                  )}
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
                />
              )}
              {tab.icon && <span className="relative z-20">{tab.icon}</span>}
              <span className="relative z-20">{tab.label}</span>
            </Link>
          </Button>
        )
      })}
    </Card>
  )
}

export { AnimatedLinkTabs }
