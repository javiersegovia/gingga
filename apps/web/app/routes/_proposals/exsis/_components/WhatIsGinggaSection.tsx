export const WhatIsGinggaSection = () => {
  return (
    <section className="bg-muted/40 relative flex min-h-screen flex-col items-center justify-center gap-12 overflow-hidden p-8 py-20">
      <h2 className="text-center text-5xl font-bold tracking-tight lg:text-7xl">
        What is Gingga?
      </h2>
      <p className="text-primary mt-4 max-w-3xl text-center text-2xl font-semibold lg:text-3xl">
        AI agents built for S&M Businesses — no code, no fluff.
      </p>

      <div className="text-muted-foreground mt-6 grid w-full max-w-5xl grid-cols-1 gap-6 text-lg md:grid-cols-2 lg:text-xl">
        <div className="bg-card rounded-lg border p-6 shadow-md">
          <h3 className="text-foreground mb-3 text-xl font-semibold">Use Cases:</h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>Lead generation</li>
            <li>Data enrichment</li>
            <li>Automated outreach</li>
            <li>
              Social media self-management (content suggestions, replies, DM handling)
            </li>
          </ul>
        </div>
        <div className="bg-card rounded-lg border p-6 shadow-md">
          <h3 className="text-foreground mb-3 text-xl font-semibold">Key Features:</h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>Built-in templates by vertical = fast setup</li>
            <li>Friendly chat UX + deep backend logic (APIs, memory, workflows)</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 w-full max-w-3xl text-center">
        <h3 className="text-foreground mb-4 text-2xl font-semibold">
          Two White-Label Levels:
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="text-muted-foreground bg-card rounded-lg border p-4 shadow-sm">
            <p className="text-foreground font-medium">Simple Branded Layer</p>
            <p>→ Fast launch</p>
          </div>
          <div className="text-muted-foreground bg-card rounded-lg border p-4 shadow-sm">
            <p className="text-foreground font-medium">Full Custom Interface + Domain</p>
            <p>→ Enterprise use</p>
          </div>
        </div>
      </div>

      <p className="mt-8 text-2xl font-bold italic lg:text-3xl">
        Not chatbots. Agents that do.
      </p>
      <p className="text-muted-foreground mt-4 max-w-4xl text-center text-xl lg:text-2xl">
        Gingga combines speed, simplicity, and scalability, making it the perfect
        complement to custom enterprise builds.
      </p>
    </section>
  )
}
