"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Trash2, Plus, Minus } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

// Mock cart data - in real app this would come from context/state management
const initialCartItems = [
  {
    id: 1,
    title: "Kodable Basics",
    provider: "Kodable Education",
    price: 2999,
    originalPrice: 3999,
    image: "/placeholder.svg?height=100&width=150",
    quantity: 1,
  },
  {
    id: 2,
    title: "STEM Fundamentals",
    provider: "Kodable Education",
    price: 5999,
    originalPrice: 7999,
    image: "/placeholder.svg?height=100&width=150",
    quantity: 1,
  },
]

export default function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [email, setEmail] = useState("")

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id)
      return
    }
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const originalTotal = cartItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
  const savings = originalTotal - total

  const handleCheckout = () => {
    // Implement checkout logic
    console.log("Proceeding to checkout with items:", cartItems)
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Breadcrumb */}
      <div className="bg-gray-800 text-white px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm">
            <span className="text-gray-300">Home</span>
            <span className="mx-2">/</span>
            <span>Shopping cart</span>
          </nav>
          <h1 className="text-2xl font-bold mt-2">Shopping cart</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-8">0 Courses in cart</h2>
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600">Total:</span>
                <span className="text-xl font-bold">₹0</span>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg"
                disabled
              >
                Checkout
              </Button>
              <div className="mt-8">
                <Link href="/courses" className="text-blue-600 hover:text-blue-700 font-medium">
                  Continue Shopping →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {cartItems.length} Course{cartItems.length !== 1 ? "s" : ""} in cart
              </h2>

              {cartItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={150}
                        height={100}
                        className="w-24 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.provider}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-bold text-pink-600">₹{item.price}</span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="ml-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{originalTotal}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Savings:</span>
                      <span>-₹{savings}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>₹{total}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>

                  <div className="mt-4 text-center">
                    <Link href="/courses" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      Continue Shopping
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="text-2xl font-black text-white">Kodable</div>
                <div className="text-2xl font-light text-sky-400">Education</div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Kodable Education offers an engaging, affordable and enjoyable curriculum for schools where every child
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
                    KODABLE BASICS
                  </Link>
                </li>
                <li>
                  <Link href="/courses/creator" className="text-gray-300 hover:text-white transition-colors">
                    KODABLE CREATOR
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
            Copyright © Kodable Education 2024. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
