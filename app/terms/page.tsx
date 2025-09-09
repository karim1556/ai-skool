import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | AiSkool",
  description: "Read the terms and conditions for using AiSkool products and services.",
}

const sections = [
  { id: "intro", title: "Introduction" },
  { id: "use", title: "Use of Service" },
  { id: "payments", title: "Payments & Refunds" },
  { id: "content", title: "Content & IP" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "changes", title: "Changes to Terms" },
  { id: "contact", title: "Contact" },
]

export default function TermsPage() {
  const year = new Date().getFullYear()
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Terms of Service</h1>
          <p className="mt-3 text-gray-600">Last updated: {year}</p>
        </div>
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-100 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-blue-100 blur-3xl" />
      </section>

      {/* Content */}
      <section className="px-4 py-12 md:px-6">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[220px,1fr]">
          {/* TOC */}
          <aside className="md:sticky md:top-24 h-fit rounded-xl border bg-white/60 backdrop-blur p-4">
            <div className="text-xs font-semibold text-gray-500 mb-2">ON THIS PAGE</div>
            <nav className="space-y-2">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="block text-sm text-gray-700 hover:text-indigo-700">
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Body */}
          <article className="prose prose-slate max-w-none">
            <h2 id="intro">Introduction</h2>
            <p>
              These Terms govern your access to and use of AiSkool's website, applications, and
              related services. By using our services, you agree to these Terms.
            </p>

            <h2 id="use">Use of Service</h2>
            <ul>
              <li>You must use the service in compliance with applicable laws.</li>
              <li>Do not attempt to disrupt, misuse, or reverse-engineer the platform.</li>
              <li>Accounts are personal; do not share credentials with others.</li>
            </ul>

            <h2 id="payments">Payments & Refunds</h2>
            <p>
              Paid offerings may be subject to separate agreements or refund policies. Please see
              specific product pages for details.
            </p>

            <h2 id="content">Content & IP</h2>
            <p>
              Course content and platform materials are protected by intellectual property laws. You
              may not copy, distribute, or resell content without permission.
            </p>

            <h2 id="liability">Limitation of Liability</h2>
            <p>
              AiSkool is provided on an "as is" basis. To the maximum extent permitted by law, we
              disclaim all warranties and will not be liable for indirect, incidental, or
              consequential damages.
            </p>

            <h2 id="changes">Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of the service after
              changes indicates acceptance of the updated Terms.
            </p>

            <h2 id="contact">Contact</h2>
            <p>
              Questions about these Terms? Email us at
              <a href="mailto:support@aiskool.com"> support@aiskool.com</a>.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}
