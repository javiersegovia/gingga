import { Button } from '@gingga/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gingga/ui/components/card'
import { CalendarIcon, MailIcon, PhoneIcon } from 'lucide-react'

const CONTACT_EMAIL = 'hello@gingga.com'
const CONTACT_PHONE = '+44 7551 273933'
const BOOKING_LINK = 'https://calendly.com/guzman-vla/30min'

export default function ContactSettingsComponent() {
  return (
    <div className="space-y-6 w-full">
      <Card design="grid">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>Need help or have questions? Reach out to us!</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="flex-1" variant="secondary">
            <a href={BOOKING_LINK} target="_blank" rel="noopener noreferrer">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Book a Free Call
            </a>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card design="grid">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MailIcon className="h-6 w-6" />
              Email
            </CardTitle>
            <CardDescription>Best for non-urgent inquiries.</CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-brand-blue hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </CardContent>
        </Card>

        <Card design="grid">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PhoneIcon className="h-6 w-6" />
              Phone
            </CardTitle>
            <CardDescription>For more immediate assistance.</CardDescription>
          </CardHeader>
          <CardContent>
            <a href={`tel:${CONTACT_PHONE}`} className="hover:underline">
              {CONTACT_PHONE}
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
