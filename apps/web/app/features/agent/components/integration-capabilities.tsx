import { AnimatedBeam } from '@gingga/ui/components/animated-beam'
import { Badge } from '@gingga/ui/components/badge'
import { Card, CardContent, CardDescription, CardTitle } from '@gingga/ui/components/card'
import { cn } from '@gingga/ui/lib/utils'
import { BotIcon } from 'lucide-react'
import { useRef } from 'react'

// Icons for integrations
const Icons = {
  user: () => (
    <img
      src={`${import.meta.env.VITE_ASSETS_URL || ''}/whirrls/person_icon.svg`}
      alt="User Icon"
      className="h-10 w-10"
    />
  ),
  whatsapp: () => (
    <img
      src={`${import.meta.env.VITE_ASSETS_URL || ''}/company_logos/whatsapp.svg`}
      alt="WhatsApp"
      className="-mt-2 h-10 w-10"
    />
  ),
  slack: () => (
    <img
      src={`${import.meta.env.VITE_ASSETS_URL || ''}/company_logos/facebook.svg`}
      alt="Facebook"
      className="h-10 w-10"
    />
  ),
  email: () => (
    <img
      src={`${import.meta.env.VITE_ASSETS_URL || ''}/company_logos/google_gmail.svg`}
      alt="Gmail"
      className="h-10 w-10"
    />
  ),
  googleSheets: () => (
    <img
      src={`${import.meta.env.VITE_ASSETS_URL || ''}/company_logos/google_docs.svg`}
      alt="Google Docs"
      className="h-10 w-10"
    />
  ),
  notion: () => (
    <img
      src={`${import.meta.env.VITE_ASSETS_URL || ''}/company_logos/notion.svg`}
      alt="Notion"
      className="h-10 w-10"
    />
  ),
  stripe: () => (
    <img
      src={`${import.meta.env.VITE_ASSETS_URL || ''}/company_logos/google_drive.svg`}
      alt="Google Drive"
      className="h-10 w-10"
    />
  ),
  analytics: () => (
    <img
      src={`${import.meta.env.VITE_ASSETS_URL || ''}/company_logos/google_calendar.svg`}
      alt="Google Calendar"
      className="h-10 w-10"
    />
  ),
  telegram: () => (
    <img
      src={`${import.meta.env.VITE_ASSETS_URL || ''}/company_logos/telegram.svg`}
      alt="Telegram"
      className="h-10 w-10"
    />
  ),
  chatbot: () => (
    <img
      src={`${import.meta.env.VITE_ASSETS_URL || ''}/company_logos/chatbot.svg`}
      alt="Custom Chatbot"
      className="h-10 w-10"
    />
  ),
}

