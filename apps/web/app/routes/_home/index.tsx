import type { NavigationItems } from '~/components/shared/navbar'
import { Separator } from '@gingga/ui/components/separator'
import { createFileRoute } from '@tanstack/react-router'
import { Footer } from '~/components/shared/footer'
import { Navbar } from '~/components/shared/navbar'
import { AgenticEmployees } from '~/features/agent/components/agentic-employees'
import { AgentsHero } from '~/features/agent/components/agents-hero'
import { AgentsIntroduction } from '~/features/agent/components/agents-introduction'
import { CtaSection } from '~/features/agent/components/cta-section'
import { FaqSection } from '~/features/agent/components/faq-section'
import { IntegrationCapabilities } from '~/features/agent/components/integration-capabilities'
import { ProblemSection } from '~/features/agent/components/problem-section'
import { SquadPricing } from '~/features/agent/components/squad-pricing'

// Define custom navigation for agents page
const agentsNavigation: NavigationItems = [
  { name: 'How does it work?', href: '/#process' },
  { name: 'Agents', href: '/#agents' },
  { name: 'Pricing', href: '/#pricing' },
  { name: 'FAQ', href: '/#faq' },
]

export const Route = createFileRoute('/_home/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex w-full flex-col items-center">
      <Navbar navigation={agentsNavigation} />

      {/* Add top padding to account for fixed navbar */}
      <div className="w-full">
        {/* Hero Section */}
        <AgentsHero />
        <Separator className="h-[2px]" />

        {/* Agents Introduction Section */}
        <div id="process" className="w-full">
          <AgentsIntroduction />
        </div>
        <Separator className="h-[2px]" />

        {/* Problem Section */}
        <div id="problem" className="w-full">
          <ProblemSection />
        </div>
        <Separator className="h-[2px]" />

        {/* Meet Our Agents with Interactive Demo */}
        <div id="agents" className="w-full">
          <AgenticEmployees />
        </div>
        <Separator className="h-[2px]" />

        {/* Integration Capabilities */}
        <IntegrationCapabilities />
        <Separator className="h-[2px]" />

        {/* Squad Pricing */}
        <div id="pricing" className="w-full">
          <SquadPricing />
        </div>
        <Separator className="h-[2px]" />

        {/* FAQ Section */}
        <div id="faq" className="w-full">
          <FaqSection />
        </div>

        {/* Final CTA */}
        <CtaSection />
      </div>

      <Footer />
    </div>
  )
}
