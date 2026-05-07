import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Kalsuq',
  description: 'How we collect, use, and protect your data at Kalsuq.',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-surface py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12 bg-surface-card border border-border-primary p-8 md:p-16 shadow-2xl">
        <div className="space-y-4 border-b border-border-primary pb-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary tracking-tight">Privacy Policy</h1>
          <p className="text-text-secondary text-sm uppercase tracking-widest font-bold">Last Updated: May 2026</p>
        </div>

        <div className="space-y-10 text-text-primary leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-accent">1. Introduction</h2>
            <p>
              At Kalsuq ("we," "our," or "us"), your privacy is our priority. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase. By using our services, you consent to the data practices described in this policy, adhering to data minimization principles under GDPR and CCPA.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-accent">2. Information We Collect (Data Minimization)</h2>
            <p>We strictly collect only the data necessary to fulfill your order and improve your experience:</p>
            <ul className="list-disc pl-5 space-y-2 text-text-secondary">
              <li><strong className="text-text-primary">Contact Information:</strong> Name, Email, and Phone Number (required for order delivery and Chapa payment integration).</li>
              <li><strong className="text-text-primary">Delivery Details:</strong> Physical address and optional map pins for our logistics partners.</li>
              <li><strong className="text-text-primary">Transaction Data:</strong> We do <strong>not</strong> store your credit card or mobile money PINs. All payments are securely processed by Chapa. We only store the transaction reference ID and payment status.</li>
              <li><strong className="text-text-primary">Usage Data:</strong> Basic analytics (e.g., pages visited) to optimize our platform using cookies.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-accent">3. How We Use Your Information</h2>
            <p>Your data is used exclusively to:</p>
            <ul className="list-disc pl-5 space-y-2 text-text-secondary">
              <li>Process and deliver your orders.</li>
              <li>Communicate order status via WhatsApp or Email.</li>
              <li>Prevent fraud and ensure platform security.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-accent">4. Third-Party Sharing</h2>
            <p>We do not sell your personal data. We only share necessary information with trusted partners:</p>
            <ul className="list-disc pl-5 space-y-2 text-text-secondary">
              <li><strong>Payment Gateways:</strong> Chapa (Name, Email, Total Amount).</li>
              <li><strong>Logistics:</strong> Local delivery drivers (Name, Phone, Address).</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-accent">5. Your Rights (GDPR & CCPA)</h2>
            <p>Depending on your location, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-2 text-text-secondary">
              <li>Access the personal data we hold about you.</li>
              <li>Request the deletion of your personal data ("Right to be Forgotten").</li>
              <li>Opt-out of marketing communications.</li>
            </ul>
            <p className="mt-4 text-sm font-bold bg-accent/10 p-4 border-l-4 border-accent">
              To exercise these rights, please contact our Data Protection Officer at privacy@kalsuq.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
