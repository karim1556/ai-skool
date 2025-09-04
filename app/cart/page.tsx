"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Trash2, Plus, Minus, ShoppingCart } from "lucide-react"

// Mock cart data
const initialCartItems = [
  {
    id: 1,
    title: "Introduction to Artificial Intelligence",
    provider: "AI Skool",
    price: 4999,
    originalPrice: 8999,
    image: "/images/skool1.png", // Placeholder image
    quantity: 1,
  },
  {
    id: 2,
    title: "Advanced STEM Concepts",
    provider: "AI Skool",
    price: 7999,
    originalPrice: 12999,
    image: "/images/skool.jpg", // Placeholder image
    quantity: 1,
  },
]

export default function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id)
    } else {
      setCartItems((items) =>
        items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
      )
    }
  }

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const originalTotal = cartItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
  const savings = originalTotal - subtotal

  const handleCheckout = () => {
    console.log("Proceeding to checkout with items:", cartItems)
    // Implement actual checkout logic here (e.g., redirect to payment)
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          <Link href="/courses">
            <Button variant="outline">Keep Shopping</Button>
          </Link>
        </header>

        {cartItems.length === 0 ? (
          <Card className="text-center p-12">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven’t added any courses to your cart yet.</p>
            <Link href="/courses">
              <Button>Explore Courses</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Items ({cartItems.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Separator />
                  {cartItems.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex items-center justify-between py-6">
                        <div className="flex items-center gap-4">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            width={128}
                            height={72}
                            className="rounded-lg object-cover hidden sm:block"
                          />
                          <div className="flex-grow">
                            <h3 className="font-semibold text-gray-800">{item.title}</h3>
                            <p className="text-sm text-gray-500">By {item.provider}</p>
                            <div className="flex items-baseline gap-2 mt-2">
                              <span className="font-bold text-xl text-gray-900">₹{item.price.toLocaleString()}</span>
                              {item.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">₹{item.originalPrice.toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                           <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-10 text-center font-medium">{item.quantity}</span>
                            <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="text-gray-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                      {index < cartItems.length - 1 && <Separator />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8 shadow-md">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Original Price:</span>
                    <span className="font-medium">₹{originalTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span className="text-gray-600">Savings:</span>
                    <span className="font-medium">- ₹{savings.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-baseline font-bold text-lg">
                    <span>Total:</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <Button size="lg" className="w-full font-semibold py-6 text-base" onClick={handleCheckout}>
                    Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      <footer className="bg-gray-100 py-6 mt-12">
          <div className="container mx-auto text-center text-gray-500 text-sm">
              Copyright © AI Skool 2024. All Rights Reserved.
          </div>
      </footer>
    </div>
  )
}
