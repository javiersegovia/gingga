import type { ToasterProps } from 'sonner'
import { Toaster as Sonner } from 'sonner'

export function Toaster({
  theme,
  ...props
}: ToasterProps & { theme: 'system' | 'dark' | 'light' }) {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}
