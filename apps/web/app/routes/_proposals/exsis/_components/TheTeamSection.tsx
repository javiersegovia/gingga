/* eslint-disable react/no-unstable-default-props */
import { Avatar, AvatarFallback, AvatarImage } from '@gingga/ui/components/avatar'
import { Button } from '@gingga/ui/components/button'
import { Card, CardContent } from '@gingga/ui/components/card'
import { cn } from '@gingga/ui/lib/utils'
import { ExternalLinkIcon, Linkedin, StarIcon } from 'lucide-react'

const teamMembers = [
  {
    name: 'Vladimir Guzman',
    role: 'CEO – Business & Product Strategist',
    bio: 'With 13+ years leading digital ventures, aligns technology and market needs, specializing in product strategy and startup execution.',
    tags: ['Y Combinator Alumni', 'Product Strategy', 'Leadership'],
    signatureSkill: 'Product Strategy',
    avatar:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vlado-mu2DvuG0Lhbd5vEpwUbIjIxpnqdBlW.jpeg',
    linkedin: 'https://www.linkedin.com/in/vlaguzman/',
  },
  {
    name: 'Javier Segovia',
    role: 'CTO – Tech Architect & Development Lead',
    bio: 'Software engineer and team leader. Leads high-performance teams and oversees all technology implementation.',
    tags: ['Product Design', 'Software Architecture', 'Full Stack Development'],
    signatureSkill: 'Product Design',
    avatar: 'https://assets.gingga.com/IMG_4835(1).JPG',
    linkedin: 'https://www.linkedin.com/in/segoviajavier/',
  },
  {
    name: 'Julian Vargas',
    role: 'Backend / Infrastructure Expert',
    bio: 'Results-driven Engineering Leader with 20+ years of experience delivering scalable software solutions and driving organizational success through strategic technical leadership.',
    tags: ['Backend Development', 'Infrastructure', 'Ruby', 'Node.js', 'AWS'],
    signatureSkill: 'Infrastructure',
    avatar:
      'https://media.licdn.com/dms/image/v2/C4E03AQGB7difC1xegA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1554432072016?e=1749686400&v=beta&t=SGCot9vx5iBhxhiEQCM0m-ZgCjPDqLVQ1TtPoefaU98',
    linkedin: 'https://www.linkedin.com/in/julian-david-vargas-alvarez-333b0664/',
  },
]

const credentials = [
  {
    name: 'HoyTrabajas.com (YC W22)',
    description:
      'The first Colombian job platform 100% focused on operational roles. 50,000+ MAU.',
    link: 'https://www.hoytrabajas.com',
    logo: 'https://www.hoytrabajas.com/favicon.ico',
  },
  {
    name: 'Fluvip ($16M+ ARR)',
    description: 'Pioneers and leaders in Influencer Marketing in LATAM',
    link: 'https://www.fluvip.com',
    logo: 'https://assets.gingga.com/proposals/logo_fluvip.jpg',
  },
]

interface TeamMemberCardProps {
  name: string
  role: string
  bio: string
  avatar?: string
  tags: string[]
  signatureSkill: string
  links?: {
    linkedin?: string
  }
}

