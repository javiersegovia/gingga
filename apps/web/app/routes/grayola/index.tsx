import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from './_components/HeroSection'
import { FoundersSection } from './_components/FoundersSection'
import { AIAgentsSection } from './_components/AIAgentsSection'
import { HybridTeamsSection } from './_components/HybridTeamsSection'
import { DeliverablesSection } from './_components/DeliverablesSection'
import { SpeedGuaranteeSection } from './_components/SpeedGuaranteeSection'
import { CaseStudiesSection } from './_components/CaseStudiesSection'
import { PricingSection } from './_components/PricingSection'
import { DotPattern } from '@gingga/ui/components/dot-pattern'

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
