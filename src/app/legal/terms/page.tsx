import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for MandirOS — multi-tenant digital trust platform for temples in India.",
}

export default function TermsOfServicePage() {
  return (
    <main className="gradient-hero min-h-[80vh]">
      <article className="page-container py-10 sm:py-14 max-w-3xl prose prose-stone prose-headings:text-sacred-maroon">
        <p className="text-xs font-semibold uppercase tracking-wide text-saffron-600 not-prose mb-2">
          Legal
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-sacred-maroon tracking-tight not-prose">
          Terms of Service
        </h1>
        <p className="text-sm text-stone-500 not-prose mt-2 mb-8">
          Last updated: 13 July 2026 · MandirOS platform operated for temple trusts in India
        </p>

        <section className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed">
          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">1. Agreement</h2>
          <p>
            These Terms of Service (“Terms”) govern access to and use of MandirOS (the
            “Platform”), including websites, APIs, dashboards, and related services that let
            temple trusts accept donations, manage sevas, run a money desk, publish
            transparency, and operate staff workflows. By creating an account, listing a
            temple, or using the Platform, you agree to these Terms on behalf of yourself
            and, if applicable, the temple trust or organisation you represent.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">2. Who we serve</h2>
          <p>
            MandirOS is a multi-tenant SaaS product. Each temple is a tenant (for example{" "}
            <code className="text-xs bg-white px-1.5 py-0.5 rounded border">
              /t/your-temple-slug
            </code>
            ). Anchor tenants such as Jamsawli Hanuman Lok are examples of live temples, not
            the Platform brand itself. You must have authority to act for the temple trust
            when you configure banking, tax (including 80G), staff roles, or public pages.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">3. Accounts & roles</h2>
          <p>
            You are responsible for credentials, OTP devices, and staff you invite. Roles
            (e.g. ADMIN, TRUSTEE, clerk-level access) control who can see money, donor data,
            and trust settings. Do not share admin access. Notify us promptly of suspected
            unauthorised use.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">4. Plans, fees & payments</h2>
          <p>
            Subscription tiers (Free, Growth, Trust Pro) and feature gates are described on{" "}
            <Link href="/pricing" className="text-saffron-700 font-medium hover:underline">
              Pricing
            </Link>
            . Transaction fees on online payments may apply as disclosed at checkout or in
            plan details. Payment processing is provided by third parties (e.g. Razorpay).
            Refunds of subscription fees, if any, are handled case-by-case; donation refunds
            remain the temple trust’s responsibility subject to applicable law and payment
            network rules.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">5. Temple obligations</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Provide accurate trust legal name, registration, 80G / PAN, and bank details.
            </li>
            <li>
              Use donation and booking data only for legitimate temple and legal purposes.
            </li>
            <li>
              Ensure public transparency pages and campaign claims are truthful.
            </li>
            <li>
              Comply with Indian law applicable to religious trusts, FCRA (if relevant), IT
              Act, and tax rules (including Form 10BD workflows when used).
            </li>
            <li>
              Not use the Platform for fraud, money laundering, hate speech, or unlawful
              fundraising.
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">6. Donations & receipts</h2>
          <p>
            MandirOS facilitates digital collection, receipts, and optional 80G-style
            certificate fields. We are not a charity, payment bank, or tax advisor. Tax
            deductibility depends on the temple’s registrations and donor circumstances.
            Counter / cash entries logged by staff are temple records; the Platform stores
            them as entered by authorised users.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">7. Acceptable use</h2>
          <p>
            You may not reverse-engineer the Platform beyond lawful rights, scrape personal
            data, overload infrastructure, resell access without permission, or misrepresent
            affiliation with MandirOS. Feature access may be limited by plan; attempting to
            bypass entitlements is a breach of these Terms.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">
            8. Data, privacy & notifications
          </h2>
          <p>
            Processing of personal data is described in our{" "}
            <Link href="/legal/privacy" className="text-saffron-700 font-medium hover:underline">
              Privacy Policy
            </Link>
            . Temples may configure weekly report emails and Slack webhooks. You must only
            send automated reports to addresses and workspaces you control or are authorised
            to notify.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">9. Intellectual property</h2>
          <p>
            MandirOS software, branding, and documentation remain our property or that of
            our licensors. Temple names, logos, and content remain the temple’s. You grant
            us a limited licence to host and display content you upload to operate the
            tenant.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">10. Availability & support</h2>
          <p>
            We aim for reliable uptime but do not guarantee uninterrupted service. Scheduled
            maintenance, third-party outages (payments, SMS, email), and force majeure may
            affect availability. Support channels and playbooks are available via{" "}
            <Link href="/help" className="text-saffron-700 font-medium hover:underline">
              Help
            </Link>
            .
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">11. Disclaimers</h2>
          <p>
            THE PLATFORM IS PROVIDED “AS IS” TO THE EXTENT PERMITTED BY LAW. WE DISCLAIM
            WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT. WE DO NOT WARRANT THAT TAX, 80G, OR ACCOUNTING OUTPUTS ARE
            COMPLETE FOR REGULATORY FILING WITHOUT YOUR REVIEW AND THAT OF YOUR CA.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">12. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by applicable law, MandirOS and its operators
            shall not be liable for indirect, incidental, special, consequential, or
            punitive damages, or for lost donations, profits, or data. Aggregate liability
            for claims arising from the Platform in any twelve-month period shall not exceed
            the subscription fees paid by the relevant temple for that period (or ₹10,000 if
            none).
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">13. Suspension & termination</h2>
          <p>
            We may suspend or terminate access for breach, legal risk, non-payment, or
            abuse. You may stop using the Platform at any time. Upon termination, export of
            reasonable operational data may be available on request for a limited period,
            subject to legal holds.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">14. Changes</h2>
          <p>
            We may update these Terms. Material changes will be posted on this page with a
            revised “Last updated” date. Continued use after changes constitutes acceptance
            where permitted by law.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">15. Governing law</h2>
          <p>
            These Terms are governed by the laws of India. Courts at Chhindwara, Madhya
            Pradesh (or such other seat as we designate in writing) shall have exclusive
            jurisdiction, subject to mandatory consumer protections that cannot be waived.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">16. Contact</h2>
          <p>
            Legal and platform questions: use the support channels listed in Help, or email
            the address published on the live site contact / admin channels. For temple-
            specific donation issues, contact the temple trust first — MandirOS is the
            software layer, not the collecting trust for every tenant. Data processing:{" "}
            <Link href="/legal/dpa" className="text-saffron-700 font-medium hover:underline">
              DPA
            </Link>
            . Service levels:{" "}
            <Link href="/legal/sla" className="text-saffron-700 font-medium hover:underline">
              SLA
            </Link>
            .
          </p>
        </section>

        <p className="not-prose mt-10 text-sm text-stone-500">
          See also{" "}
          <Link href="/legal/privacy" className="text-saffron-700 font-medium hover:underline">
            Privacy Policy
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
