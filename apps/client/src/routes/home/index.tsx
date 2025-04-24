import type { NavigationItems } from '~/components/shared/navbar'
import { Footer } from '~/components/shared/footer'
import { Navbar } from '~/components/shared/navbar'
import { Separator } from '@gingga/ui/components/separator'
import { AgenticEmployees } from './_components/agentic-employees'
import { AgentsHero } from './_components/agents-hero'
import { AgentsIntroduction } from './_components/agents-introduction'
import { CtaSection } from './_components/cta-section'
import { FaqSection } from './_components/faq-section'
import { IntegrationCapabilities } from './_components/integration-capabilities'
import { ProblemSection } from './_components/problem-section'
import { SquadPricing } from './_components/squad-pricing'

// Define custom navigation for agents page
const agentsNavigation: NavigationItems = [
  { name: 'How does it work?', href: '/#process' },
  { name: 'Agents', href: '/#agents' },
  { name: 'Pricing', href: '/#pricing' },
  { name: 'FAQ', href: '/#faq' },
]

export default function RouteComponent() {
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
