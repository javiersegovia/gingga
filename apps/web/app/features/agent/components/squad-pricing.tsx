import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gingga/ui/components/card'
import { Check, HelpCircle, Clock, TrendingUp } from 'lucide-react'
import { Button } from '@gingga/ui/components/button'
import { cn } from '@gingga/ui/lib/utils'
import { Badge } from '@gingga/ui/components/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@gingga/ui/components/tabs'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'

// Pricing constants - easy to change
const PRICING = {
  singleAgent: {
    setupFee: 150,
    monthly: 75,
    annual: 50, // 50% discount for annual billing
  },
  fullSquad: {
    setupFee: 250,
    monthly: 150,
    annual: 100, // 50% discount for annual billing
  },
}

export function SquadPricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')

  const plans = [
    {
      name: 'Single Agent',
      description: 'Focus on one key automation',
      setupFee: PRICING.singleAgent.setupFee,
      monthlyPrice:
        billingPeriod === 'monthly'
          ? PRICING.singleAgent.monthly
          : PRICING.singleAgent.annual,
      features: [
        '1 agent of your choice',
        'Custom response templates',
        '1 custom integration',
        'Standard support',
        '3-5 days deployment',
      ],
      action: 'Get Started',
      accentVar: '--brand-blue',
      planType: 'basic',
    },
    {
      name: 'Three Agents',
      description: 'Automate multiple processes',
      setupFee: PRICING.fullSquad.setupFee,
      monthlyPrice:
        billingPeriod === 'monthly'
          ? PRICING.fullSquad.monthly
          : PRICING.fullSquad.annual,
      features: [
        '3 agents of your choice',
        'Custom knowledge bases',
        '3 custom integrations',
        'Priority support',
        '3-5 days deployment',
      ],
      action: 'Get Started',
      accentVar: '--brand-pink',
      planType: 'pro',
    },
    {
      name: 'Enterprise',
      description: 'For larger operations with custom needs',
      setupFee: 'Custom',
      monthlyPrice: 'Custom',
      features: [
        'Unlimited agents',
        'Full customization',
        'All available integrations',
        'Advanced analytics',
        'Dedicated support',
        'Custom timeline',
      ],
      action: 'Contact Us',
      planType: 'enterprise',
      accentVar: '--brand-purple',
    },
  ]

  return (
    <div className="bg-blank dark:bg-background w-full py-24" id="pricing">
      <div className="container-marketing mx-auto px-4 text-center">
        <Badge className="bg-brand-blue text-brand-blue-foreground mb-6 px-3 py-1">
          Pricing
        </Badge>
        <h2 className="mx-auto mb-4 max-w-2xl text-4xl font-bold tracking-tight">
          Simple, Transparent Pricing
        </h2>
        <p className="text-muted-foreground mx-auto mb-12 max-w-[800px] text-xl">
          One-time setup fee plus affordable monthly subscription. No hidden costs, just
          pure automation value.
        </p>

        <Tabs
          defaultValue="monthly"
          value={billingPeriod}
          onValueChange={(value) => setBillingPeriod(value as 'monthly' | 'annual')}
          className="mx-auto mb-10 w-fit"
        >
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="annual">Annual (Save 33% + Free Setup)</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start divide-y pt-8 md:grid-cols-3 md:divide-x md:divide-y-0">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              hover="noShadow"
              className={cn(
                'relative font-medium',
                plan.planType === 'basic' &&
                  'md:rounded-bl-base! rounded-b-none pb-10 md:rounded-r-none! md:pb-0',

                plan.planType === 'pro' &&
                  'bg-brand-blue text-brand-blue-foreground dark:bg-background dark:text-foreground z-10 scale-105',

                plan.planType === 'enterprise' &&
                  'md:rounded-tr-base! bg-foreground text-background dark:bg-primary-accent dark:border-primary-accent dark:text-primary-accent-foreground rounded-tl-none! rounded-tr-none! md:rounded-bl-none!',
              )}
            >
              {plan.planType === 'pro' && (
                <Badge className="bg-brand-pink text-brand-pink-foreground absolute top-0 left-1/2 inline-block w-auto -translate-x-1/2 -translate-y-1/2 px-3 py-1 font-semibold">
                  Most Popular
                </Badge>
              )}

              <CardHeader>
                <CardTitle
                  className={cn(
                    'font-title text-foreground mt-4 text-2xl',
                    plan.planType === 'pro' &&
                      'line-stroke text-brand-blue-foreground dark:text-brand-pink',
                    plan.planType === 'enterprise' && 'text-primary',
                  )}
                >
                  {plan.name}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="rounded-base mx-0 flex flex-col items-center justify-center">
                <div
                  className={cn(
                    'text-muted-foreground w-full border-t-2 border-b-2 p-4',
                    'flex flex-col items-center justify-center',
                    plan.planType === 'basic' &&
                      'border-brand-blue bg-accent dark:bg-gray-800',
                    plan.planType === 'pro' &&
                      'border-primary text-brand-blue-foreground dark:text-muted-foreground dark:bg-brand-pink/10 dark:border-brand-pink',
                    plan.planType === 'enterprise' &&
                      'border-primary dark:bg-primary/10 text-white',
                  )}
                >
                  <div>
                    {plan.planType !== 'enterprise' ? (
                      <>
                        <div className="flex items-end justify-center gap-0">
                          <div
                            className={cn(
                              'text-foreground text-3xl font-bold dark:text-white',
                              plan.planType === 'pro' &&
                                'text-primary line-stroke dark:text-brand-pink',
                            )}
                          >
                            {typeof plan.monthlyPrice === 'number'
                              ? `£${plan.monthlyPrice}`
                              : plan.monthlyPrice}
                          </div>
                          <div>
                            /
                            {billingPeriod === 'monthly'
                              ? 'month'
                              : 'month, billed annually'}
                          </div>
                        </div>

                        {billingPeriod === 'monthly' ? (
                          <div className="mb-0 flex items-baseline justify-center gap-1">
                            Plus
                            <div className="font-bold">
                              {typeof plan.setupFee === 'number'
                                ? `£${plan.setupFee}`
                                : plan.setupFee}
                            </div>
                            <div
                              className={cn(
                                'text-muted-foreground',
                                plan.planType === 'pro' &&
                                  'text-brand-blue-foreground dark:text-muted-foreground',
                              )}
                            >
                              setup fee
                            </div>
                          </div>
                        ) : (
                          <div className="text-center font-semibold">Setup is free!</div>
                        )}
                      </>
                    ) : (
                      <div className="font-semibold text-white">
                        <h2 className="line-stroke text-xl font-bold text-white">
                          Custom pricing
                        </h2>
                        {/* <p>Adapted to your needs</p> */}
                      </div>
                    )}
                  </div>
                </div>

                <ul
                  className={cn(
                    'dark:text-foreground w-full space-y-3 px-8 py-10 text-left',
                  )}
                >
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="mt-0.5 mr-3">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="w-full px-4">
                  <Button
                    className={cn('w-full')}
                    size="xl"
                    variant={
                      plan.planType === 'pro'
                        ? 'primary'
                        : plan.planType === 'enterprise'
                          ? 'default'
                          : 'outline'
                    }
                    hover={plan.planType === 'enterprise' ? 'noShadow' : 'reverse'}
                    asChild
                  >
                    <Link to="/contact">{plan.action}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
