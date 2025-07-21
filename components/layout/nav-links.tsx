"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavLinks() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-sm font-medium ${
            pathname === link.href ? "text-primary" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          }`}
          prefetch={false}
        >
          {link.label}
        </Link>
      ))}
    </>
  )
} 