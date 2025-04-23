import { useState } from 'react'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent } from '~/components/ui/card'
import { GridPattern } from '~/components/ui/grid-pattern'
import { Slider } from '~/components/ui/slider'
import { cn } from '~/lib/utils'

export function ProblemSection() {
  const [hours, setHours] = useState(10)
  const [rate, setRate] = useState(50)
  const weeklyCost = hours * rate
  const monthlyCost = weeklyCost * 4
  const yearlyCost = monthlyCost * 12

  // Calculate ROI
  const monthlyAgentCost = 100 // Base cost of an agent
  const monthlySavings = monthlyCost - monthlyAgentCost
  const yearlyROI = (monthlySavings * 12) / monthlyAgentCost
  const roiPercentage = Math.floor(yearlyROI * 100)

  const painPoints = [
    {
      title: 'Drowning in Repetition',
      description:
        'Valuable hours lost that could be used to focus on... well, anything else.',
      icon: (
        <img
          src={`${import.meta.env.VITE_ASSETS_URL || ''}/whirrls/time_icon.svg`}
          alt="Time Icon"
          className="dark:svg-white h-10 w-10 dark:opacity-50"
        />
      ),
      color: 'bg-brand-pink',
    },
    {
      title: 'Hidden Labor Costs',
      description:
        'Every manual process requires human attention that costs 3-5x more than automation. Time is money, we should not waste it!',
      icon: (
        <img
          src={`${import.meta.env.VITE_ASSETS_URL || ''}/whirrls/money_icon.svg`}
          alt="Money Icon"
          className="dark:svg-white h-10 w-10 dark:opacity-50"
        />
      ),
      color: 'bg-brand-blue',
    },
    {
      title: 'Inconsistent Quality',
      description:
        'Human error leads to variable outcomes in routine work. \nWe can do better!',
      icon: (
        <img
          src={`${import.meta.env.VITE_ASSETS_URL || ''}/whirrls/alien_icon.svg`}
          alt="Alien Icon"
          className="dark:svg-white h-10 w-10 dark:opacity-50"
        />
      ),
      color: 'bg-brand-purple',
    },
    {
      title: 'Slow Response Times',
      description:
        'Manual workflows delay responses to market opportunities. \nIf only we could respond faster...',
      icon: (
        <img
          src={`${import.meta.env.VITE_ASSETS_URL || ''}/whirrls/bolt_icon.svg`}
          alt="Bolt Icon"
          className="dark:svg-white h-10 w-10 dark:opacity-50"
        />
      ),
      color: 'bg-brand-green',
    },
  ]

  return (
    <div className="bg-muted/10 relative w-full py-20">
      <GridPattern className="opacity-50" />

      <div className="container-marketing relative z-10">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-4xl">
            The
            {' '}
            <span className="text-brand-red">True Cost</span>
            {' '}
            of Manual Work
          </h2>
          <p className="text-muted-foreground mx-auto max-w-[800px] text-2xl">
            Every hour spent on tasks that could be automated is time and money wasted.
            See how much manual processes are really costing your business.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Right Column: Pain Points */}
          <div className="mt-4 lg:mt-0">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {painPoints.map((point, index) => (
                <Card
                  key={point.title}
                  hover="reverse"
                  className={cn(index % 2 === 0 ? 'translate-y-0' : 'md:translate-y-12')}
                >
                  <CardContent className="flex flex-col gap-3">
                    <div className="ml-auto">{point.icon}</div>

                    <div>
                      <h4 className="text-lg font-semibold">{point.title}</h4>
                      <p className="text-muted-foreground mt-1 text-base">
                        {point.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Left Column: Visual/Chart */}
          <div className="flex flex-col items-center justify-center">
            <div className="mb-8 w-full max-w-md">
              <Card className="border-2 shadow">
                <CardContent className="p-6">
                  <h3 className="text-foreground font-medium">
                    How much do you spend on
                    {' '}
                    <span className="text-brand-red">manual work?</span>
                  </h3>

                  <div className="mt-8 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label htmlFor="hours" className="text-sm font-medium">
                          Hours spent on repetitive tasks weekly
                        </label>
                        <span className="text-sm font-semibold">
                          {hours}
                          {' '}
                          hrs
                        </span>
                      </div>
                      <Slider
                        id="hours"
                        min={1}
                        max={40}
                        step={1}
                        value={[hours]}
                        onValueChange={value => setHours(value[0])}
                        className="py-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label htmlFor="rate" className="text-sm font-medium">
                          Hourly labor cost
                        </label>
                        <span className="text-sm font-semibold">
                          $
                          {rate}
                          /hr
                        </span>
                      </div>
                      <Slider
                        id="rate"
                        min={10}
                        max={200}
                        step={5}
                        value={[rate]}
                        onValueChange={value => setRate(value[0])}
                        className="py-2"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-1">
                    <div className="text-brand-red text-center">
                      <p className="text-base font-semibold">
                        $
                        {weeklyCost.toLocaleString()}
                        {' '}
                        <span className="text-xs font-normal">/ week</span>
                      </p>
                    </div>

                    <div className="text-brand-red text-center">
                      <p className="text-lg font-semibold">
                        $
                        {monthlyCost.toLocaleString()}
                        {' '}
                        <span className="text-sm font-normal">/ month</span>
                      </p>
                    </div>

                    <div className="text-brand-red text-center">
                      <p className="text-2xl font-semibold">
                        $
                        {yearlyCost.toLocaleString()}
                        {' '}
                        <span className="text-lg font-normal">/ year</span>
                      </p>
                    </div>
                  </div>

                  <div className="border-muted mt-6 border-t-2 pt-4">
                    <h4 className="dark:text-secondary font-title text-lg font-bold">
                      Return on Investment:
                    </h4>
                    <div className="mt-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground text-sm font-medium">
                          Monthly savings with AI agent:
                        </span>
                        <Badge
                          variant="secondary"
                          className={
                            monthlySavings < 0
                              ? 'bg-brand-red/10 text-brand-red border-brand-red dark:border-brand-red dark:bg-brand-red/10 dark:text-brand-red'
                              : ''
                          }
                        >
                          $
                          {monthlySavings.toLocaleString()}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-foreground text-sm font-medium">
                          Annual ROI:
                        </span>
                        <Badge
                          variant="secondary"
                          className={
                            roiPercentage < 0
                              ? 'bg-brand-red/10 text-brand-red border-brand-red dark:border-brand-red dark:bg-brand-red/10 dark:text-brand-red'
                              : ''
                          }
                        >
                          {roiPercentage}
                          %
                        </Badge>
                      </div>
                      <p className="text-foreground dark:text-muted-foreground mt-2 text-xs leading-4">
                        AI agents typically pay for themselves within the first month and
                        continue generating returns throughout the year.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
