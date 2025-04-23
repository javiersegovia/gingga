import { Bot, FileQuestion, Presentation } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardDescription, CardTitle } from '~/components/ui/card'

const processSteps = [
  {
    title: 'Discovery',
    description:
      'Initial meeting to understand your business and identify opportunities where AI can add value. Concludes with a tailored proposal.',
    icon: <FileQuestion className="text-brand-blue h-16 w-16" />,
    iconColor: 'brand-blue',
  },
  {
    title: 'Creation',
    description:
      'We create and configure agents based on your needs. Agents that complete tasks, answer questions, and more.',
    icon: <Bot className="text-brand-green h-16 w-16" />,
    iconColor: 'brand-green',
  },
  {
    title: 'Handoff',
    description:
      'Your agent becomes an integrated part of your business operations. Profit!',
    icon: <Presentation className="text-brand-pink h-16 w-16" />,
    iconColor: 'brand-pink',
  },
]

export function AgentsIntroduction() {
  return (
    <div className="bg-background relative w-full">
      <div className="diagonal-pattern absolute inset-0"></div>
      <div className="container-marketing relative z-10 p-6 py-40">
        <div className="mb-12 text-center">
          <Badge className="bg-brand-blue text-brand-blue-foreground mb-4">
            Our Process
          </Badge>
          <h2 className="text-foreground dark:text-foreground mx-auto mb-4 max-w-3xl font-bold tracking-tight">
            3 Simple Steps to
            {' '}
            <br />
            <span className="dark:text-brand-pink text-brand-pink line-stroke">
              Your First Assistant
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-[800px] text-xl">
            We partner with your business to create, deploy, and evolve custom assistants
            that transform your workflows and boost productivity
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-3 md:px-4">
          {processSteps.map(step => (
            <Card
              key={step.title}
              hover="reverse"
              design="grid"
              className="relative overflow-hidden p-0"
              shadowColor={`var(--${step.iconColor})`}
            >
              <CardContent className="relative z-20">
                {step.icon}
                <CardTitle className="mt-4 text-base font-bold">{step.title}</CardTitle>
                <CardDescription className="text-muted-foreground text-base font-normal">
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
