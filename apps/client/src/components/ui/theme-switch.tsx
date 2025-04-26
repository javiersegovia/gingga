import { Label } from '@gingga/ui/components/label'
import { RadioGroup, RadioGroupItem } from '@gingga/ui/components/radio-group'
import { cn } from '@gingga/ui/lib/utils'
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useColorScheme } from '~/hooks/use-color-scheme'

export function ThemeSwitch() {
  const [color, setColorScheme] = useColorScheme()

  return (
    <RadioGroup
      className="inline-flex h-7 items-center gap-0 justify-center rounded-lg bg-muted p-1 text-muted-foreground"
      value={color}
      onValueChange={setColorScheme}
    >
      <Label
        htmlFor="system"
        className={cn(
          'inline-flex m-0 items-center justify-center whitespace-nowrap rounded-md p-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
          'has-[>[data-state=checked]]:bg-background has-[>[data-state=checked]]:text-foreground dark:has-[>[data-state=checked]]:text-primary',
        )}
      >
        <RadioGroupItem value="system" id="system" className="sr-only" />
        <MonitorIcon className="h-4 w-4" />
        <span className="sr-only">System</span>
      </Label>
      <Label
        htmlFor="light"
        className={cn(
          'inline-flex m-0 items-center justify-center whitespace-nowrap rounded-md p-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
          'has-[>[data-state=checked]]:bg-background has-[>[data-state=checked]]:text-foreground dark:has-[>[data-state=checked]]:text-primary',
        )}
      >
        <RadioGroupItem value="light" id="light" className="sr-only" />
        <SunIcon className="h-4 w-4" />
        <span className="sr-only">Light</span>
      </Label>
      <Label
        htmlFor="dark"
        className={cn(
          'inline-flex m-0 items-center justify-center whitespace-nowrap rounded-md p-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
          'has-[>[data-state=checked]]:bg-background has-[>[data-state=checked]]:text-foreground dark:has-[>[data-state=checked]]:text-primary',
        )}
      >
        <RadioGroupItem value="dark" id="dark" className="sr-only" />
        <MoonIcon className="h-4 w-4" />
        <span className="sr-only">Dark</span>
      </Label>
    </RadioGroup>
  )
}
