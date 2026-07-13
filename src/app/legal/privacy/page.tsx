import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for MandirOS — how we collect, use, and protect personal data for temples and devotees.",
}

export default function PrivacyPolicyPage() {
  return (
    <main className="gradient-hero min-h-[80vh]">
      <article className="page-container py-10 sm:py-14 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-saffron-600 mb-2">
          Legal
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-sacred-maroon tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-stone-500 mt-2 mb-8">
          Last updated: 13 July 2026 · Applies to MandirOS platform and temple tenants
        </p>

        <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed">
          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">1. Overview</h2>
          <p>
            MandirOS (“we”, “us”) provides multi-tenant software so temple trusts can accept
            donations, book sevas, log counter money, publish transparency, and notify
            staff. This Privacy Policy explains what personal data we process, why, and your
            choices. For many features the temple trust is the primary controller of devotee
            data; we act as a processor / platform operator hosting that data.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">2. Data we collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Account & staff:</strong> name, phone, email, role, authentication
              (OTP / credentials / optional OAuth).
            </li>
            <li>
              <strong>Devotee / donor:</strong> name, phone, email, gotra, sankalp notes,
              optional PAN or address for 80G-style receipts, donation and booking history.
            </li>
            <li>
              <strong>Payment metadata:</strong> amount, status, order/payment IDs from
              gateways (e.g. Razorpay). Full card data is handled by the payment provider,
              not stored by MandirOS.
            </li>
            <li>
              <strong>Temple configuration:</strong> legal trust fields, branding, plan,
              notification emails, Slack webhook URLs, campaign and pooja settings.
            </li>
            <li>
              <strong>Operational logs:</strong> check-ins, cash desk entries, SOS / lost &
              found submissions, support messages where offered.
            </li>
            <li>
              <strong>Technical:</strong> IP, device/browser type, cookies or similar for
              session and security, coarse analytics if enabled.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">3. How we use data</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide donations, bookings, receipts, certificates, and dashboards.</li>
            <li>
              Send weekly reports and operational alerts you configure (email / Slack).
            </li>
            <li>Enforce plans, prevent fraud, and secure the Platform.</li>
            <li>
              Improve product reliability (aggregated metrics; we do not sell personal data).
            </li>
            <li>Comply with law and respond to lawful requests.</li>
          </ul>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">4. Legal bases</h2>
          <p>
            Where the Digital Personal Data Protection Act, 2023 (DPDP) and other Indian
            laws apply, we rely on consent, contractual necessity to deliver the service you
            request, legitimate uses permitted by law, and employment / staff access
            controls set by the temple. Temples must ensure they have a valid basis to
            collect devotee data they enter into MandirOS.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">5. Sharing</h2>
          <p>We share personal data only as needed with:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>The temple tenant</strong> you interact with (trustees, staff roles).
            </li>
            <li>
              <strong>Processors:</strong> hosting (e.g. Vercel), database (e.g. Supabase /
              Postgres), payment (Razorpay), SMS/OTP, email (e.g. Resend), optional Slack
              webhooks you configure.
            </li>
            <li>
              <strong>Authorities</strong> when required by law or to protect rights and
              safety.
            </li>
          </ul>
          <p>
            We do not sell personal data. Public transparency pages may show aggregated
            donation totals and campaigns — not full PAN lists.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">
            6. Notifications (email & Slack)
          </h2>
          <p>
            Trustees may enable automatic weekly money reports. Emails go only to addresses
            configured by temple admins; Slack messages go to webhooks they supply. Platform-
            level env webhooks, if set by operators, are for ops monitoring. Disable auto-
            send anytime in Dashboard → Weekly report settings.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">7. Retention</h2>
          <p>
            We retain account, donation, and booking records for as long as the tenant is
            active and as needed for tax, dispute, and legal retention (often multi-year for
            financial records). Cash desk and audit-style logs may be retained similarly.
            You may request deletion or export; some data may be retained where law requires.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">8. Security</h2>
          <p>
            We use industry-standard measures: encrypted transport (HTTPS), access-controlled
            databases, role-based staff APIs, and secrets for cron/admin jobs. No method is
            100% secure; report suspected incidents via support channels in{" "}
            <Link href="/help" className="text-saffron-700 font-medium hover:underline">
              Help
            </Link>
            .
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">9. Children</h2>
          <p>
            The Platform is not directed at children under 18 for account creation. Guardians
            may book sevas for family members; temples should avoid collecting unnecessary
            data about minors.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">10. Your rights</h2>
          <p>
            Subject to applicable law, you may request access, correction, erasure, or
            withdrawal of consent for processing we control. Devotees should first contact
            the temple trust that collected their data. Platform account holders can update
            profile fields in-app and contact support for broader requests.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">11. Cookies</h2>
          <p>
            We use essential cookies/session storage for login and security. Optional
            analytics cookies, if enabled, will be disclosed and controllable where required.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">12. International transfers</h2>
          <p>
            Infrastructure may process data in India and/or other regions used by our
            subprocessors. We take reasonable contractual and technical steps appropriate to
            the transfer.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">13. Changes</h2>
          <p>
            We may update this Policy and will revise the “Last updated” date. Material
            changes may also be surfaced in-product or by email to admins.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">14. Contact</h2>
          <p>
            Privacy requests: use Help support channels or the contact method published on
            the live MandirOS site. Identify your temple tenant slug where relevant so we
            can route the request correctly.
          </p>
        </div>

        <p className="mt-10 text-sm text-stone-500">
          See also{" "}
          <Link href="/legal/terms" className="text-saffron-700 font-medium hover:underline">
            Terms of Service
          </Link>{" "}
          ·{" "}
          <Link href="/legal/dpa" className="text-saffron-700 font-medium hover:underline">
            DPA
          </Link>{" "}
          ·{" "}
          <Link href="/legal/sla" className="text-saffron-700 font-medium hover:underline">
            SLA
          </Link>{" "}
          ·{" "}
          <Link href="/" className="text-saffron-700 font-medium hover:underline">
            MandirOS home
          </Link>
        </p>
      </article>
    </main>
  )
}
