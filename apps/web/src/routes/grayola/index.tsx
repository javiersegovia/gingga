import { createFileRoute } from '@tanstack/react-router'
import { DotPattern } from '~/components/ui/dot-pattern'
import { AIAgentsSection } from './_components/AIAgentsSection'
import { CaseStudiesSection } from './_components/CaseStudiesSection'
import { DeliverablesSection } from './_components/DeliverablesSection'
import { FoundersSection } from './_components/FoundersSection'
import { HeroSection } from './_components/HeroSection'
import { HybridTeamsSection } from './_components/HybridTeamsSection'
import { PricingSection } from './_components/PricingSection'
import { SpeedGuaranteeSection } from './_components/SpeedGuaranteeSection'

export const Route = createFileRoute('/grayola/')({
  component: GrayolaPage,
})

function GrayolaPage() {
  return (
    <main
      data-theme="dark"
      className="text-foreground bg-background relative min-h-screen dark:bg-zinc-950"
    >
      {/* <GridPattern width={60} height={60} opacity={0.3} /> */}
      <DotPattern width={20} height={20} opacity={0.3} />
      <div className="relative z-10">
        <HeroSection />
        <FoundersSection />
        <AIAgentsSection />
        <HybridTeamsSection />
        <DeliverablesSection />
        <SpeedGuaranteeSection />
        <CaseStudiesSection />
        <PricingSection />
      </div>
    </main>
  )
}
