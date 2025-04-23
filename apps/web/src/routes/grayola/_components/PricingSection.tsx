/* eslint-disable no-alert */
import { Check } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

export function PricingSection() {
  return (
    <div className="w-full bg-transparent py-24" id="pricing">
      <div className="container-marketing mx-auto px-4 text-center">
        <Badge className="bg-brand-blue text-brand-blue-foreground mb-6 px-3 py-1">
          Pricing
        </Badge>
        <h2 className="mx-auto mb-4 max-w-2xl text-4xl font-bold tracking-tight">
          Built for Speed. Priced for Founders.
        </h2>
        <p className="text-muted-foreground mx-auto mb-12 max-w-[800px] text-xl">
          Leverage fractional leadership, execution power, and AI agents — without hiring
          a full team.
        </p>

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start divide-y pt-8 md:grid-cols-3 md:divide-x md:divide-y-0">
          {/* Discovery Mode */}
          <Card
            hover="noShadow"
            className="relative pb-10 font-medium md:rounded-r-none! md:pb-0"
          >
            <CardHeader>
              <CardTitle className="font-title text-foreground mt-4 text-2xl">
                Discovery Mode
              </CardTitle>
              <CardDescription>Test & Validate</CardDescription>
            </CardHeader>

            <CardContent className="rounded-base mx-0 flex flex-col items-center justify-center">
              <div className="text-muted-foreground border-brand-blue bg-accent flex w-full flex-col items-center justify-center border-t-2 border-b-2 p-4 dark:bg-gray-800">
                <div>
                  <div className="flex items-end justify-center gap-0">
                    <div className="text-foreground text-3xl font-bold dark:text-white">
                      $4,800
                    </div>
                    <div>/month</div>
                  </div>
                </div>
              </div>

              <ul className="dark:text-foreground w-full space-y-3 px-8 py-10 text-left">
                {[
                  '20 Human Hours per Week',
                  'Full AI access + tailored agents',
                  'Prototype or test in 2-3 weeks',
                ].map(feature => (
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
                  className="w-full"
                  size="xl"
                  variant="default"
                  hover="noShadow"
                  onClick={() => {
                    alert(
                      'Contact us at guzman.vla@gmail.com or via WhatsApp for more details.',
                    )
                  }}
                >
                  Select Plan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Full Power Mode */}
          <Card
            hover="noShadow"
            className="bg-brand-blue text-brand-blue-foreground dark:bg-background dark:text-foreground relative z-10 scale-105 font-medium"
          >
            <Badge className="bg-brand-pink text-brand-pink-foreground absolute top-0 left-1/2 inline-block w-auto -translate-x-1/2 -translate-y-1/2 px-3 py-1 font-semibold">
              Most Popular
            </Badge>

            <CardHeader>
              <CardTitle className="font-title line-stroke text-brand-blue-foreground dark:text-brand-pink mt-4 text-2xl">
                Full Power Mode
              </CardTitle>
              <CardDescription>Maximum Velocity</CardDescription>
            </CardHeader>

            <CardContent className="rounded-base mx-0 flex flex-col items-center justify-center">
              <div className="border-primary text-brand-blue-foreground dark:text-muted-foreground dark:bg-brand-pink/10 dark:border-brand-pink flex w-full flex-col items-center justify-center border-t-2 border-b-2 p-4">
                <div>
                  <div className="flex items-end justify-center gap-0">
                    <div className="text-primary line-stroke dark:text-brand-pink text-3xl font-bold">
                      $9,800
                    </div>
                    <div>/month</div>
                  </div>
                </div>
              </div>

              <ul className="dark:text-foreground w-full space-y-3 px-8 py-10 text-left">
                {[
                  '40 Human Hours per Week',
                  'Full AI agents + custom agents',
                  'MVP ready in 4-6 weeks',
                ].map(feature => (
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
                  className="w-full"
                  size="xl"
                  variant="primary"
                  hover="noShadow"
                  onClick={() => {
                    alert(
                      'Contact us at guzman.vla@gmail.com or via WhatsApp for more details.',
                    )
                  }}
                >
                  Select Plan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Growth Mode */}
          <Card
            hover="noShadow"
            className="bg-foreground text-background dark:bg-primary-accent dark:border-primary-accent dark:text-primary-accent-foreground relative font-medium md:rounded-l-none!"
          >
            <CardHeader>
              <CardTitle className="font-title text-primary mt-4 text-2xl">
                Growth Mode
              </CardTitle>
              <CardDescription>Scale & Build</CardDescription>
            </CardHeader>

            <CardContent className="rounded-base mx-0 flex flex-col items-center justify-center">
              <div className="border-primary dark:bg-primary/10 flex w-full flex-col items-center justify-center border-t-2 border-b-2 p-4 text-white">
                <div>
                  <div className="font-semibold text-white">
                    <h2 className="line-stroke text-xl font-bold text-white">
                      Custom pricing
                    </h2>
                  </div>
                </div>
              </div>

              <ul className="dark:text-foreground w-full space-y-3 px-8 py-10 text-left">
                {[
                  'More human hours needed?',
                  'Full AI access',
                  'Contact us for a custom engagement',
                ].map(feature => (
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
                  className="w-full"
                  size="xl"
                  variant="default"
                  hover="noShadow"
                  onClick={() => {
                    alert(
                      'Contact us at guzman.vla@gmail.com or via WhatsApp for more details.',
                    )
                  }}
                >
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pilot Sprint */}
        <div className="mx-auto mt-24 mb-16 max-w-lg">
          <Card
            className="bg-background border-secondary border-2 p-8"
            hover="noShadow"
            design="grid"
          >
            <CardContent className="p-0">
              <h3 className="mb-4 text-center text-2xl font-bold">
                Pilot Sprint — A Quick Test
              </h3>
              <div className="mb-4 flex justify-center">
                <span className="text-primary text-3xl font-bold">$2,800 USD</span>
                <span className="text-muted-foreground ml-2 self-end">(One-Time)</span>
              </div>
              <ul className="mt-10 mb-6 space-y-3 text-left">
                <li className="flex items-start">
                  <div className="mt-0.5 mr-3">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <span className="text-foreground/80">
                    2 Weeks / 40 Human Hours + AI Agents
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mt-0.5 mr-3">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <span className="text-foreground/80">
                    Prototype draft, strategy session, or growth experiment
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mt-0.5 mr-3">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <span className="text-foreground/80">
                    Risk-free: roll into full plan if satisfied
                  </span>
                </li>
              </ul>
              <Button
                // className="bg-black border-primary text-primary-foreground w-full border"
                variant="secondary"
                size="xl"
                className="mt-4"
                onClick={() => {
                  alert(
                    'Contact us at guzman.vla@gmail.com or via WhatsApp for more details.',
                  )
                }}
              >
                Start with a Pilot
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Price Comparison */}
        <div className="mx-auto mb-16 max-w-4xl">
          <h3 className="mb-8 text-center text-2xl font-bold">Price Comparison</h3>
          <Card design="grid" className="relative overflow-hidden">
            <CardContent className="relative z-20 p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-border text-brand-red border-b p-4 text-left font-semibold">
                        Hiring a Full Team
                      </th>
                      <th className="border-border text-brand-green border-b p-4 text-left font-semibold">
                        Our Hybrid Execution Squad
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-border border-b p-4 text-left">
                        <span className="flex items-center">
                          <span className="bg-muted text-foreground mr-2 flex h-6 w-6 items-center justify-center rounded-full">
                            👨‍💻
                          </span>
                          CTO: $12K/month
                        </span>
                      </td>
                      <td className="border-border border-b p-4 text-left">
                        <span className="flex items-center">
                          <span className="bg-brand-blue/20 text-brand-blue mr-2 flex h-6 w-6 items-center justify-center rounded-full">
                            🤖
                          </span>
                          Fractional CTO + CPO + AI Agents
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border-border border-b p-4 text-left">
                        <span className="flex items-center">
                          <span className="bg-muted text-foreground mr-2 flex h-6 w-6 items-center justify-center rounded-full">
                            💻
                          </span>
                          Senior Developer: $8K/month
                        </span>
                      </td>
                      <td className="border-border border-b p-4 text-left">
                        <span className="flex items-center">
                          <span className="bg-brand-green/20 text-brand-green mr-2 flex h-6 w-6 items-center justify-center rounded-full">
                            🚀
                          </span>
                          Investor-ready MVP / Growth Loops
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border-border border-b p-4 text-left">
                        <span className="flex items-center">
                          <span className="bg-muted text-foreground mr-2 flex h-6 w-6 items-center justify-center rounded-full">
                            🎨
                          </span>
                          PM / UX: $7K/month
                        </span>
                      </td>
                      <td className="border-border border-b p-4 text-left">
                        <span className="flex items-center">
                          <span className="bg-brand-pink/20 text-brand-pink mr-2 flex h-6 w-6 items-center justify-center rounded-full">
                            ⚡
                          </span>
                          Speed: MVP in 4-6 weeks
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border-border border-b p-4 text-left font-bold">
                        <span className="flex items-center">
                          <span className="bg-muted text-foreground mr-2 flex h-6 w-6 items-center justify-center rounded-full">
                            💰
                          </span>
                          Total: $27K+/month
                        </span>
                      </td>
                      <td className="border-border border-b p-4 text-left font-bold">
                        <span className="flex items-center">
                          <span className="bg-primary/20 text-primary mr-2 flex h-6 w-6 items-center justify-center rounded-full">
                            💎
                          </span>
                          Our Plans: $5,900 – $10,900/month
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <p className="text-primary mt-6 text-center text-xl font-bold">
            Save 50%+ burn while building twice as fast.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="mb-6 text-xl">
            Secure your Hybrid Execution Team — Let&apos;s build your next product.
          </p>
          <Button
            size="xl"
            variant="primary"
            className="rounded-xl px-8 py-6 text-lg font-bold"
            onClick={() => {
              alert(
                'Contact us at guzman.vla@gmail.com or via WhatsApp for more details.',
              )
            }}
          >
            Contact Us to Get Started
          </Button>
          <p className="text-muted-foreground mt-6 text-sm">
            Risk-free onboarding: Pause anytime in the first 2 weeks if we&apos;re not
            adding value.
          </p>
        </div>
      </div>
    </div>
  )
}
