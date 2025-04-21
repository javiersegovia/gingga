import { DotPattern } from '@gingga/ui/components/dot-pattern'
import { createFileRoute } from '@tanstack/react-router'
import { CoverSection } from './_components/CoverSection'
import { FinalThoughtSection } from './_components/FinalThoughtSection'
import { RoadmapSection } from './_components/RoadmapSection'
import { SharedOpportunitySection } from './_components/SharedOpportunitySection'
import { StrategicAllianceSection } from './_components/StrategicAllianceSection'
import { TheTeamSection } from './_components/TheTeamSection'
import { WhatIsGinggaSection } from './_components/WhatIsGinggaSection'
import { WhoIAmSection } from './_components/WhoIAmSection'
import { WhyNowSection } from './_components/WhyNowSection'

export const Route = createFileRoute('/_proposals/exsis/')({
  component: ExsisProposalPage,
})

function ExsisProposalPage() {
  return (
    <main
      data-theme="dark"
      className="text-foreground bg-background relative min-h-screen dark:bg-zinc-950"
    >
      <DotPattern width={20} height={20} opacity={0.3} />
      <div className="relative z-10 flex flex-col">
        {/* Each section represents a slide */}
        <CoverSection />
        <WhoIAmSection />
        <SharedOpportunitySection />
        <WhatIsGinggaSection />
        <section className="py-16">
          <WhyNowSection />
        </section>
        <section className="py-16">
          <TheTeamSection />
        </section>
        <section className="py-16">
          <RoadmapSection />
        </section>
        <section className="py-16">
          <StrategicAllianceSection />
        </section>
        <FinalThoughtSection />
      </div>
    </main>
  )
}
