import { Button } from '@gingga/ui/components/button'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export function CtaSection() {
  return (
    <div className="w-full bg-black py-48 text-white">
      <div className="container-marketing">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h2 className="text-brand-green mb-6">Ready to Automate Your Business?</h2>
            <p className="mb-8 text-xl text-white/80">
              Book a free consultation today to discover how we can help transform your
              operations.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild variant="primary" hover="noShadow">
                <Link to="/contact">
                  Book a Call
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="rounded-base relative aspect-video w-full max-w-lg border-2 border-white/20 backdrop-blur-sm">
              <div className="inset-x-0 flex justify-center">
                <img
                  src={`${import.meta.env.VITE_ASSETS_URL || ''}/automatas/hero_5.webp`}
                  alt="AI Agent Squad"
                  className="rounded-base w-full drop-shadow-lg"
                />
              </div>

              <div className="flex flex-col items-center justify-end border-t-2 p-4">
                <div className="mt-0 text-center">
                  <p className="text-lg font-semibold">These guys are ready to work!</p>
                  <p className="mb-4 text-sm text-white/80">
                    Get started with a custom AI solution today
                  </p>
                  <div className="bg-brand-green/10 border-brand-green inline-block rounded-full border-2 px-3 py-1 text-sm">
                    <span className="text-brand-green">Starting at</span>
                    {' '}
                    <span className="text-brand-green font-bold">$50/month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
