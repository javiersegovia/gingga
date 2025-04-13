import { AIAgentCard } from './AIAgentCard'

export function AIAgentsSection() {
  return (
    <>
      <section className="w-full bg-transparent py-16 md:py-24">
        <div className="container-marketing mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            AI Agents — Precision Execution
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <AIAgentCard
              name="Primata Flow"
              role="Startup Project Manager"
              skills={[
                'Process Automation',
                'Agile Management',
                'Problem Solving',
                'Resource Optimization',
              ]}
              signatureSkill="Agile Management"
              superpower="Navigates complex projects with agility and foresight, adapting quickly to changing startup environments."
              avatar="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PrimataFlow-DycihBwiecLsVqScok9pgmPITgx9Ch.webp"
              tryButton={{
                text: 'Try Primata Flow',
                email: 'guzman.vla@gmail.com',
              }}
            />
            <AIAgentCard
              name="Mestre Noctua"
              role="Wise Startup Mentor"
              skills={[
                'Strategic Guidance',
                'Investor Relations',
                'Pitch Refinement',
                'Business Modeling',
              ]}
              signatureSkill="Strategic Guidance"
              superpower="Provides wisdom and strategic insight that transforms startup visions into investor-ready narratives."
              avatar="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MestreNoctua-GyeOv1RNrWs7e2bSf01iXdbHUsQ5Sd.webp"
              tryButton={{
                text: 'Try Mestre Noctua',
                email: 'guzman.vla@gmail.com',
              }}
            />
            <AIAgentCard
              name="Onça Nova"
              role="AI Software Developer"
              skills={[
                'Technical Architecture',
                'MVP Development',
                'Code Generation',
                'System Integration',
              ]}
              signatureSkill="MVP Development"
              superpower="Builds and deploys technical solutions with lightning speed and precision, turning concepts into functional products."
              avatar="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/On%C3%A7aNova-zuCoqkFI69eItNGHA127j5cDHzY58r.webp"
              tryButton={{
                text: 'Try Onça Nova',
                email: 'guzman.vla@gmail.com',
              }}
            />
          </div>
        </div>
      </section>
    </>
  )
}
