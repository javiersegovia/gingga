import { createFileRoute } from '@tanstack/react-router'
import { Footer } from '~/components/shared/footer'
import { Navbar } from '~/components/shared/navbar'

export const Route = createFileRoute('/_home/privacy')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center pt-20 pb-16">
        <div className="container max-w-3xl py-12">
          <h1 className="mb-8 text-3xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground mb-4">
            Last updated:
            {' '}
            {new Date().toLocaleDateString()}
          </p>
          <div className="prose dark:prose-invert max-w-none">
            <p className="my-6">
              This page is currently a work in progress. Our full privacy policy will be
              available soon.
            </p>
            <p className="my-6">
              At Gingga, we take your privacy seriously. We are committed to protecting
              your personal data and ensuring transparency about how we collect, use, and
              share your information.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
