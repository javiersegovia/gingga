import { Card, CardContent } from '@gingga/ui/components/card'

export function CaseStudiesSection() {
  return (
    <>
      <section className="w-full bg-transparent py-16 md:py-24">
        <div className="container-marketing mx-auto px-4">
          <h2 className="text-brand-green line-stroke mb-6 text-center text-3xl font-bold md:text-4xl">
            Case Studies / Experience
          </h2>
          <p className="mb-12 text-center text-xl">
            Our team has led product & technology for:
          </p>
          <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
            <Card design="grid" className="p-6">
              <CardContent className="p-0">
                <h3 className="mb-2 text-xl font-bold">HoyTrabajas.com</h3>
                <p className="text-brand-blue">YC W22 Startup</p>
              </CardContent>
            </Card>
            <Card design="grid" className="p-6">
              <CardContent className="p-0">
                <h3 className="mb-2 text-xl font-bold">Fluvip.com</h3>
                <p className="text-brand-blue">
                  Marketing platform operating across LATAM
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
