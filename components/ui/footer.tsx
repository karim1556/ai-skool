"use client"

import type React from "react"

import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"

export function Footer() {
  const [email, setEmail] = useState("")
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      const update = () => setHidden(document.body.classList.contains('playback-hide-shell'));
      update();
      const mo = new MutationObserver(() => update());
      mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      return () => mo.disconnect();
    } catch (e) {
      return () => {};
    }
  }, []);

  if (hidden) return null;

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <footer className="bg-gray-900 text-white py-16 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl font-black text-white">Ai</div>
              <div className="text-2xl font-light text-sky-400">Skool</div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Ai Skool offers an engaging, affordable and enjoyable curriculum for schools where every child
              develops problem-solving skills and becomes a consumer to creator.
            </p>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-sky-400">USEFUL LINKS</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms and condition
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Featured Courses */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-sky-400">FEATURED COURSES</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/courses/basics" className="text-gray-300 hover:text-white transition-colors">
                  AI BASICS
                </Link>
              </li>
              <li>
                <Link href="/courses/creator" className="text-gray-300 hover:text-white transition-colors">
                  AI CREATOR
                </Link>
              </li>
              <li>
                <Link href="/courses/bug-world" className="text-gray-300 hover:text-white transition-colors">
                  BUG WORLD
                </Link>
              </li>
              <li>
                <Link href="/courses/stem" className="text-gray-300 hover:text-white transition-colors">
                  STEM FUNDAMENTALS
                </Link>
              </li>
              <li>
                <Link href="/courses/robotics" className="text-gray-300 hover:text-white transition-colors">
                  ROBOTICS & AI
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-sky-400">FOLLOW US ON</h4>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Facebook
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Twitter
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  LinkedIn
                </Link>
              </div>

              <div>
                <h5 className="font-semibold mb-3">SUBSCRIBE TO NEWSLETTER</h5>
                <form onSubmit={handleNewsletterSubmit} className="flex">
                  <Input
                    type="email"
                    placeholder="Enter Your Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-r-none bg-white text-gray-900"
                    required
                  />
                  <Button type="submit" className="rounded-l-none bg-blue-600 hover:bg-blue-700">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        <div className="text-center text-gray-400 text-sm">
          Copyright © Ai Skool 2025. All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}