function TeamMemberCard({
  name,
  role,
  bio,
  avatar,
  tags,
  signatureSkill,
  links = {},
}: TeamMemberCardProps) {
  return (
    <Card
      className="group border-border relative flex flex-1 cursor-default flex-col overflow-hidden transition-all duration-300 hover:shadow-md"
      design="grid"
      hover="reverse"
    >
      <div className="from-primary/0 to-primary/10 pointer-events-none absolute top-0 right-0 h-full w-full bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      <CardContent className="h-full flex-1 p-6">
        <div className="flex h-full flex-1 flex-col items-center">
          <div className="bg-muted ring-primary/50 relative mb-4 h-24 w-24 overflow-hidden rounded-full ring-2">
            <Avatar className="h-full w-full object-cover">
              {avatar
                ? (
                    <AvatarImage
                      src={avatar}
                      alt={name}
                      className="h-full w-full object-cover"
                    />
                  )
                : (
                    <AvatarFallback className="bg-muted text-muted-foreground text-lg font-semibold">
                      {name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </AvatarFallback>
                  )}
            </Avatar>
          </div>
          <h3 className="mb-1 text-xl font-bold">{name}</h3>
          <p className="text-primary mb-4 text-center">{role}</p>

          <div className="bg-accent/50 group-hover:bg-accent mb-6 w-full transform rounded-lg p-4 text-center transition-all duration-300">
            <p className="text-foreground/80 text-sm">{bio}</p>
          </div>

          <div className="mb-6 w-full space-y-2">
            {tags.map(tag => (
              <div
                key={tag}
                className={cn(
                  'flex items-center justify-between rounded-lg px-3 py-1.5 text-sm',
                  tag === signatureSkill
                    ? 'bg-primary/20 border-primary border'
                    : 'bg-accent/50',
                )}
              >
                <span
                  className={cn(
                    tag === signatureSkill
                      ? 'text-primary font-medium'
                      : 'text-foreground/80',
                  )}
                >
                  {tag}
                </span>
                {tag === signatureSkill && (
                  <StarIcon className="text-primary fill-primary h-4 w-4" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-auto w-full pt-4">
            {links.linkedin && (
              <Button variant="outline" className="w-full" size="sm" asChild>
                <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="text-muted-foreground mr-2 h-4 w-4" />
                  LinkedIn Profile
                  <ExternalLinkIcon className="text-muted-foreground ml-auto h-3 w-3" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface CredentialCardProps {
  title: string
  description?: string
  link: string
  logo?: string
}

function CredentialCard({ title, description, link, logo }: CredentialCardProps) {
  return (
    <div className="border-primary/10 from-muted/50 to-muted/10 flex h-full flex-col rounded-xl border bg-gradient-to-b p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-grow space-y-1">
          <h3 className="text-foreground font-semibold">{title}</h3>
        </div>
        {logo && (
          <div className="bg-background ml-4 h-10 w-10 flex-shrink-0 overflow-hidden rounded-md p-1">
            <img src={logo} alt={title} className="h-full w-full object-contain" />
          </div>
        )}
      </div>
      {description && (
        <p className="text-muted-foreground mt-4 flex-grow text-sm">{description}</p>
      )}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary group mt-4 inline-flex items-center text-sm font-medium hover:underline"
      >
        Visit website
        {' '}
        <ExternalLinkIcon className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  )
}

export function TheTeamSection() {
  return (
    <section className="bg-background relative flex min-h-screen flex-col items-center justify-center gap-12 overflow-hidden p-8">
      <h2 className="text-center text-5xl font-bold tracking-tight lg:text-7xl">
        The Team
      </h2>

      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        {teamMembers.map(member => (
          <TeamMemberCard
            key={member.name}
            name={member.name}
            role={member.role}
            bio={member.bio}
            tags={member.tags}
            signatureSkill={member.signatureSkill}
            avatar={member.avatar}
            links={{ linkedin: member.linkedin }}
          />
        ))}
      </div>

      <div className="z-10 mt-10 w-full max-w-4xl">
        <h3 className="mb-6 text-center text-3xl font-semibold">Team Credentials</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {credentials.map(cred => (
            <CredentialCard
              key={cred.name}
              title={cred.name}
              description={cred.description}
              link={cred.link}
              logo={cred.logo}
            />
          ))}
        </div>
        <p className="text-muted-foreground mt-8 text-center text-lg">
          We&apos;ve helped build businesses that raised $5M+ and generated $16M+ ARR.
        </p>
        <p className="text-foreground mt-4 text-center text-xl font-semibold lg:text-2xl">
          A proven team that knows how to ship, scale, and deliver real business
          impact—not just prototypes.
        </p>
      </div>
    </section>
  )
}
