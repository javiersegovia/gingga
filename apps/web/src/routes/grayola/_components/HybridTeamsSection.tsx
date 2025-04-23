import { Card } from '~/components/ui/card'

export function HybridTeamsSection() {
  return (
    <>
      <section className="bg-background border-border relative w-full border-t py-16 md:py-24">
        <div className="diagonal-pattern absolute inset-0"></div>

        <div className="container-marketing relative z-10 mx-auto px-4">
          <h2 className="text-brand-sky mb-12 text-center text-3xl font-bold md:text-4xl">
            Why Hybrid Teams Win
          </h2>
          <Card
            design="grid"
            className="mx-auto max-w-3xl rounded-2xl p-8 shadow-sm md:p-12"
          >
            <ul className="space-y-6">
              {[
                'Build MVPs fast',
                'Automate repetitive work',
                'Run growth loops continuously',
                'Fundraising narrative ready for VCs',
              ].map(item => (
                <li key={item} className="flex items-start">
                  <div className="bg-brand-green mt-1 mr-4 rounded-full p-1">
                    <svg
                      className="text-brand-green-foreground h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-xl">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-primary mt-8 text-center italic">
              Backed by real startup execution experience and startup funding rounds.
            </p>
          </Card>
        </div>
      </section>
    </>
  )
}
