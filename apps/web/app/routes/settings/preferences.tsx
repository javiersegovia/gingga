import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gingga/ui/components/card'
import { Label } from '@gingga/ui/components/label'
import { Switch } from '@gingga/ui/components/switch'
import { ThemeSwitch } from '@/components/ui/theme-switch'

export const Route = createFileRoute('/settings/preferences')({
  component: PreferencesSettingsComponent,
})

function PreferencesSettingsComponent() {
  return (
    <div className="space-y-6">
      {/* Appearance Card */}
      <Card design="grid">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how Gingga looks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-muted-foreground text-sm">
                Switch between light and dark mode
              </p>
            </div>
            <ThemeSwitch />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Card */}
      <Card design="grid">
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Control your data and privacy preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="data-collection" className="flex flex-col space-y-1">
              <span>Data Collection</span>
              <span className="text-muted-foreground text-sm font-normal">
                Allow Gingga to collect usage data to improve services
              </span>
            </Label>
            <Switch id="data-collection" defaultChecked />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="chat-history" className="flex flex-col space-y-1">
              <span>Chat History</span>
              <span className="text-muted-foreground text-sm font-normal">
                Store chat history for future reference
              </span>
            </Label>
            <Switch id="chat-history" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
