import { TrendingUp, Zap } from 'lucide-react'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

interface Reason {
  title: string
  points: string[]
  icon: React.ElementType
}

const reasonsData: Reason[] = [
  {
    title: 'Market Maturity:',
    points: [
      'Latest LLMs (GPT-4.5, Claude 3.5, Llama 4, Gemini 2.0) = mature infra',
      'Businesses want AI to work, not demo',
      '2024: testing, 2025: execution',
    ],
    icon: TrendingUp,
  },
  {
    title: 'Gingga\'s Role:',
    points: ['Gingga is the execution layer'],
    icon: Zap,
  },
]

export function WhyNowSection() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden p-8">
      <h2 className="text-center text-5xl font-bold tracking-tight lg:text-7xl">
        Why Now?
      </h2>

      <div className="mt-6 grid w-full max-w-4xl grid-cols-1 gap-8 text-lg md:grid-cols-2 lg:text-xl">
        {reasonsData.map((reason) => {
          const IconComponent = reason.icon
          return (
            <div key={reason.title}>
              <Card
                className="h-full transform transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
                design="grid"
                hover="reverse"
              >
                <CardHeader className="flex-row items-center gap-4 pb-4">
                  <span className="bg-primary/10 text-primary rounded-full p-3">
                    <IconComponent className="h-6 w-6" />
                  </span>
                  <CardTitle className="text-foreground text-xl font-semibold">
                    {reason.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-muted-foreground list-disc space-y-2 pl-5">
                    {reason.points.map((point, _pIndex) => (
                      <li key={point}>
                        {point.includes('work')
                          ? point.split('work').map((part, i) =>
                              i < point.split('work').length - 1
                                ? (
                                    <React.Fragment key={part}>
                                      {part}
                                      <span className="text-primary font-semibold">work</span>
                                    </React.Fragment>
                                  )
                                : (
                                    part
                                  ),
                            )
                          : point.includes('2025: execution')
                            ? point.split('2025: execution').map((part, i) =>
                                i < point.split('2025: execution').length - 1
                                  ? (
                                      <React.Fragment key={part}>
                                        {part}
                                        <span className="text-primary font-semibold">
                                          2025: execution
                                        </span>
                                      </React.Fragment>
                                    )
                                  : (
                                      part
                                    ),
                              )
                            : point.includes('execution layer')
                              ? point.split('execution layer').map((part, i) =>
                                  i < point.split('execution layer').length - 1
                                    ? (
                                        <React.Fragment key={part}>
                                          {part}
                                          <span className="text-primary font-semibold">
                                            execution layer
                                          </span>
                                        </React.Fragment>
                                      )
                                    : (
                                        part
                                      ),
                                )
                              : point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      <p className="text-muted-foreground mt-12 max-w-4xl text-center text-xl lg:text-2xl">
        In this market shift, Gingga is perfectly positioned to help businesses adopt real
        AI fast—something Exsis can offer at scale with the right partner.
      </p>
    </section>
  )
}
