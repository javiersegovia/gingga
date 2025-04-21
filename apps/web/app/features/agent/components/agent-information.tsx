import type { LucideProps } from 'lucide-react'
import type { Agent } from '~/features/agent/components/agentic-employees'
import { Button } from '@gingga/ui/components/button'
import { Card } from '@gingga/ui/components/card'
import { DotPattern } from '@gingga/ui/components/dot-pattern'
import { cn } from '@gingga/ui/lib/utils'
import { Link } from '@tanstack/react-router'
import {
  ArrowRightIcon,
  BarChart2Icon,
  BrainCircuitIcon,
  CodeIcon,
  FileEditIcon,
  HelpCircleIcon,
  LayoutGridIcon,
  LineChartIcon,
  MessageSquareIcon,
  PackageIcon,
  PaletteIcon,
  PieChartIcon,
  SearchIcon,
  ShieldIcon,
  SplitIcon,
  TargetIcon,
  TrendingUpIcon,
  TypeIcon,
  UserPlusIcon,
  ZapIcon,
} from 'lucide-react'

interface AgentInformationProps {
  agent: Agent
  index: number
  className?: string
}

// Map of icon strings to Lucide icon components
const iconMap: Record<string, React.ComponentType<Omit<LucideProps, 'ref'>>> = {
  Code: CodeIcon,
  LayoutGrid: LayoutGridIcon,
  Zap: ZapIcon,
  Shield: ShieldIcon,
  Search: SearchIcon,
  Target: TargetIcon,
  FileEdit: FileEditIcon,
  Type: TypeIcon,
  BarChart2: BarChart2Icon,
  TrendingUp: TrendingUpIcon,
  PieChart: PieChartIcon,
  MessageSquare: MessageSquareIcon,
  HelpCircle: HelpCircleIcon,
  Package: PackageIcon,
  UserPlus: UserPlusIcon,
  Palette: PaletteIcon,
  SplitSquare: SplitIcon,
  LineChart: LineChartIcon,
}

export function AgentInformation({ agent, className }: AgentInformationProps) {
  return (
    <div
      className={cn(
        'rounded-base border-border bg-background relative container w-full overflow-hidden border-2 py-8 sm:py-10 md:py-12',
        className,
      )}
    >
      <div className="absolute inset-0 z-0">
        <DotPattern
          width={32}
          height={32}
          cx={1.5}
          cy={1.5}
          cr={1.5}
          className="fill-foreground/15"
        />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-center">
          {/* Image Column - First on mobile, second on desktop */}
          <div className="flex w-full justify-center md:order-1 md:w-auto">
            <div className="overflow-hidden rounded-xl">
              <div className="relative">
                <img
                  src={agent.imageSrc}
                  alt={agent.title}
                  className="h-full w-full max-w-[240px] sm:max-w-[280px] md:max-w-[320px]"
                />
              </div>
            </div>
          </div>

          {/* Content Column - Second on mobile, first on desktop */}
          <div className="w-full text-center md:order-2 md:max-w-md md:text-left">
            <div className="mb-3 flex flex-col md:flex-row md:items-center">
              <h2
                className={cn(
                  'line-stroke inline-block text-2xl font-bold tracking-tight md:text-3xl',
                  agent.theme.accentForeground,
                )}
              >
                {agent.name}
              </h2>
              <h3
                className={cn(
                  'ml-0 inline-block text-base font-bold tracking-tight md:ml-2 md:text-xl',
                )}
              >
                <span className="hidden md:inline">~</span>
                {' '}
                {agent.title}
                {' '}
                Agent
              </h3>
            </div>

            <p className={cn('mb-4 text-base leading-relaxed md:text-lg')}>
              {agent.description}
            </p>

            <div
              className={cn(
                'mb-6 flex flex-col justify-center gap-3 sm:flex-row md:justify-start',
              )}
            >
              <Link to="/chat/agents">
                <Button
                  size="default"
                  variant="outline"
                  className={cn(
                    'flex w-full items-center justify-center gap-1 sm:w-auto',
                    agent.theme.background,
                    agent.theme.foreground,
                    `hover:${agent.theme.foreground}`,
                  )}
                >
                  Demo chat with
                  <span className="font-bold">{agent.name}</span>
                  <ArrowRightIcon size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mx-auto mt-6 md:mt-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {agent.features.slice(0, 4).map((feature) => {
              const Icon = iconMap[feature.icon] || BrainCircuitIcon

              return (
                <Card
                  key={feature.title}
                  hover="reverse"
                  className="mx-auto flex flex-col items-center gap-3 p-3 transition-all duration-100 sm:p-4 md:flex-row"
                >
                  <div
                    className={cn(
                      'border-border flex h-8 w-8 items-center justify-center self-start rounded-full border-2 sm:h-10 sm:w-10 md:self-center',
                      agent.theme.background,
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 text-white sm:h-5 sm:w-5',
                        agent.theme.foreground,
                      )}
                    />
                  </div>

                  <div className="flex-1">
                    <h5 className="mb-1 text-sm font-medium sm:text-base">
                      {feature.title}
                    </h5>
                    <p className="text-muted-foreground text-xs leading-5 sm:text-sm">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