export function IntegrationCapabilities() {
  // Reference for the container that will hold the beams
  const containerRef = useRef<HTMLDivElement>(null)

  // Reference for the source (AI agent) and user
  const agentRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  // Refs for tool integrations
  const whatsappRef = useRef<HTMLDivElement>(null)
  const slackRef = useRef<HTMLDivElement>(null)
  const emailRef = useRef<HTMLDivElement>(null)
  const sheetsRef = useRef<HTMLDivElement>(null)
  const notionRef = useRef<HTMLDivElement>(null)
  const stripeRef = useRef<HTMLDivElement>(null)
  const analyticsRef = useRef<HTMLDivElement>(null)

  // Array for tool labels and positions
  const tools = [
    {
      name: 'WhatsApp',
      ref: whatsappRef,
      icon: Icons.whatsapp,
      position: { top: '18%', right: '15%' },
    },
    {
      name: 'Facebook',
      ref: slackRef,
      icon: Icons.slack,
      position: { top: '30%', right: '12%' },
    },
    {
      name: 'Gmail',
      ref: emailRef,
      icon: Icons.email,
      position: { top: '42%', right: '8%' },
    },
    {
      name: 'Google Docs',
      ref: sheetsRef,
      icon: Icons.googleSheets,
      position: { top: '54%', right: '10%' },
    },
    {
      name: 'Notion',
      ref: notionRef,
      icon: Icons.notion,
      position: { top: '66%', right: '15%' },
    },
    {
      name: 'Google Drive',
      ref: stripeRef,
      icon: Icons.stripe,
      position: { top: '78%', right: '22%' },
    },
    {
      name: 'Google Calendar',
      ref: analyticsRef,
      icon: Icons.analytics,
      position: { top: '85%', right: '32%' },
    },
  ]

  // Common integrations for the lower section
  const commonIntegrations = [
    {
      name: 'WhatsApp',
      description:
        'Extend your reach with automated WhatsApp responses, appointment scheduling, and customer support that feels human.',
      icon: Icons.whatsapp,
    },
    {
      name: 'Web Chat',
      description:
        'Embed an AI-powered chatbot directly into your website that understands your products, services, and FAQs.',
      icon: () => <BotIcon className="h-10 w-10" />,
    },
    {
      name: 'Telegram',
      description:
        'Engage customers on Telegram with instant responses, order updates, and personalized recommendations.',
      icon: Icons.telegram,
    },
  ]

  return (
    <div className="bg-muted/5 w-full py-20">
      <div className="container-marketing">
        {/* Two-column layout for desktop, stacked for mobile */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
          {/* Left column: Title and description */}
          <div className="mb-10 text-center lg:mb-0 lg:w-1/2 lg:text-left">
            <Badge className="bg-brand-blue mb-4 text-white">Integrations</Badge>
            <h2 className="text-brand-sky line-stroke mb-4 font-bold">
              Connect with Your Favorite Tools
            </h2>
            <p className="text-muted-foreground text-xl">
              Our AI agents seamlessly integrate with the tools you already use, creating
              a unified workflow across your entire tech stack
            </p>
          </div>

          {/* Right column: Animated Beam Integration Visualization */}
          <div className="lg:w-1/2">
            <div
              ref={containerRef}
              className="relative mx-auto h-[500px] w-full overflow-hidden rounded-xl"
            >
              {/* Beams Layer (Lower z-index) */}
              <div className="absolute inset-0 z-0">
                {/* Beams from Tools to Agent */}
                {tools.map((tool, index) => (
                  <AnimatedBeam
                    key={`tool-${tool.name}`}
                    containerRef={containerRef}
                    fromRef={tool.ref}
                    toRef={agentRef}
                    duration={5 + index * 0.3}
                    pathWidth={3}
                    curvature={40 + index * 5}
                    gradientStartColor={
                      index < 2
                        ? '#4ade80'
                        : index < 4
                          ? '#3b82f6'
                          : index < 6
                            ? '#f97316'
                            : '#a855f7'
                    }
                    gradientStopColor={
                      index < 2
                        ? '#22c55e'
                        : index < 4
                          ? '#2563eb'
                          : index < 6
                            ? '#ea580c'
                            : '#7e22ce'
                    }
                  />
                ))}

                {/* Beam from Agent to User */}
                <AnimatedBeam
                  containerRef={containerRef}
                  fromRef={agentRef}
                  toRef={userRef}
                  duration={5}
                  pathWidth={3}
                  curvature={200}
                  gradientStartColor="#ffaa40"
                  gradientStopColor="#9c40ff"
                />
              </div>

              {/* User Circle - Left Side */}
              <div className="absolute top-1/2 left-[15%] z-10 -translate-y-1/2">
                <div
                  ref={userRef}
                  className="bg-blank dark:bg-foreground border-border z-20 flex items-center justify-center rounded-sm border-2 p-2"
                >
                  {Icons.user()}
                </div>
              </div>

              {/* Agent Circle - Center */}
              <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                <div
                  ref={agentRef}
                  className="bg-secondary z-20 flex size-25 items-center justify-center rounded-sm border-2 p-0 shadow-[0_0_25px_-12px_rgba(0,0,0,0.8)]"
                >
                  <img
                    src={`${import.meta.env.VITE_ASSETS_URL}/automatas/agent_1.webp`}
                    alt="AI Agent"
                    className="size-full rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Integration Tools - Scattered around right side */}
              {tools.map(tool => (
                <div
                  key={`tool-${tool.name}`}
                  className="absolute z-10"
                  style={{
                    top: tool.position.top,
                    right: tool.position.right,
                  }}
                >
                  <div
                    ref={tool.ref}
                    className="bg-blank dark:bg-foreground border-border z-20 flex h-12 w-12 items-center justify-center rounded-sm border-2 p-1"
                  >
                    {tool.icon()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Common Integrations Section */}
        <div className="mt-20">
          <div className="mb-12 text-center">
            {/* <Badge className="bg-brand-green mb-4 text-white">Common Integrations</Badge> */}
            <h3 className="text-brand-sky line-stroke mb-4 text-2xl font-bold">
              Popular Ways to Connect
            </h3>
            <p className="text-muted-foreground mx-auto max-w-[800px] text-lg">
              These are some of the most popular ways our clients connect with their
              customers through our AI agents
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {commonIntegrations.map(integration => (
              <Card key={integration.name} hover="default" design="grid" className="overflow-hidden">
                <CardContent className="flex flex-col items-center p-0">
                  <div
                    className={cn(
                      'mb-3 flex h-20 w-20 items-center justify-center rounded-full',
                      // integration.name !== 'Web Chat' && 'border-border border',
                    )}
                  >
                    {integration.icon()}
                  </div>
                  <CardTitle className="mb-2 text-xl">{integration.name}</CardTitle>
                  <CardDescription className={cn('text-center text-sm')}>
                    {integration.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
