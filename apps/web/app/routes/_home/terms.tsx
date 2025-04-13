import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'

export const Route = createFileRoute('/_home/terms')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center pt-20 pb-16">
        <div className="container max-w-3xl py-12">
          <h1 className="mb-8 text-3xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <div className="prose dark:prose-invert max-w-none">
            <p className="my-6">
              This page is currently a work in progress. Our full terms of service will be
              available soon.
            </p>
            <p className="my-6">
              By using Gingga&apos;s services, you agree to comply with and be bound by
              these terms of service. Please review them carefully before using our
              platform.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
