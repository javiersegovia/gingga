import { Link } from 'react-router'
import { ArrowRightIcon, SparklesIcon } from 'lucide-react'
import { Badge } from '@gingga/ui/components/badge'
import { Button } from '@gingga/ui/components/button'
import { AgentInformation } from './agent-information'

// STYLING NOTE: Using brand colors as primary accent colors

export interface Agent {
  id: string
  title: string
  name: string
  shortDescription: string
  description: string
  features: {
    title: string
    description: string
    icon: string
  }[]
  useCases: string[]
  exampleActions: string[]
  predefinedActions: {
    title: string
    description: string
    icon: string
  }[]
  timelineEvents: {
    title: string
    description: string
    time: string
  }[]
  imageSrc: string

  theme: {
    background: string
    foreground: string
    accentForeground: string
  }
}

const agents: Agent[] = [
  {
    id: 'customer-support',
    name: 'FL0W',
    title: 'Customer Support',
    shortDescription: 'Delivers exceptional 24/7 customer service',
    description:
      'Provides instant, personalized customer support across multiple channels, resolving issues faster while maintaining consistent quality at scale.',
    features: [
      {
        title: 'Handles multiple customer inquiries simultaneously',
        description:
          'Manages numerous customer conversations at once without quality degradation',
        icon: 'MessageSquare',
      },
      {
        title: 'Accesses knowledge base to provide accurate answers',
        description:
          'Retrieves relevant information from your documentation and knowledge base',
        icon: 'HelpCircle',
      },
      {
        title: 'Recognizes and escalates complex issues to human agents',
        description:
          'Identifies when human intervention is needed and routes appropriately',
        icon: 'Package',
      },
      {
        title: 'Personalizes interactions based on customer history',
        description:
          'Tailors responses using previous interactions and customer preferences',
        icon: 'UserPlus',
      },
    ],
    useCases: [
      'Provide 24/7 frontline customer support across channels',
      'Handle routine inquiries and frequently asked questions',
      'Process returns, exchanges, and basic service requests',
      'Collect and analyze customer feedback and sentiment',
    ],
    exampleActions: [
      'Help a customer track their recent order status',
      'Process a return request for a damaged product',
      'Answer product compatibility questions',
      'Gather customer feedback after service interaction',
    ],
    predefinedActions: [
      {
        title: 'Order Status',
        description: 'Check and communicate order status information',
        icon: 'Package',
      },
      {
        title: 'Returns Processing',
        description: 'Handle product returns and exchanges',
        icon: 'SplitSquare',
      },
      {
        title: 'FAQ Assistance',
        description: 'Answer common questions about products and services',
        icon: 'HelpCircle',
      },
    ],
    timelineEvents: [
      {
        title: 'Initial Contact',
        description: 'Receive and acknowledge customer inquiry',
        time: 'Minute 0',
      },
      {
        title: 'Issue Identification',
        description: 'Identify the nature and severity of the problem',
        time: 'Minute 1',
      },
      {
        title: 'Resolution',
        description: 'Provide solution or process customer request',
        time: 'Minute 2-5',
      },
      {
        title: 'Follow-up',
        description: 'Confirm satisfaction and collect feedback',
        time: 'Minute 5-7',
      },
    ],
    imageSrc: `${import.meta.env.VITE_ASSETS_URL}/automatas/agent_4.webp`,
    theme: {
      background: 'bg-brand-sky',
      foreground: 'text-brand-sky-foreground',
      accentForeground: 'text-brand-sky',
    },
  },
  {
    id: 'blog-writer',
    title: 'Blog Writer',
    name: '3CHO',
    shortDescription: 'Creates engaging and SEO-optimized content',
    description:
      'Crafts compelling, SEO-friendly content tailored to your brand voice, generating high-quality articles in minutes instead of days.',
    features: [
      {
        title: 'Researches trending topics in your industry',
        description:
          'Finds viral and trending content specific to your niche or industry',
        icon: 'Search',
      },
      {
        title: 'Creates SEO-optimized content with targeted keywords',
        description: 'Produces content designed to rank highly in search engines',
        icon: 'Target',
      },
      {
        title: 'Adapts writing style to match your brand voice',
        description: 'Customizes content tone and style to maintain brand consistency',
        icon: 'FileEdit',
      },
      {
        title: 'Generates engaging headlines and meta descriptions',
        description: 'Creates attention-grabbing titles and SEO-friendly metadata',
        icon: 'Type',
      },
    ],
    useCases: [
      'Maintain consistent content calendar for your blog',
      'Create in-depth industry reports and whitepapers',
      'Develop content marketing campaigns across channels',
      'Repurpose existing content for different platforms',
    ],
    exampleActions: [
      'Write a technical article about building AI agents using React and TypeScript',
      'Create a listicle of the top 10 productivity tools for remote teams',
      'Draft a case study about how Company X increased conversions by 200%',
      'Write a product comparison review for the latest smartphones',
    ],
    predefinedActions: [
      {
        title: 'Content Calendar',
        description: 'Generate a monthly content calendar with topic ideas',
        icon: 'Calendar',
      },
      {
        title: 'Blog Post',
        description: 'Write a complete blog post with SEO optimization',
        icon: 'FileText',
      },
      {
        title: 'Content Repurposing',
        description: 'Transform existing content for different platforms',
        icon: 'Repeat',
      },
    ],
    timelineEvents: [
      {
        title: 'Topic Research',
        description: 'Research trending topics and keywords',
        time: 'Day 1',
      },
      {
        title: 'Content Outline',
        description: 'Create detailed outline with key points',
        time: 'Day 2',
      },
      {
        title: 'Draft Writing',
        description: 'Write the complete first draft',
        time: 'Day 3',
      },
      {
        title: 'Editing & Publishing',
        description: 'Edit, optimize for SEO, and publish',
        time: 'Day 4',
      },
    ],
    imageSrc: `${import.meta.env.VITE_ASSETS_URL}/automatas/agent_1.webp`,
    theme: {
      background: 'bg-brand-pink',
      foreground: 'text-brand-pink-foreground',
      accentForeground: 'text-brand-pink',
    },
  },
  {
    id: 'startup-mentor',
    name: 'V3KT0R',
    title: 'Startup Mentor',
    shortDescription: 'Provides strategic guidance for your business',
    description:
      'Delivers personalized business advice and market insights, helping entrepreneurs navigate challenges with data-backed recommendations.',
    features: [
      {
        title: 'Analyzes business models for viability and scalability',
        description: 'Evaluates business concepts using market data and growth metrics',
        icon: 'BarChart2',
      },
      {
        title: 'Identifies market opportunities and competitive gaps',
        description: 'Discovers untapped markets and weaknesses in competitor offerings',
        icon: 'Target',
      },
      {
        title: 'Creates strategic growth roadmaps with milestones',
        description: 'Develops actionable plans with clear objectives and timelines',
        icon: 'TrendingUp',
      },
      {
        title: 'Prepares investor pitch materials and financial projections',
        description: 'Creates compelling presentations and realistic financial forecasts',
        icon: 'PieChart',
      },
    ],
    useCases: [
      'Validate new business ideas before significant investment',
      'Develop go-to-market strategies for product launches',
      'Create fundraising materials for investor presentations',
      'Optimize business operations for efficiency and growth',
    ],
    exampleActions: [
      'Analyze my business model and provide recommendations for improvement',
      'Create a competitive analysis for the SaaS project management space',
      'Develop a 12-month growth strategy for my e-commerce business',
      'Help me prepare a pitch deck for seed funding',
    ],
    predefinedActions: [
      {
        title: 'Business Model Review',
        description: 'Evaluate your business model and suggest improvements',
        icon: 'Target',
      },
      {
        title: 'Growth Strategy',
        description: 'Create a 12-month growth plan with clear milestones',
        icon: 'TrendingUp',
      },
      {
        title: 'Pitch Deck Creation',
        description: 'Develop a compelling pitch deck for investors',
        icon: 'LineChart',
      },
    ],
    timelineEvents: [
      {
        title: 'Initial Assessment',
        description: 'Evaluate current business position and goals',
        time: 'Week 1',
      },
      {
        title: 'Strategy Development',
        description: 'Create actionable strategies and plans',
        time: 'Week 2',
      },
      {
        title: 'Implementation Guidance',
        description: 'Provide guidance on executing strategies',
        time: 'Week 3-4',
      },
      {
        title: 'Progress Review',
        description: 'Assess results and refine approach',
        time: 'Week 5-6',
      },
    ],
    imageSrc: `${import.meta.env.VITE_ASSETS_URL}/automatas/agent_3.webp`,
    theme: {
      background: 'bg-brand-purple',
      foreground: 'text-brand-purple-foreground',
      accentForeground: 'text-brand-purple',
    },
  },
]

