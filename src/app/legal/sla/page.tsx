import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Service Level Commitment",
  description:
    "MandirOS service levels for Free, Growth, and Trust Pro temple tenants — uptime targets and support response.",
}

export default function ServiceLevelPage() {
  return (
    <main className="gradient-hero min-h-[80vh]">
      <article className="page-container py-10 sm:py-14 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-saffron-600 mb-2">
          Legal · Ops
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-sacred-maroon tracking-tight">
          Service Level Commitment
        </h1>
        <p className="text-sm text-stone-500 mt-2 mb-8">
          Last updated: 13 July 2026 · Applies to MandirOS production at the canonical host
        </p>

        <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed">
          <p className="rounded-xl border border-stone-200 bg-white p-4 text-sm">
            This page states operational targets for paid and free temples. It is a good-faith
            commitment, not a penalty-bearing enterprise SLA unless a separate signed order
            form says otherwise. Support playbook:{" "}
            <Link href="/help" className="text-saffron-700 font-medium hover:underline">
              /help
            </Link>
            .
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">1. Scope</h2>
          <p>
            Covered: MandirOS web app, tenant sites (<code className="text-xs bg-white px-1 rounded border">/t/{"{slug}"}</code>
            ), staff dashboard, and documented public APIs on the production deployment.
            Not covered solely by MandirOS: Razorpay, SMS, email, Slack, customer networks,
            or misconfiguration by temple staff.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">2. Availability target</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 pr-3">Plan</th>
                  <th className="py-2 pr-3">Monthly uptime target</th>
                  <th className="py-2">Notes</th>
                </tr>
              </thead>
              <tbody className="text-stone-600">
                <tr className="border-b border-stone-100">
                  <td className="py-2 pr-3 font-medium">Free</td>
                  <td className="py-2 pr-3">Best effort</td>
                  <td className="py-2">No credit; same platform, lower support priority</td>
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-2 pr-3 font-medium">Growth</td>
                  <td className="py-2 pr-3">99.5%</td>
                  <td className="py-2">Excludes planned maintenance windows</td>
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-2 pr-3 font-medium">Trust Pro</td>
                  <td className="py-2 pr-3">99.9%</td>
                  <td className="py-2">Priority incident handling</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-stone-500">
            Measurement: successful HTTP responses for core routes (platform home, tenant home,
            donate/book APIs) excluding customer-caused errors (4xx) and third-party payment
            provider outages.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">3. Support response (business hours IST)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 pr-3">Severity</th>
                  <th className="py-2 pr-3">Growth</th>
                  <th className="py-2 pr-3">Trust Pro</th>
                  <th className="py-2">Free</th>
                </tr>
              </thead>
              <tbody className="text-stone-600">
                <tr className="border-b border-stone-100">
                  <td className="py-2 pr-3">
                    <strong>P0</strong> — money/trust down
                  </td>
                  <td className="py-2 pr-3">15 min ack</td>
                  <td className="py-2 pr-3">15 min ack · continuous</td>
                  <td className="py-2">Best effort</td>
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-2 pr-3">
                    <strong>P1</strong> — major feature broken
                  </td>
                  <td className="py-2 pr-3">4 business hours</td>
                  <td className="py-2 pr-3">2 business hours</td>
                  <td className="py-2">Best effort</td>
                </tr>
                <tr className="border-b border-stone-100">
                  <td className="py-2 pr-3">
                    <strong>P2 / P3</strong>
                  </td>
                  <td className="py-2 pr-3">2 business days</td>
                  <td className="py-2 pr-3">1 business day</td>
                  <td className="py-2">Best effort</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Business hours default: Mon–Sat 10:00–19:00 IST, excluding public holidays unless
            a festival war-room was pre-agreed. Severity definitions:{" "}
            <Link
              href="/help#support"
              className="text-saffron-700 font-medium hover:underline"
            >
              Support triage
            </Link>
            .
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">4. Maintenance</h2>
          <p>
            Planned maintenance will be announced when practical (dashboard banner or admin
            email). Emergency security patches may proceed without notice; we prioritise
            safety over ceremony.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">5. Credits (paid plans only)</h2>
          <p>
            If Growth or Trust Pro monthly uptime falls below the target for reasons solely
            attributable to MandirOS (not third parties or customer error), the temple may
            request a service credit of up to <strong>10% of that month’s subscription fee</strong>{" "}
            for Growth, or <strong>15%</strong> for Trust Pro, as the exclusive remedy for
            availability shortfall. Credits do not apply to transaction fees, Free plan, or
            beta features. Request within 30 days of the month end via support channels.
          </p>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">6. How to open a ticket</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Use the intake template in{" "}
              <Link href="/help#support" className="text-saffron-700 font-medium hover:underline">
                Help → Support triage
              </Link>{" "}
              (temple slug, plan, URL, what you tried).
            </li>
            <li>
              Primary channel: WhatsApp / email published by your MandirOS account manager, or
              the contact path listed on Help. In-app messages: Dashboard → Messages when
              enabled.
            </li>
            <li>
              Shared ticket tool (Linear / email inbox): internal CS uses the company support
              queue; customers do not need a separate login unless provided.
            </li>
            <li>P0 only: also escalate per incident runbook (eng + founder).</li>
          </ol>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">7. Exclusions</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Force majeure, cloud region outages beyond our control</li>
            <li>Payment gateway, SMS, or email provider failures</li>
            <li>Customer-side DNS, devices, or staff credential loss</li>
            <li>Features outside the entitled plan, or preview/demo tenants</li>
          </ul>

          <h2 className="text-lg font-semibold text-sacred-maroon pt-2">8. Changes</h2>
          <p>
            We may update this commitment with a revised “Last updated” date. Material
            reductions for paid plans will be communicated to tenant admins where practical.
          </p>
        </div>

        <p className="mt-10 text-sm text-stone-500">
          <Link href="/legal/terms" className="text-saffron-700 font-medium hover:underline">
            Terms
          </Link>{" "}
          ·{" "}
          <Link href="/legal/privacy" className="text-saffron-700 font-medium hover:underline">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href="/legal/dpa" className="text-saffron-700 font-medium hover:underline">
            DPA
          </Link>
        </p>
      </article>
    </main>
  )
}
