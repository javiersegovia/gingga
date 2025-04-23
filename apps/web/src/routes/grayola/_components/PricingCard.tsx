/* eslint-disable no-alert */
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { cn } from '~/lib/utils'

interface PricingCardProps {
  title: string
  price: string
  period: string
  features: string[]
  highlighted: boolean
  contactEmail: string
}

export function PricingCard({
  title,
  price,
  period,
  features,
  highlighted,
  contactEmail,
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        'overflow-hidden transition-all duration-300',
        highlighted ? 'border-primary border-2 shadow-md' : 'border-none',
      )}
    >
      <CardContent className="p-6 md:p-8">
        <div className="mb-6 text-center">
          <h3
            className={cn(
              'mb-2 text-xl font-bold',
              highlighted ? 'text-primary' : 'text-foreground',
            )}
          >
            {title}
          </h3>
          <div className="flex items-center justify-center">
            <span className="text-3xl font-bold">{price}</span>
            <span className="text-muted-foreground ml-2">{period}</span>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          {features.map(feature => (
            <div key={feature} className="flex items-start">
              <div className="bg-brand-green mt-1 mr-3 rounded-full p-1">
                <svg
                  className="text-brand-green-foreground h-3 w-3"
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
              <span className="text-foreground/80">{feature}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={() => {
            alert(`Contact us at ${contactEmail} or via WhatsApp for more details.`)
          }}
          variant={highlighted ? 'primary' : 'default'}
          className={cn('w-full py-6', highlighted ? '' : 'bg-accent hover:bg-accent/80')}
        >
          Select Plan
        </Button>
      </CardContent>
    </Card>
  )
}
