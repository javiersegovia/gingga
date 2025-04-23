import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { StarIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '~/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-base border border-border px-2.5 font-base py-1 text-xs [&_svg]:pointer-events-none [&_svg]:shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2',
  {
    variants: {
      variant: {
        'default': 'bg-background text-foreground',
        'outline': 'bg-transparent border-border',
        'primary': 'bg-primary text-primary-foreground',
        'accent': 'bg-accent text-accent-foreground',
        'secondary':
          'bg-secondary text-secondary-foreground dark:bg-secondary-accent dark:border-secondary-accent-foreground dark:text-secondary-accent-foreground',

        'destructive': 'bg-destructive/50 text-destructive-foreground',
        'success': 'bg-success text-success-foreground',
        'warning': 'bg-warning text-warning-foreground',
        'error': 'bg-brand-pink text-brand-pink-foreground',

        'premium':
          'rounded-lg border-transparent px-4 py-1.5 font-medium bg-primary-accent text-primary-accent-foreground dark:bg-transparent dark:border-transparent dark:text-primary-foreground',
        'brand-sky':
          'rounded-lg border-transparent px-4 py-1.5 text-sm font-medium bg-brand-sky text-brand-sky-foreground dark:bg-transparent dark:border-transparent dark:text-brand-sky',
      },
      size: {
        xs: 'text-xs leading-3 px-2',
        sm: 'text-xs leading-4 py-1 px-2.5 text-sm',
        md: 'text-sm leading-5 py-1.5 px-3 font-medium',
        lg: 'text-sm leading-5 py-2 px-4 font-semibold',
        icon: 'flex h-8 w-8 rounded-full shadow-small font-bold text-base border-2',
        task: 'flex items-center gap-2 py-1.5 px-3 font-medium text-sm rounded-base',
      },
      hover: {
        default: 'border-border shadow-default',
        noShadow: 'border-border',
        reverse: 'border-border shadow-reverse',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
      hover: 'noShadow',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
  iconClassName?: string
}

function Badge({
  className,
  variant,
  size,
  hover,
  icon,
  iconClassName,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      data-slot="badge"
      className={cn(badgeVariants({ variant, size, hover }), className)}
      {...props}
    >
      {variant === 'premium' && (
        <StarIcon className="mr-1.5 h-3.5 w-3.5 fill-current" />
      )}
      {icon && <span className={cn('mr-1.5', iconClassName)}>{icon}</span>}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
