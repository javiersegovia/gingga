import { Card, CardContent } from '@gingga/ui/components/card'
import { LinkedinIcon } from 'lucide-react'

interface FounderCardProps {
  name: string
  role: string
  skills: string[]
  superpower: string
  avatar: string
  linkedin: string
  bio: string
}

export function FounderCard({
  name,
  role,
  skills,
  superpower,
  avatar,
  linkedin,
  bio,
}: FounderCardProps) {
  return (
    <Card className="group cursor-default overflow-hidden border-none transition-all duration-300 hover:cursor-pointer hover:shadow-md">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <div className="bg-muted relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full">
            {avatar && (
              <img src={avatar} alt={name} className="h-full w-full object-cover" />
            )}
          </div>
          <div>
            <div className="mb-1 flex items-center">
              <h3 className="text-2xl font-bold">{name}</h3>
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue hover:text-brand-blue/80 ml-2"
                >
                  <LinkedinIcon className="h-5 w-5" />
                </a>
              )}
            </div>
            <p className="text-primary mb-2">{role}</p>
            <p className="text-foreground/80 mb-4">{bio}</p>

            <div className="mb-6 flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill} className="bg-accent rounded-full px-3 py-1 text-sm">
                  {skill}
                </span>
              ))}
            </div>

            <div className="bg-accent/50 group-hover:bg-accent transform rounded-lg p-4 transition-all duration-300">
              <h4 className="mb-2 flex items-center font-semibold">
                <span className="mr-2">Superpower</span>
                <span className="from-primary to-primary-accent h-1 w-8 rounded-full bg-gradient-to-r"></span>
              </h4>
              <p className="text-foreground/80">{superpower}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
