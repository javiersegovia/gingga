import * as React from 'react'

import { cn } from '@gingga/ui/lib/utils'

type TimelineContext = {
  orientation: 'horizontal' | 'vertical'
}

const TimelineContext = React.createContext<TimelineContext | null>(null)

function useTimeline() {
  const context = React.useContext(TimelineContext)
  if (!context) {
    throw new Error('useTimeline must be used within a <Timeline />.')
  }

  return context
}

export interface TimelineProps extends React.ComponentPropsWithoutRef<'ol'> {
  orientation?: 'horizontal' | 'vertical'
}

export const Timeline = ({
  ref,
  className,
  orientation = 'vertical',
  ...props
}: TimelineProps & {
  ref: React.RefObject<React.ElementRef<'ol'>>
}) => (
  <TimelineContext.Provider value={{ orientation }}>
    <ol
      ref={ref}
      role="list"
      data-orientation={orientation}
      className={cn('flex', orientation === 'vertical' && 'flex-col', className)}
      {...props}
    />
  </TimelineContext.Provider>
)
Timeline.displayName = 'Timeline'

export const TimelineItem = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & {
  ref: React.RefObject<React.ElementRef<'li'>>
}) => {
  const { orientation } = useTimeline()

  return (
    <li
      ref={ref}
      data-orientation={orientation}
      className={cn('flex gap-4', orientation === 'horizontal' && 'flex-col', className)}
      {...props}
    />
  )
}
TimelineItem.displayName = 'TimelineItem'

export const TimelineSeparator = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  ref: React.RefObject<React.ElementRef<'div'>>
}) => {
  const { orientation } = useTimeline()

  return (
    <div
      ref={ref}
      data-orientation={orientation}
      className={cn(
        'flex items-center',
        orientation === 'vertical' && 'flex-col',
        className,
      )}
      {...props}
    />
  )
}
TimelineSeparator.displayName = 'TimelineSeparator'

export interface TimelineDotProps extends React.ComponentPropsWithoutRef<'div'> {
  variant?: 'default' | 'outline'
}

export const TimelineDot = ({
  ref,
  variant = 'default',
  className,
  ...props
}: TimelineDotProps & {
  ref: React.RefObject<React.ElementRef<'div'>>
}) => {
  const { orientation } = useTimeline()

  return (
    <div
      ref={ref}
      data-orientation={orientation}
      className={cn(
        'flex size-4 items-center justify-center empty:after:block empty:after:rounded-full empty:after:outline-current [&_svg]:size-4',
        orientation === 'vertical' && 'mt-1',
        variant === 'default' && 'empty:after:size-2.5 empty:after:bg-current',
        variant === 'outline' && 'empty:after:size-2 empty:after:outline',
        className,
      )}
      {...props}
    />
  )
}
TimelineDot.displayName = 'TimelineDot'

export const TimelineConnector = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  ref: React.RefObject<React.ElementRef<'div'>>
}) => {
  const { orientation } = useTimeline()

  return (
    <div
      ref={ref}
      data-orientation={orientation}
      className={cn(
        'bg-border flex-1',
        orientation === 'vertical' && 'my-2 w-0.5',
        orientation === 'horizontal' && 'mx-2 h-0.5',
        className,
      )}
      {...props}
    />
  )
}
TimelineConnector.displayName = 'TimelineConnector'

export const TimelineContent = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  ref: React.RefObject<React.ElementRef<'div'>>
}) => {
  const { orientation } = useTimeline()

  return (
    <div
      ref={ref}
      data-orientation={orientation}
      className={cn(
        'flex-1',
        orientation === 'vertical' && 'pb-7 first:text-right last:text-left',
        orientation === 'horizontal' && 'pr-7',
        className,
      )}
      {...props}
    />
  )
}
TimelineContent.displayName = 'TimelineContent'

export const TimelineTitle = ({
  ref,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  ref: React.RefObject<React.ElementRef<'div'>>
}) => {
  const { orientation } = useTimeline()

  return <div ref={ref} data-orientation={orientation} {...props} />
}
TimelineTitle.displayName = 'TimelineTitle'

export const TimelineDescription = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  ref: React.RefObject<React.ElementRef<'div'>>
}) => {
  const { orientation } = useTimeline()

  return (
    <div
      ref={ref}
      data-orientation={orientation}
      className={cn('text-muted-foreground text-[0.8em]', className)}
      {...props}
    />
  )
}
TimelineDescription.displayName = 'TimelineDescription'
