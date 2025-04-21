/* eslint-disable no-alert */
import { Button } from '@gingga/ui/components/button'
import { Card, CardContent } from '@gingga/ui/components/card'
import { cn } from '@gingga/ui/lib/utils'
import { ExternalLinkIcon, StarIcon } from 'lucide-react'

interface AIAgentCardProps {
  name: string
  role: string
  skills: string[]
  signatureSkill: string
  superpower: string
  avatar: string
  tryButton?: {
    text: string
    email: string
  }
}

export function AIAgentCard({
  name,
  role,
  skills,
  signatureSkill,
  superpower,
  avatar,
  tryButton,
}: AIAgentCardProps) {
  return (
    <Card
      design="grid"
      hover="reverse"
      className="group border-border relative flex flex-1 cursor-default flex-col overflow-hidden transition-all duration-300 hover:cursor-pointer hover:shadow-md"
    >
      <div className="from-primary/0 to-primary/10 pointer-events-none absolute top-0 right-0 h-full w-full bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      <CardContent className="h-full flex-1 p-6 md:p-8">
        <div className="flex h-full flex-1 flex-col items-center">
          <div className="bg-muted ring-primary/50 relative mb-4 h-24 w-24 overflow-hidden rounded-full ring-2">
            {avatar && (
              <img src={avatar} alt={name} className="h-full w-full object-cover" />
            )}
          </div>
          <h3 className="mb-1 text-xl font-bold">{name}</h3>
          <p className="text-primary mb-6">{role}</p>

          <div className="mb-6 w-full space-y-3">
            {skills.map(skill => (
              <div
                key={skill}
                className={cn(
                  'flex items-center justify-between rounded-lg px-4 py-2',
                  skill === signatureSkill
                    ? 'bg-primary/20 border-primary border'
                    : 'bg-accent/50',
                )}
              >
                <span
                  className={
                    skill === signatureSkill
                      ? 'text-primary font-medium'
                      : 'text-foreground/80'
                  }
                >
                  {skill}
                </span>
                {skill === signatureSkill && (
                  <StarIcon className="text-primary fill-primary h-5 w-5" />
                )}
              </div>
            ))}
          </div>

          <div className="bg-accent/50 group-hover:bg-accent w-full transform rounded-lg p-4 transition-all duration-300">
            <h4 className="mb-2 flex items-center font-semibold">
              <span className="mr-2">Superpower</span>
              <span className="from-primary to-primary-accent h-1 w-8 rounded-full bg-gradient-to-r"></span>
            </h4>
            <p className="text-foreground/80">{superpower}</p>
          </div>

          <div className="mt-auto w-full pt-6">
            {tryButton && (
              <Button
                variant="primary"
                className="w-full"
                size="lg"
                onClick={() => {
                  alert(
                    `Contact us at ${
                      tryButton.email
                    } or via WhatsApp for more details.`,
                  )
                }}
              >
                {tryButton.text}
                <ExternalLinkIcon className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