export function AgenticEmployees() {
  return (
    <div className="bg-brand-blue dark:bg-muted/30 w-full py-16 md:py-24">
      <div className="container-marketing">
        <div className="mb-12 text-center">
          <h2 className="text-brand-blue-foreground line-stroke mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            <span className="text-primary">Gingga Agents</span>
          </h2>
          <p className="text-brand-blue-foreground dark:text-muted-foreground mx-auto max-w-[700px] text-xl">
            Our specialized AI agents are designed to automate specific tasks and
            workflows for your business.
          </p>
        </div>

        {/* Agent Information Sections */}
        <div className="mt-16 space-y-8">
          {agents.map((agent, index) => (
            <section id={`agent-${agent.id}`} key={`info-${agent.id}`}>
              <AgentInformation agent={agent} index={index} />
            </section>
          ))}
        </div>
      </div>
      {/* Create Your Custom Agent Section */}
      <div className="mt-16 w-full md:mt-24" id="create-agent">
        <div className="mb-8 text-center">
          <Badge className="bg-brand-green text-brand-green-foreground mb-4 inline-block px-3 py-1">
            Create Your Own
          </Badge>
          <h2 className="text-brand-blue-foreground line-stroke mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Your Custom Agent
          </h2>
          <p className="text-brand-blue-foreground dark:text-muted-foreground mx-auto max-w-[700px] text-xl">
            Don&apos;t see the perfect agent? Let&apos;s build one exactly to your
            requirements.
          </p>
        </div>

        <div className="relative m-0 mx-auto w-full overflow-hidden border-2 border-transparent bg-transparent py-8 sm:py-10 md:py-12">
          <div className="relative z-10">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-center">
              {/* Image Column */}
              <div className="flex w-full max-w-xl justify-center">
                <div className="overflow-hidden rounded-xl">
                  <div className="relative">
                    <img
                      src={`${import.meta.env.VITE_ASSETS_URL}/automatas/agent_10.webp`}
                      alt="Custom AI Agent"
                      className="h-full w-full object-contain"
                      // className="h-full w-full max-w-[240px] sm:max-w-[280px] md:max-w-[320px]"
                    />
                  </div>
                </div>
              </div>

              {/* Content Column */}
              <div className="w-full text-center md:max-w-md md:text-left">
                <h2 className="line-stroke text-primary mb-3 text-2xl font-bold tracking-tight md:text-3xl">
                  <span className="flex items-center justify-center gap-2 md:justify-start">
                    Created to fit in your business
                  </span>
                </h2>

                <p className="text-brand-blue-foreground dark:text-muted-foreground mb-4 text-base leading-relaxed md:text-lg">
                  We design, build, and deploy custom AI agents for your specific business
                  needs, integrating seamlessly with your existing workflows and systems.
                </p>

                <ul className="text-background/80 dark:text-foreground mb-6 list-disc space-y-3 pl-5 text-left text-base font-medium">
                  <li>
                    <span className="text-brand-green">Personalized AI agents</span>
                    {' '}
                    built
                    for your specific workflows
                  </li>
                  <li>
                    <span className="text-brand-green">Rapid deployment</span>
                    {' '}
                    from
                    discovery to launch in just 3-5 days
                  </li>
                  <li>
                    <span className="text-brand-green">Cost-effective solution</span>
                    {' '}
                    at a
                    fraction of traditional automation costs
                  </li>
                </ul>

                <div className="flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
                  <Button
                    size="xl"
                    variant="primary"
                    className="flex w-full items-center justify-center gap-2 sm:w-auto"
                    asChild
                  >
                    <Link to="/contact">
                      <SparklesIcon className="h-5 w-5" />
                      Schedule a Consultation
                      <ArrowRightIcon size={16} />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
