import { createFileRoute, Link } from '@tanstack/react-router'
import {
  AlertCircleIcon,
  ArrowRightIcon,
  Check,
  InfoIcon,
  Trash2Icon,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { useAuthedQuery } from '~/features/auth/auth.query'

export const Route = createFileRoute('/settings/account')({
  component: AccountSettingsComponent,
})

function NoMembershipCard() {
  return (
    <Card design="grid" className="">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <InfoIcon className="text-brand-blue h-5 w-5" />
          {' '}
          Basic Plan
        </CardTitle>
        <CardDescription>
          You are currently on our starting Basic plan. Upgrade to unlock more features
          and capabilities.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm font-medium">Upgrading gives you access to:</p>
        <ul className="text-muted-foreground ml-4 list-none space-y-1 text-sm">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            {' '}
            More agents & integrations
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            {' '}
            Custom knowledge bases
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            {' '}
            Priority support
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            {' '}
            Faster deployment times
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" size="lg" variant="primary">
          <Link to="/settings/contact">
            Contact Us to Upgrade
            {' '}
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function AccountSettingsComponent() {
  const { data: authData } = useAuthedQuery()

  // TODO: Add real limits based on tier - these might not apply to basic
  const dailyLimit = 100
  const monthlyStandardLimit = 1000
  const monthlyPremiumLimit = 500

  if (!authData?.session) {
    // Should be handled by layout, but good practice
    return null // Or a loading state
  }

  // Render NoMembershipCard if membership data is missing or explicitly basic
  // Adjust this condition based on how your authData defines a non-paying user
  if (!authData.user.membership /* || authData.membership.tier === 'basic' */) {
    return (
      <div className="space-y-6">
        <NoMembershipCard />
        {/* Keep Delete Account section even for basic users */}
        <DeleteAccountCard />
      </div>
    )
  }

  // Existing logic for users with a paid membership
  const {
    membership: {
      dailyResetAt,
      monthlyResetAt,
      dailyUsed,
      monthlyStandardUsed,
      monthlyPremiumUsed,
      tier,
    },
  } = authData.user

  const formatResetDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const calculatePercentage = (used: number, limit: number) => {
    if (limit <= 0)
      return 0
    return Math.min((used / limit) * 100, 100)
  }

  return (
    <div className="space-y-6">
      {/* Membership Info Card */}
      <Card design="grid">
        <CardHeader>
          <CardTitle>Membership Details</CardTitle>
          <CardDescription>
            You are currently on the
            {' '}
            <span className="text-foreground font-semibold capitalize">{tier}</span>
            {' '}
            plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span>Daily Usage</span>
              <span className="text-muted-foreground">
                {dailyUsed}
                {' '}
                /
                {dailyLimit}
                {' '}
                tokens
              </span>
            </div>
            <Progress
              value={calculatePercentage(dailyUsed ?? 0, dailyLimit)}
              className="h-2"
            />
            <p className="text-muted-foreground mt-1 text-xs">
              Resets on
              {' '}
              {formatResetDate(dailyResetAt.getTime())}
            </p>
          </div>

          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span>Monthly Standard Usage</span>
              <span className="text-muted-foreground">
                {monthlyStandardUsed}
                {' '}
                /
                {monthlyStandardLimit}
                {' '}
                tokens
              </span>
            </div>
            <Progress
              value={calculatePercentage(monthlyStandardUsed ?? 0, monthlyStandardLimit)}
              className="h-2"
            />
          </div>

          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span>Monthly Premium Usage</span>
              <span className="text-muted-foreground">
                {monthlyPremiumUsed}
                {' '}
                /
                {monthlyPremiumLimit}
                {' '}
                tokens
              </span>
            </div>
            <Progress
              value={calculatePercentage(monthlyPremiumUsed ?? 0, monthlyPremiumLimit)}
              className="h-2"
            />
            <p className="text-muted-foreground mt-1 text-xs">
              Monthly usage resets on
              {' '}
              {formatResetDate(monthlyResetAt.getTime())}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Card - Extracted for reuse */}
      <DeleteAccountCard />
    </div>
  )
}

function DeleteAccountCard() {
  return (
    <Card design="grid" className="">
      <CardHeader>
        <CardTitle className="text-destructive">Delete Account</CardTitle>
        <CardDescription>
          We will delete your account and all your data. This action cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="destructive" disabled className="w-full" size="lg">
          <Trash2Icon className="mr-2 h-4 w-4" />
          Delete my account (Disabled)
        </Button>
        <p className="text-destructive mt-3 flex items-center text-xs">
          <AlertCircleIcon className="mr-1 h-3 w-3" />
          This feature is not yet available.
        </p>
      </CardContent>
    </Card>
  )
}
