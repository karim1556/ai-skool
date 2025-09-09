import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | AiSkool",
  description: "Learn how AiSkool collects, uses, and protects your information.",
}

const sections = [
  { id: "intro", title: "Overview" },
  { id: "collect", title: "Information We Collect" },
  { id: "use", title: "How We Use Information" },
  { id: "security", title: "Data Retention & Security" },
  { id: "rights", title: "Your Rights" },
  { id: "contact", title: "Contact Us" },
]

export default function PrivacyPage() {
  const year = new Date().getFullYear()
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-purple-50">
        <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-3 text-gray-600">Last updated: {year}</p>
        </div>
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-sky-100 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-purple-100 blur-3xl" />
      </section>

      {/* Content */}
      <section className="px-4 py-12 md:px-6">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[220px,1fr]">
          {/* TOC */}
          <aside className="md:sticky md:top-24 h-fit rounded-xl border bg-white/60 backdrop-blur p-4">
            <div className="text-xs font-semibold text-gray-500 mb-2">ON THIS PAGE</div>
            <nav className="space-y-2">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="block text-sm text-gray-700 hover:text-sky-700">
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Body */}
          <article className="prose prose-slate max-w-none">
            <h2 id="intro">Overview</h2>
            <p>
              We value your privacy. This policy explains what data we collect, why we collect it,
              and how we handle it. By using our site or services, you agree to this policy.
            </p>

            <h2 id="collect">Information We Collect</h2>
            <ul>
              <li>Account details such as name and email you provide to us</li>
              <li>Usage information and analytics to improve our products</li>
              <li>Payment and billing data handled by trusted processors</li>
            </ul>

            <h2 id="use">How We Use Information</h2>
            <ul>
              <li>To provide and improve our courses and LMS features</li>
              <li>To communicate important updates and support messages</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h2 id="security">Data Retention & Security</h2>
            <p>
              We retain personal data only as long as necessary for the purposes outlined here. We use
              administrative, technical, and physical safeguards to protect your information.
            </p>

            <h2 id="rights">Your Rights</h2>
            <p>
              You may access, update, or request deletion of your information by contacting us at
              <a href="mailto:support@aiskool.com"> support@aiskool.com</a>.
            </p>

            <h2 id="contact">Contact Us</h2>
            <p>
              If you have any questions about this policy, please email
              <a href="mailto:support@aiskool.com"> support@aiskool.com</a>.
            </p>
            <p>
              You can also reach our team on the <a href="/contact">Contact</a> page.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}
