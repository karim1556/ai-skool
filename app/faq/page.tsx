import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ | AiSkool",
  description: "Frequently asked questions about AiSkool LMS, courses, and accounts.",
}

export default function FaqPage() {
  const faqs = [
    {
      q: "What is AiSkool LMS?",
      a: "AiSkool is a modern learning platform for schools and individuals to manage courses, students, and content in one place.",
    },
    {
      q: "How do I enroll in a course?",
      a: "Browse courses on the homepage, click Enroll, and follow the steps. If your school uses AiSkool, log in with your school account.",
    },
    {
      q: "Do you offer refunds?",
      a: "Refunds depend on the product and plan. See Terms or contact support@aiskool.com for assistance.",
    },
    {
      q: "Is my data secure?",
      a: "Yes. We follow best practices to safeguard your data. Read more in our Privacy Policy.",
    },
  ]

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Frequently Asked Questions</h1>
          <p className="mt-3 text-gray-600">Answers to common questions about AiSkool.</p>
        </div>
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-100 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-blue-100 blur-3xl" />
      </section>

      <section className="px-4 py-12 md:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border bg-white/60 backdrop-blur divide-y">
            {faqs.map((item, i) => (
              <details key={i} className="group p-6">
                <summary className="cursor-pointer list-none text-lg font-semibold flex items-center justify-between">
                  <span>{item.q}</span>
                  <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
