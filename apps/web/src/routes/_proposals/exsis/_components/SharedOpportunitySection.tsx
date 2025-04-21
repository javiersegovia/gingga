export function SharedOpportunitySection() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-12 p-8">
      <h2 className="text-center text-5xl font-bold tracking-tight lg:text-7xl">
        Shared Opportunity
      </h2>
      <div className="text-muted-foreground mt-6 grid grid-cols-1 gap-8 text-xl md:grid-cols-2 lg:text-2xl">
        <div className="rounded-lg border p-6 shadow-md">
          <h3 className="text-foreground mb-3 text-2xl font-semibold">Exsis</h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>Expanding into UK</li>
            <li>Strong technical backbone</li>
          </ul>
        </div>
        <div className="rounded-lg border p-6 shadow-md">
          <h3 className="text-foreground mb-3 text-2xl font-semibold">
            You (with Gingga)
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>Building AI-powered execution</li>
            <li>Leveraging Gingga&apos;s platform</li>
          </ul>
        </div>
      </div>
      <p className="text-primary mt-8 text-2xl font-medium lg:text-3xl">
        Shared vision: Scalable infrastructure meets GTM innovation
      </p>
      <p className="mt-4 text-3xl font-bold lg:text-4xl">
        Let&apos;s build something bigger together
      </p>
    </section>
  )
}
