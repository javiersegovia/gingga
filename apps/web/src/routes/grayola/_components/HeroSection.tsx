/* eslint-disable no-alert */
import { ArrowRightIcon, Clock, Zap } from 'lucide-react'
import { Button } from '~/components/ui/button'

export function HeroSection() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full bg-transparent py-12 md:py-16 lg:py-24">
        <div className="container-marketing mx-auto px-4">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12 lg:gap-16">
            <div className="flex flex-1 flex-col">
              <div>
                <p className="bg-brand-blue/10 text-brand-blue border-brand-blue mb-4 inline-block w-auto rounded-full border-2 px-3 py-1 text-xs font-medium sm:text-sm">
                  Build Faster. Smarter. Fundable.
                </p>
              </div>
              <h1 className="text-primary mb-6 text-2xl font-bold sm:text-3xl md:mb-8 md:text-4xl">
                Founders + AI Squad
                {/* <br />
                <span className="text-primary font-semibold">Fundable.</span> */}
              </h1>
              <p className="mb-6 text-base sm:text-lg md:mb-8 md:text-xl">
                We combine experienced founders and AI agents working at full capacity.
                Together, we build faster, validate smarter, and stay investor-ready.
              </p>
              <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8 md:mb-8">
                <div className="flex items-center gap-2">
                  <Zap className="text-brand-pink h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-xs font-medium sm:text-sm">
                    MVPs ready in 4-6 weeks
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-brand-green h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-xs font-medium sm:text-sm">
                    Investor-ready execution
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  variant="outline"
                  className="text-foreground"
                  size="lg"
                  onClick={() => {
                    document
                      .getElementById('pricing')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  See Pricing
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    alert(
                      'Contact us at guzman.vla@gmail.com or via WhatsApp for more details.',
                    )
                  }}
                >
                  Partner with Us
                  <ArrowRightIcon className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>
            <div className="mt-8 flex w-full justify-center md:mt-0 md:w-auto">
              <div className="border-border bg-card/30 flex flex-col items-center justify-center gap-8 rounded-3xl border-2 p-8 md:flex lg:h-[450px] lg:w-[450px]">
                <div className="flex flex-col items-center gap-4">
                  <div className="border-primary relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 bg-slate-50">
                    {/* Grayola logo - URL to be filled by user */}
                    <img
                      src={`${import.meta.env.VITE_ASSETS_URL || ''}/company_logos/grayola.svg`}
                      alt="Grayola Logo"
                      className="h-24 w-24 object-contain"
                    />
                  </div>
                </div>
                <div className="text-center text-xl font-semibold">+</div>
                <div className="flex flex-col items-center gap-4">
                  <div className="border-primary bg-background relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2">
                    <img
                      src={`${import.meta.env.VITE_ASSETS_URL || ''}/logo/logo-dark-v2.png`}
                      alt="Gingga Logo"
                      className="hidden h-24 w-24 object-contain dark:block"
                    />
                    <img
                      src={`${import.meta.env.VITE_ASSETS_URL || ''}/logo/logo-light-v2.png`}
                      alt="Gingga Logo"
                      className="h-24 w-24 object-contain dark:hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
