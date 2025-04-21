export function DeliverablesSection() {
  return (
    <>
      <section className="bg-background border-border w-full border-y-1 py-16 md:py-24">
        <div className="container-marketing mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            What You Get — Sample Deliverables Per Mode
          </h2>
          <div className="overflow-x-auto">
            <table className="mx-auto w-full max-w-4xl border-collapse">
              <thead>
                <tr>
                  <th className="border-border text-primary border-b p-4 text-left">
                    Mode
                  </th>
                  <th className="border-border text-primary border-b p-4 text-left">
                    Key Deliverables
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-border border-b p-4 font-medium">
                    Discovery Mode
                  </td>
                  <td className="border-border border-b p-4">
                    Prototype, landing page tests, market validation report, user
                    interviews
                  </td>
                </tr>
                <tr>
                  <td className="border-border border-b p-4 font-medium">
                    Full Power Mode
                  </td>
                  <td className="border-border border-b p-4">
                    Investor-ready MVP, UX flows, full AI workflow automations, growth
                    loop setup
                  </td>
                </tr>
                <tr>
                  <td className="border-border border-b p-4 font-medium">
                    Growth Mode (60h)
                  </td>
                  <td className="border-border border-b p-4">
                    MVP v2 + features, growth loop scaling, optimized fundraising
                    narrative, GTM testing
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}
