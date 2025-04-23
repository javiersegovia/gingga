import { Link } from '@tanstack/react-router'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { GridPattern } from '~/components/ui/grid-pattern'

const faqs = [
  {
    question: 'What exactly are AI agents and how do they work?',
    answer: `AI agents are autonomous software programs powered by artificial intelligence that can perform tasks, make decisions, and interact with users and other systems. They work by combining natural language processing, machine learning, and integration capabilities to understand requests, access necessary tools and data, and execute actions on your behalf.`,
  },
  {
    question: 'Is AI complicated to implement for my business?',
    answer: `Not at all! We've designed our AI agent platform to be extremely accessible for non-technical users. Our process simplifies everything - you don't need to understand the technical details of AI. We handle all the complexity, while you benefit from the streamlined workflows and automation. The interface is intuitive and user-friendly, making AI accessible to businesses of all technical capabilities.`,
  },
  {
    question: 'How quickly can I deploy an AI agent for my business?',
    answer: `Our streamlined process allows us to deploy custom AI agents in just 3-5 days from initial discovery to full implementation. This rapid timeline is possible because of our specialized focus on specific use cases and our battle-tested deployment process. We'll work closely with you during the discovery phase to understand your needs and then move quickly to configure and deploy your personalized AI assistant.`,
  },
  {
    question: 'How secure is the data handled by your AI agents?',
    answer: `Security is our top priority. Each client's agent operates with a dedicated, isolated database, ensuring complete separation of data between different clients. All data processed by our AI agents is encrypted both in transit and at rest. We implement strict access controls, regular security audits, and comply with industry standards. Our agents only access the data they need to perform specific tasks, and you maintain full control over permissions and access levels.`,
  },
  {
    question: 'What\'s your pricing model?',
    answer: `We use a transparent pricing model consisting of a one-time setup fee for creating and training your custom AI agent, followed by an affordable monthly subscription for ongoing maintenance and updates. This approach ensures you get a fully customized solution without the high ongoing costs typically associated with custom AI implementations. We can demonstrate clear ROI calculations based on the time and resources your agent will save.`,
  },
  {
    question: 'Can AI agents integrate with our existing software and tools?',
    answer: `Absolutely! Our AI agents are designed to seamlessly integrate with a wide range of business tools and platforms. We specialize in WhatsApp integration for customer support, but also support website chat embeds, Telegram, Slack, email services, and CRMs. We can develop custom integrations for your specific tech stack as needed.`,
  },
  {
    question: 'How do you make AI agents feel friendly and approachable?',
    answer: `We design our AI agents with a playful, conversational interface that makes interacting with them feel more like a game than a tech experience. The friendly tone, intuitive interactions, and personalized responses create an engaging experience that users actually enjoy. This approach helps overcome the intimidation factor often associated with AI technology and encourages adoption across your organization.`,
  },
  {
    question: 'Do we need technical expertise to use and manage AI agents?',
    answer: `No technical expertise is required. Our platform is designed specifically for non-technical users with user-friendly interfaces for configuring and managing AI agents. We provide comprehensive training and support during the handoff phase to ensure your team can effectively utilize all features. The day-to-day operation is as simple as using a messaging app.`,
  },
  {
    question: 'What kind of ROI can we expect from implementing AI agents?',
    answer: `Businesses typically see ROI in three main areas: time savings (40-80 hours per month per agent), cost reduction (up to 70% decrease in operational costs for automated tasks), and improved accuracy (up to 90% reduction in human error). Most clients achieve positive ROI within the first month of implementation, with increased returns as agents learn and optimize over time.`,
  },
  {
    question: 'How do you measure the success of AI agent implementation?',
    answer: `We track specific metrics to demonstrate concrete ROI, focusing primarily on time saved through automated interactions. By calculating the number of workflows or conversations handled by your AI agent each month and multiplying by average handling time, we provide clear visibility into labor cost savings. We also track customer satisfaction metrics, response times, and other KPIs specific to your business goals.`,
  },
  {
    question: 'What happens if an AI agent encounters a problem it can\'t solve?',
    answer: `Our agents are designed with robust escalation protocols. When they encounter a situation beyond their capabilities, they can automatically escalate to human team members, providing all relevant context and information. This ensures that complex issues receive appropriate human attention while still benefiting from AI assistance. During the "Evolve" phase of our process, we continuously refine these protocols based on real-world usage.`,
  },
]

export function FaqSection() {
  return (
    <div className="bg-muted/5 relative w-full py-16 md:py-20">
      <GridPattern className="opacity-50" />

      <div className="container-marketing relative z-10 px-4">
        {/* Changed to flex-col on mobile, flex-row on larger screens */}
        <div className="flex flex-col gap-9 md:flex-row md:gap-12">
          {/* Move sidebar to the top on mobile, bottom on desktop */}
          <div className="order-1 mb-8 w-full md:order-2 md:mb-0 md:w-1/3 lg:w-1/4">
            <div className="space-y-6 md:sticky md:top-[calc(4rem+5vh)]">
              <div>
                <Badge className="bg-brand-green text-brand-green-foreground mb-4">
                  FAQ
                </Badge>
                <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                  Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground mb-6 max-w-[500px] text-base sm:text-lg">
                  Everything you need to know about our AI agents and how they can
                  transform your business
                </p>
              </div>

              <Button variant="primary" size="xl" className="mt-4 w-full" asChild>
                <Link to="/contact">Book a free consultation call</Link>
              </Button>
            </div>
          </div>

          {/* Main FAQ content */}
          <div className="order-2 w-full md:order-1 md:w-2/3 lg:w-3/4">
            <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
              {faqs.map((faq, index) => (
                <div
                  key={faq.question}
                  className="rounded-base has-data-[state=open]:bg-blank has-data-[state=open]:border-border has-data-[state=open]:shadow-shadow border-2 border-transparent dark:has-data-[state=open]:border-blue-400"
                >
                  <AccordionItem
                    value={`item-${index}`}
                    variant="ghost"
                    className="rounded-base bg-transparent p-0"
                  >
                    <AccordionTrigger
                      variant="ghost"
                      className="font-body rounded-base hover:text-brand-blue dark:hover:text-foreground dark:text-muted-foreground has-data-[state=open]:text-brand-blue px-4 pt-6 text-left text-lg font-medium text-black hover:no-underline sm:text-xl md:px-8 md:pt-8 md:text-2xl"
                    >
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent
                      variant="ghost"
                      className="text-muted-foreground rounded-base bg-blank p-4 pt-0 text-sm sm:text-base dark:bg-transparent"
                    >
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </div>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  )
}
