import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '~/components/shared/navbar'
import { Footer } from '~/components/shared/footer'

export const Route = createFileRoute('/_home/cookies')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center pt-20 pb-16">
        <div className="container max-w-3xl py-12">
          <h1 className="mb-8 text-3xl font-bold">Cookie Policy</h1>
          <p className="text-muted-foreground mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <div className="prose dark:prose-invert max-w-none">
            <p className="my-6">
              This page is currently a work in progress. Our full cookie policy will be
              available soon.
            </p>
            <p className="my-6">
              This policy explains how Gingga uses cookies and similar technologies to
              recognize you when you visit our platform. It explains what these
              technologies are and why we use them, as well as your rights to control our
              use of them.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
