import type { buttonVariants } from '@gingga/ui/components/button'
import { Button } from '@gingga/ui/components/button'
import { cn } from '@gingga/ui/lib/utils'
import type { VariantProps } from 'class-variance-authority'
import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

export type ScrollButtonProps = {
  messagesContainerRef: React.RefObject<HTMLElement | null>
  className?: string
  threshold?: number
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
} & React.ButtonHTMLAttributes<HTMLButtonElement>

function ScrollButton({
  messagesContainerRef,
  className,
  threshold = 100,
  variant = 'default',
  size = 'sm',
  ...props
}: ScrollButtonProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
        setIsVisible(scrollTop + clientHeight < scrollHeight - threshold)
      }
    }

    const container = messagesContainerRef.current

    if (container) {
      container.addEventListener('scroll', handleScroll)
      handleScroll()
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [messagesContainerRef, threshold])

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      hover="noShadow"
      className={cn(
        'bg-blank transition-all duration-150 ease-out',
        isVisible
          ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-4 scale-95 opacity-0',
        className,
      )}
      onClick={handleScroll}
      {...props}
    >
      <span>Scroll to bottom</span>
      <ChevronDown className="h-4 w-4" />
    </Button>
  )
}

export { ScrollButton }
