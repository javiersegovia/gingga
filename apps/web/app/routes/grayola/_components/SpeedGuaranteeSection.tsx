import { Badge } from '@gingga/ui/components/badge'
import { Card, CardContent, CardDescription, CardTitle } from '@gingga/ui/components/card'
import { Clock, TrendingUp, Zap } from 'lucide-react'

export function SpeedGuaranteeSection() {
  return (
    <>
      <section className="bg-background border-border relative w-full border-b py-16 md:py-24 dark:bg-zinc-950">
        <div className="diagonal-pattern absolute inset-0"></div>
        <div className="container-marketing relative z-10 p-6 py-16 md:py-24">
          <div className="mb-12 text-center">
            <Badge className="bg-brand-blue text-brand-blue-foreground mb-4">
              Our Guarantee
            </Badge>
            <h2 className="text-foreground mx-auto mb-4 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
              Results at
              {' '}
              <br />
              <span className="text-brand-pink line-stroke">Maximum Speed</span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-[800px] text-xl">
              We understand that startups need to move fast. Our delivery timeline is
              designed to match your pace and get you to market quickly.
            </p>
          </div>

          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-3 md:px-4">
            <Card hover="reverse" design="grid" className="relative overflow-hidden p-0">
              <CardContent className="relative z-20 p-6">
                <TrendingUp className="text-brand-blue h-16 w-16" />
                <CardTitle className="mt-4 text-xl font-bold">Full Power Mode</CardTitle>
                <CardDescription className="text-foreground mt-2 text-3xl font-bold">
                  4-6 weeks
                </CardDescription>
                <p className="text-muted-foreground mt-2">
                  Complete MVP ready for investors with fully functional features
                </p>
              </CardContent>
            </Card>

            <Card hover="reverse" design="grid" className="relative overflow-hidden p-0">
              <CardContent className="relative z-20 p-6">
                <Clock className="text-brand-green h-16 w-16" />
                <CardTitle className="mt-4 text-xl font-bold">Discovery Mode</CardTitle>
                <CardDescription className="text-foreground mt-2 text-3xl font-bold">
                  2-3 weeks
                </CardDescription>
                <p className="text-muted-foreground mt-2">
                  Prototype or initial test ready to validate your key assumptions
                </p>
              </CardContent>
            </Card>

            <Card hover="reverse" design="grid" className="relative overflow-hidden p-0">
              <CardContent className="relative z-20 p-6">
                <Zap className="text-brand-pink h-16 w-16" />
                <CardTitle className="mt-4 text-xl font-bold">Growth Mode</CardTitle>
                <CardDescription className="text-foreground mt-2 text-3xl font-bold">
                  Continuous
                </CardDescription>
                <p className="text-muted-foreground mt-2">
                  Ongoing scaling and iteration to grow your startup and improve metrics
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
