import { Card, CardContent } from '@gingga/ui/components/card'
import { LinkedinIcon } from 'lucide-react'

export function FoundersSection() {
  return (
    <>
      <section className="w-full bg-transparent py-16 md:py-24">
        <div className="container-marketing relative z-10 mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            Founders and Humans Committed — Vision & Execution
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <FounderCardRedesigned
              name="Vladimir Guzman"
              role="Business & Product Strategist"
              skills={[
                'Business Strategy',
                'Product Vision',
                'Market Analysis',
                'Team Leadership',
              ]}
              superpower="Turns complex market problems into elegant product solutions that customers love."
              avatar="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vlado-mu2DvuG0Lhbd5vEpwUbIjIxpnqdBlW.jpeg"
              linkedin="https://www.linkedin.com/in/vlaguzman/"
              bio="With 10+ years leading digital ventures, Vladimir aligns technology and market needs, specializing in product strategy and startup execution."
            />
            <FounderCardRedesigned
              name="Javier Segovia"
              role="Tech Architect & Development Lead"
              skills={[
                'Full-Stack Development',
                'Technical Leadership',
                'Product Development',
                'UX Design',
              ]}
              superpower="Bridges the gap between cutting-edge technology and intuitive user experiences while implementing technical solutions."
              avatar="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/javier-XKNIQj9ryMq61SzVFDRlRl6OG7KNKo.jpeg"
              linkedin="https://www.linkedin.com/in/segoviajavier/"
              bio="Software engineer and team leader, with experience leading and mentoring high-performance teams. Responsible for all technology implementation and development support."
            />
          </div>
        </div>
      </section>
    </>
  )
}

interface FounderCardRedesignedProps {
  name: string
  role: string
  skills: string[]
  superpower: string
  avatar: string
  linkedin: string
  bio: string
}

function FounderCardRedesigned({
  name,
  role,
  skills,
  superpower,
  avatar,
  linkedin,
  bio,
}: FounderCardRedesignedProps) {
  return (
    <Card
      design="grid"
      hover="reverse"
      className="group cursor-default overflow-hidden transition-all duration-300 hover:cursor-pointer"
    >
      <CardContent className="p-0 md:p-8">
        <div className="flex flex-col">
          {/* Avatar at the top */}
          <div className="mb-6 flex flex-col items-center">
            <div className="bg-muted relative h-32 w-32 overflow-hidden rounded-full">
              {avatar && (
                <img src={avatar} alt={name} className="h-full w-full object-cover" />
              )}
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-center">
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
            <p className="text-primary mb-4 text-center">{role}</p>
            <p className="text-foreground/80 mb-6">{bio}</p>

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
