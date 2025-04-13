import { Badge } from '@gingga/ui/components/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@gingga/ui/components/card'
import { Scale, Layers3, Copyleft, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const allianceIdeas: {
  title: string
  exsis?: string
  gingga?: string
  description?: string
  icon: LucideIcon
}[] = [
  {
    title: 'Market Split by Size',
    exsis: 'Enterprise AI deployment',
    gingga: 'SMB + mid-market GTM agents',
    icon: Scale,
  },
  {
    title: 'Gingga Stack + Exsis Execution',
    exsis: 'Scales builds and client delivery',
    gingga: 'Provides agents + strategy',
    icon: Layers3,
  },
  {
    title: 'White-Label AI Agent Platform',
    exsis: 'Exsis-branded agent product powered by Gingga',
    gingga: '', // Gingga's role implied
    icon: Copyleft,
  },
  {
    title: 'Selective Raise Support',
    description: 'For aligned partners ready to accelerate strategic milestones',
    icon: TrendingUp,
  },
]

export const StrategicAllianceSection = () => {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-12 p-8">
      <h2 className="text-5xl font-bold tracking-tight lg:text-7xl">
        Strategic Alliance Ideas
      </h2>

      <p className="text-muted-foreground max-w-3xl text-center text-xl lg:text-2xl">
        Why Gingga is the right partner: You don&apos;t need to build from scratch—you
        need a fast-moving partner who&apos;s already built the core.
      </p>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {allianceIdeas.map((idea) => {
          const Icon = idea.icon
          return (
            <Card key={idea.title} design="grid" hover="reverse">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="bg-primary/10 text-primary mt-1 rounded-full p-3">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl">{idea.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {idea.description ? (
                  <p>{idea.description}</p>
                ) : (
                  <div className="space-y-2">
                    {idea.exsis && (
                      <p>
                        <span className="text-foreground font-semibold">Exsis:</span>{' '}
                        {idea.exsis}
                      </p>
                    )}
                    {idea.gingga && (
                      <p>
                        <span className="text-foreground font-semibold">Gingga:</span>{' '}
                        {idea.gingga}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
