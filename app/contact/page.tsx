import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Contact Us | AiSkool",
  description: "Get in touch with the AiSkool team.",
}

export default function ContactPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-purple-50">
        <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Contact Us</h1>
          <p className="mt-3 text-gray-600">We'd love to hear from you.</p>
        </div>
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-sky-100 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-purple-100 blur-3xl" />
      </section>

      <section className="px-4 py-12 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border bg-white/60 backdrop-blur p-6">
              <h2 className="text-xl font-semibold">Support</h2>
              <p className="mt-2 text-gray-600">Questions about your account or courses?</p>
              <a className="mt-3 inline-block text-sky-600 hover:underline" href="mailto:support@aiskool.com">
                support@aiskool.com
              </a>
            </div>
            <div className="rounded-2xl border bg-white/60 backdrop-blur p-6">
              <h2 className="text-xl font-semibold">Sales</h2>
              <p className="mt-2 text-gray-600">Interested in institutional plans or partnerships?</p>
              <a className="mt-3 inline-block text-sky-600 hover:underline" href="mailto:sales@aiskool.com">
                sales@aiskool.com
              </a>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border bg-white/60 backdrop-blur p-6">
            <h2 className="text-xl font-semibold">Company</h2>
            <p className="mt-2 text-gray-600">AiSkool, Silicon Valley, CA</p>
            <p className="text-gray-600">Mon–Fri, 9:00 AM – 5:00 PM</p>
            <p className="mt-4 text-gray-600">
              See our <Link className="text-sky-600 hover:underline" href="/faq">FAQ</Link> or read our {" "}
              <Link className="text-sky-600 hover:underline" href="/privacy">Privacy Policy</Link> and {" "}
              <Link className="text-sky-600 hover:underline" href="/terms">Terms</Link>.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
