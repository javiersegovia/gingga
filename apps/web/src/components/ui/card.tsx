/* eslint-disable react/no-array-index-key */
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import * as React from 'react'
import { useId } from 'react'

import { cn } from '~/lib/utils'

const cardVariants = cva(
  'rounded-base border-border bg-card text-card-foreground border-2 transition-all duration-300',
  {
    variants: {
      hover: {
        default: 'shadow-shadow border-shadow-border',
        reverse: 'hover:shadow-custom hover:border-shadow-border',
        noShadow: '',
      },
      design: {
        default: '',
        grid: 'relative overflow-hidden p-0',
      },
    },
    defaultVariants: {
      hover: 'default',
      design: 'default',
    },
  },
)

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cardVariants> {
  shadowColor?: string
}

function Card({
  className,
  hover,
  design,
  shadowColor,
  style,
  ...props
}: CardProps) {
  const customStyle = shadowColor
    ? ({
        ...style,
        '--shadow-color': shadowColor,
      } as React.CSSProperties)
    : style

  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ hover, design, className }))}
      style={customStyle}
      {...props}
    >
      {design === 'grid' && <FeatureGrid />}
      {props.children}
    </div>
  )
}

function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-header"
      className={cn('m-6 flex flex-col space-y-1.5', className)}
      {...props}
    />
  )
}

function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        'text-xl leading-none font-semibold tracking-tight',
        className,
      )}
      {...props}
    />
  )
}

function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      data-slot="card-description"
      className={cn('font-base mt-3 text-sm', className)}
      {...props}
    />
  )
}

function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="card-content" className={cn('m-6', className)} {...props} />
  )
}

function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('m-6 flex items-center', className)}
      {...props}
    />
  )
}

function FeatureGrid() {
  const patternId = useId()
  const pattern = [
    [7, 5],
    [8, 3],
    [9, 1],
    [10, 4],
    [8, 6],
  ]

  return (
    <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-100/30 to-zinc-300/30 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] opacity-100 dark:from-zinc-900/30 dark:to-zinc-900/30">
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full fill-black/10 stroke-black/10 mix-blend-overlay dark:fill-white/10 dark:stroke-white/10"
        >
          <defs>
            <pattern
              id={patternId}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
              x="-12"
              y="4"
            >
              <path d={`M.5 ${20}V.5H${20}`} fill="none" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill={`url(#${patternId})`}
          />
          <svg x="-12" y="4" className="overflow-visible">
            {pattern.map(([x, y], index) => (
              <rect
                strokeWidth="0"
                key={`${x}-${y}-${index}`}
                width={21}
                height={21}
                x={x * 20}
                y={y * 20}
              />
            ))}
          </svg>
        </svg>
      </div>
    </div>
  )
}

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
}
export type { CardProps }
