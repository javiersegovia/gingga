import { Button } from '@gingga/ui/components/button'
import { Card, CardContent } from '@gingga/ui/components/card'
import { DirectionAwareTabs } from '@gingga/ui/components/direction-aware-tabs'
import { createFileRoute } from '@tanstack/react-router'
import { CalendarIcon, MailIcon } from 'lucide-react'
import { Footer } from '~/components/shared/footer'
import { Navbar } from '~/components/shared/navbar'
import { ContactForm } from '~/features/contact/components/contact-form'

// Constants shared across routes
const BOOKING_LINK = 'https://calendly.com/guzman-vla/30min'

export const Route = createFileRoute('/contact')({
  component: RouteComponent,
})

function ContactHero() {
  return (
    <div className="relative w-full pt-10">
      <div className="container-marketing flex flex-col items-center text-center">
        <h1 className="text-primary line-stroke">Get in Touch</h1>
        <p className="text-muted-foreground mt-4 max-w-[800px] md:text-xl">
          We&apos;re here to help you get the most out of AI.
        </p>
      </div>
    </div>
  )
}

function BookACallContent() {
  return (
    <div className="p-5">
      <div className="mb-4 flex flex-col space-y-2">
        <h2 className="text-primary line-stroke text-xl font-bold">
          Book a Free Consultation
        </h2>
        <p className="text-muted-foreground text-sm">
          Book a call with our team to discuss your AI integration needs.
        </p>
      </div>

      <div className="flex min-h-[300px] flex-col items-center justify-center">
        <Button asChild size="lg" variant="secondary" className="w-full max-w-md">
          <a href={BOOKING_LINK} target="_blank" rel="noopener noreferrer">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Book a Free Call
          </a>
        </Button>
      </div>
    </div>
  )
}

function RequestQuoteContent() {
  return (
    <div className="p-5">
      <div className="mb-3 flex flex-col space-y-2">
        <h2 className="text-primary line-stroke text-xl font-bold">
          Request a Quotation
        </h2>
        <p className="text-muted-foreground text-sm">
          Have a question or want to learn more about our services?
        </p>
      </div>
      <ContactForm />
    </div>
  )
}

function BookingSection() {
  const tabs = [
    {
      id: 0,
      label: 'Request a Quote',
      content: <RequestQuoteContent />,
    },
    {
      id: 1,
      label: 'Book a Call',
      content: <BookACallContent />,
    },
  ]

  return (
    <div className="relative w-full py-12">
      <div className="container-marketing max-w-xl">
        <Card design="grid" hover="noShadow">
          <CardContent>
            <DirectionAwareTabs tabs={tabs} className="mx-auto my-5" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ContactInfo() {
  return (
    <div className="relative w-full pt-4 pb-10">
      <div className="container-marketing">
        <h2 className="mb-6 text-center text-2xl font-bold sm:text-3xl">
          Chat directly with us
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card design="grid" hover="noShadow" className="text-center">
            <CardContent className="flex flex-col items-center p-4">
              <div className="bg-primary/10 mb-3 flex h-10 w-10 items-center justify-center rounded-full">
                <MailIcon className="h-8 w-8" />
              </div>
              <h3 className="mb-1 text-base font-medium">Email</h3>
              <p className="text-muted-foreground text-base">hello@gingga.com</p>
              <a href="mailto:hello@gingga.com">
                <Button variant="secondary" size="md" className="mt-2">
                  Send an email
                </Button>
              </a>
            </CardContent>
          </Card>

          <Card design="grid" hover="noShadow" className="text-center">
            <CardContent className="flex flex-col items-center p-4">
              <div className="bg-primary/10 mb-3 flex h-10 w-10 items-center justify-center rounded-full">
                <img
                  src={`${import.meta.env.VITE_ASSETS_URL || ''}/company_logos/whatsapp.svg`}
                  alt="WhatsApp"
                  className="h-10 w-10"
                />
              </div>
              <h3 className="mb-1 text-base font-medium">WhatsApp</h3>
              <p className="text-muted-foreground text-base">+44 7551 273933</p>
              <a
                href="https://wa.me/447551273933"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="md" className="mt-2">
                  Message us
                </Button>
              </a>
            </CardContent>
          </Card>

          <Card design="grid" hover="noShadow" className="text-center">
            <CardContent className="flex flex-col items-center p-4">
              <div className="bg-primary/10 mb-3 flex h-10 w-10 items-center justify-center rounded-full">
                <img
                  src={`${import.meta.env.VITE_ASSETS_URL || ''}/company_logos/telegram.svg`}
                  alt="Telegram"
                  className="h-8 w-8"
                />
              </div>
              <h3 className="mb-1 text-base font-medium">Telegram</h3>
              <p className="text-muted-foreground text-base">+44 7551 273933</p>
              <a
                href="https://t.me/+447551273933"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="md" className="mt-2">
                  Chat with us
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function RouteComponent() {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative w-full bg-transparent">
        <div className="diagonal-pattern absolute inset-0" />
        <div className="relative z-10">
          <Navbar />
          <ContactHero />
          <div id="booking-section">
            <BookingSection />
          </div>
          <ContactInfo />
          <Footer />
        </div>
      </div>
    </div>
  )
}
