import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Kalsuq',
  description: 'Terms and conditions for using Kalsuq e-commerce platform.',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-surface py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12 bg-surface-card border border-border-primary p-8 md:p-16 shadow-2xl">
        <div className="space-y-4 border-b border-border-primary pb-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary tracking-tight">Terms of Service</h1>
          <p className="text-text-secondary text-sm uppercase tracking-widest font-bold">Last Updated: May 2026</p>
        </div>

        <div className="space-y-10 text-text-primary leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-accent">1. Agreement to Terms</h2>
            <p>
              These Terms of Service constitute a legally binding agreement made between you and Kalsuq, concerning your access to and use of our website and e-commerce platform. By accessing the site, you agree that you have read, understood, and agreed to be bound by all of these Terms of Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-accent">2. Products and Pricing</h2>
            <ul className="list-disc pl-5 space-y-2 text-text-secondary">
              <li>All products are subject to availability. We reserve the right to discontinue any products at any time for any reason.</li>
              <li>Prices for our products are subject to change without notice.</li>
              <li>We make every effort to display as accurately as possible the colors and images of our products. However, we cannot guarantee that your computer monitor's display of any color will be accurate.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-accent">3. Order Fulfillment & Cancellations</h2>
            <p>
              We reserve the right to refuse any order you place with us. If an item becomes out of stock after your order is placed (due to concurrent purchases), we will immediately cancel the order and issue a full refund via our payment gateway.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-accent">4. Returns and Refunds</h2>
            <p>
              Eligible items may be returned within 7 days of delivery. The item must be unused, in its original packaging, and accompanied by the receipt. Refunds will be processed to the original payment method within 5-10 business days after inspection.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-accent">5. Limitation of Liability</h2>
            <p>
              In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages arising from your use of the site.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
