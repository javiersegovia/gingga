import { Switch } from '@gingga/ui/components/switch'
import { useTheme } from '../shared/theme'

export function ThemeSwitch() {
  const theme = useTheme()
  const isDark = theme.resolved === 'dark'

  return (
    <div className="flex items-center justify-center">
      <Switch
        variant="theme"
        checked={isDark}
        onCheckedChange={checked => theme.set(checked ? 'dark' : 'light')}
        thumbIcon="theme"
      />
    </div>
  )
}

// function SwitchThumb({ isDark }: { isDark: boolean }) {
//   return (
//     <div
//       className={cn(
//         'absolute top-1/2 -translate-y-1/2 transform',
//         isDark ? 'right-1.5' : 'left-1.5',
//       )}
//     >
//       {isDark ? (
//         <MoonIcon className="h-3 w-3 text-white" />
//       ) : (
//         <SunIcon className="h-3 w-3 text-black" />
//       )}
//     </div>
//   )
// }
