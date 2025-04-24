import { Button } from '@gingga/ui/components/button'
import { Marquee } from '@gingga/ui/components/marquee'
import { cn } from '@gingga/ui/lib/utils'
import { ArrowRightIcon, Clock, Zap } from 'lucide-react'
import { Link } from 'react-router'
import { useClientEnv } from '~/hooks/use-client-env'

interface MarqueeItemProps {
  id: string | number
  value: string
  label: string
  color: string
}

function MarqueeItem({ value, label, color }: MarqueeItemProps) {
  return (
    <div className="group mx-16 text-center opacity-40 transition-opacity duration-200 hover:opacity-100">
      <div
        className={cn(
          'font-title text-3xl font-bold transition-colors duration-200',
          'text-foreground/80',
          `group-hover:${color}`,
        )}
      >
        {value}
      </div>
      <p className="text-foreground text-sm font-medium">{label}</p>
    </div>
  )
}

const marqueeItems: MarqueeItemProps[] = [
  { id: 'a', value: '24/7', label: 'Continuous Operation', color: 'text-brand-pink' },
  { id: 'b', value: '70%', label: 'Average Cost Reduction', color: 'text-brand-blue' },
  { id: 'c', value: '90%', label: 'Task Automation Rate', color: 'text-brand-purple' },
  { id: 'd', value: '3-5', label: 'Creation Days', color: 'text-brand-green' },
  { id: 'e', value: '10x', label: 'Faster Development', color: 'text-brand-red' },
  { id: 'f', value: 'ROI', label: 'From First Month', color: 'text-brand-sky' },
  { id: 'g', value: '100%', label: 'Adapted to Your Needs', color: 'text-brand-blue' },
  { id: 'h', value: '$50', label: 'Starting Monthly', color: 'text-brand-purple' },
]

export function AgentsHero() {
  const env = useClientEnv()

  return (
    <>
      <section className="bg-brand-blue text-brand-blue-foreground w-full py-12 md:py-16 lg:py-24 dark:bg-black">
        <div className="container mx-auto px-4 md:max-w-7xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12 lg:gap-16">
            <div className="flex flex-1 flex-col">
              <div>
                <p className="bg-brand-blue/10 text-brand-blue border-brand-blue mb-4 inline-block w-auto rounded-full border-2 px-3 py-1 text-xs font-medium sm:text-sm">
                  AI-Powered Automation for SMBs
                </p>
              </div>
              <h1 className="line-stroke mb-6 text-2xl font-bold text-white sm:text-3xl md:mb-8 md:text-4xl">
                Scale Your Business
                <br />
                with
                {' '}
                <span className="text-primary line-stroke font-semibold">
                  Gingga Agents
                </span>
              </h1>
              <p className="mb-6 text-base sm:text-lg md:mb-8 md:text-xl">
                Personalized AI assistants that automate your operations in just 3-5 days,
                accelerate growth, and free you to focus on what truly matters.
              </p>
              <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8 md:mb-8">
                <div className="flex items-center gap-2">
                  <Zap className="text-brand-pink h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-xs font-medium sm:text-sm">
                    Rapid 3-5 days deployment
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-brand-green h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-xs font-medium sm:text-sm">
                    24/7 availability
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  variant="outline"
                  className="text-brand-blue-foreground dark:hover:border-secondary-accent-foreground dark:hover:text-secondary-accent-foreground dark:hover:bg-secondary-accent hover:bg-secondary hover:text-secondary-foreground"
                  size="xl"
                  asChild
                >
                  <a href="#agents">Explore Agents</a>
                </Button>

                <Button className="" variant="primary" size="xl" asChild>
                  <Link to="/chat">
                    Try For Free
                    <ArrowRightIcon className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mt-8 flex w-full justify-center md:mt-0 md:w-auto">
              <img
                src={`${env.VITE_ASSETS_URL || ''}/automatas/hero_1.webp`}
                alt="AI Agents Illustration"
                className="w-auto max-w-xs scale-x-[-1] sm:max-w-sm md:max-w-md lg:max-w-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="bg-blank border-t-2">
        <Marquee
          pauseOnHover
          className="py-6"
          style={{ '--duration': '60s' } as React.CSSProperties}
          repeat={2}
        >
          {marqueeItems.map(item => (
            <MarqueeItem key={item.id} {...item} />
          ))}
        </Marquee>
      </div>
    </>
  )
}
