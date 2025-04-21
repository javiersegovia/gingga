import { Card, CardContent } from '@gingga/ui/components/card'
import { cn } from '@gingga/ui/lib/utils'
import { CheckCircle, Circle } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'

const originalPhasesData = [
  {
    title: 'Phase 1: Validation (Apr–Jun)',
    goals: [
      'Functional MVP onboarding flow, friction-free',
      '3 TikTok avatar influencers running for lead generation',
      'First referral activated + 10 active paying users (>70% weekly usage)',
      'Semi-automated onboarding + first customer testimonial recorded',
    ],
    target: 'Goal: 18 total users with clear retention indicators',
    status: 'in-progress',
  },
  {
    title: 'Phase 2: Growth Engine (Jul–Sep)',
    goals: [
      'Launch light white label + fully automated onboarding',
      'First mini-cohort of 10 new users',
      'Referral system with tracking and rewards live',
      'Testimonial videos + TikToks/Shorts published 2x/week',
      '3 active niche landing pages (Sales agents, Creators, Service providers)',
    ],
    target: 'Goal: Active cohorts + CAC vs retention tracked',
    status: 'upcoming',
  },
  {
    title: 'Phase 3: Scale Ready (Oct–Dec)',
    goals: [
      'Referral payout system operational',
      'Content calendar automated',
      'Legal compliance for payouts validated',
      'Checkpoint: 250 active users + £10K MRR',
    ],
    target: '',
    status: 'upcoming',
  },
]

type PhaseStatus = 'completed' | 'in-progress' | 'upcoming'

function formatDescription(goals: string[], target: string): string {
  let desc = goals.map(g => `- ${g}`).join('\n')
  if (target) {
    desc += `\n\n**${target}**`
  }
  return desc
}

const statusIcons: Record<PhaseStatus, React.ElementType> = {
  'completed': CheckCircle,
  'in-progress': Circle,
  'upcoming': Circle,
}

const statusColors: Record<PhaseStatus, string> = {
  'completed': 'text-green-500 border-green-500',
  'in-progress': 'text-amber-500 border-amber-500 fill-amber-500',
  'upcoming': 'text-muted-foreground border-border',
}

export function RoadmapSection() {
  const [activePhase, setActivePhase] = useState<string | null>(null)

  const handlePhaseClick = (title: string): void => {
    setActivePhase(activePhase === title ? null : title)
  }

  return (
    <motion.section
      className="flex min-h-screen flex-col items-center justify-center gap-12 p-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-5xl font-bold tracking-tight lg:text-7xl">Roadmap 2025</h2>

      <div className="relative mt-10 w-full max-w-3xl">
        <div className="bg-border absolute top-0 left-[22px] h-full w-0.5" />

        <div className="space-y-8">
          {originalPhasesData.map((phase) => {
            const StatusIcon = statusIcons[phase.status as PhaseStatus]
            const isActive = activePhase === phase.title
            const description = formatDescription(phase.goals, phase.target)

            return (
              <div
                key={phase.title}
                className={cn(
                  'relative flex flex-col gap-4 transition-all md:flex-row md:items-start',
                )}
              >
                <div
                  className={cn(
                    'bg-background z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    statusColors[phase.status as PhaseStatus],
                  )}
                >
                  <StatusIcon className={cn('h-6 w-6')} />
                </div>

                <Card
                  className={cn(
                    'flex-1 cursor-pointer transition-all duration-200',
                    isActive && 'ring-primary ring-2',
                  )}
                  onClick={() => handlePhaseClick(phase.title)}
                  design="grid"
                  hover="reverse"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">{phase.title}</h3>
                      <div
                        className={cn(
                          'text-sm font-medium capitalize',
                          statusColors[phase.status as PhaseStatus].split(' ')[0],
                        )}
                      >
                        {phase.status.replace('-', ' ')}
                      </div>
                    </div>

                    <p
                      className={cn(
                        'text-muted-foreground mt-2 whitespace-pre-line transition-all duration-300',
                      )}
                    >
                      {description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-foreground mt-8 text-center text-xl font-semibold lg:text-2xl">
        The roadmap is real. We&apos;re not just exploring—we&apos;re executing.
      </p>
    </motion.section>
  )
}
