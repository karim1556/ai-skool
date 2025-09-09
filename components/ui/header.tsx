"use client"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Menu, Home, BookOpen, GraduationCap, Info } from "lucide-react"
import { OrganizationSwitcher, UserButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { useState } from "react"
import { useCart } from "@/hooks/use-cart"

export function Header() {
  const { count: cartCount } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 px-4 py-4 md:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="AISkool Home">
          <Image
            src="/images/aiskoollogo.png"
            alt="AISkool"
            width={180}
            height={48}
            priority
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          <NavigationMenu>
            <NavigationMenuList className="space-x-1">
              {/* Home */}
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {/* Learn Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-gray-100">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Learn
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px]">
                    <div className="grid gap-1">
                      <h3 className="font-medium leading-none mb-2 text-gray-900">Learning Options</h3>
                      <Link
                        href="/courses"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                      >
                        <div className="text-sm font-medium leading-none">Courses</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-600">
                          Explore our comprehensive coding and STEM courses
                        </p>
                      </Link>
                      <Link
                        href="/schools"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                      >
                        <div className="text-sm font-medium leading-none">Schools</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-600">
                          Find partner schools and Skoolal institutions
                        </p>
                      </Link>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Programs Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-gray-100">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Programs
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[500px]">
                    <div className="grid gap-1">
                      <h3 className="font-medium leading-none mb-2 text-gray-900">Our Programs</h3>
                      <Link
                        href="/why-Ai"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                      >
                        <div className="text-sm font-medium leading-none">Why Ai</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-600">
                          Discover the benefits of our Skoolal approach
                        </p>
                      </Link>
                      <Link
                        href="/for-parents"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                      >
                        <div className="text-sm font-medium leading-none">For Parents</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-600">
                          Resources and tools for parents to support learning at home
                        </p>
                      </Link>
                      <Link
                        href="/for-educators"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                      >
                        <div className="text-sm font-medium leading-none">For Educators</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-600">
                          Classroom management tools and curriculum resources
                        </p>
                      </Link>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* About */}
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    <Info className="w-4 h-4 mr-2" />
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* Org Switcher + User when signed in */}
          <SignedIn>
            <div className="hidden md:flex items-center gap-3">
              <OrganizationSwitcher />
              <UserButton />
            </div>
          </SignedIn>
          {/* Shopping Cart */}
          <Link href="/cart">
            <Button
              variant="outline"
              size="sm"
              className="relative border-2 border-gray-200 hover:border-gray-300 transition-colors bg-transparent"
            >
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Login/Register - Desktop (only when signed out) */}
          <SignedOut>
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="rounded-full border-2 border-pink-400 px-6 py-2.5 text-sm font-semibold text-pink-500 hover:bg-pink-50 bg-transparent transition-all duration-200 hover:scale-105"
                >
                  LOG IN
                </Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:from-pink-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
                  REGISTER
                </Button>
              </Link>
            </div>
          </SignedOut>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden bg-transparent">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                <Link
                  href="/"
                  className="flex items-center space-x-2 text-lg font-medium hover:text-sky-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </Link>

                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Learn</span>
                  </h3>
                  <div className="pl-7 space-y-2">
                    <Link
                      href="/courses"
                      className="block text-gray-600 hover:text-gray-900 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Courses
                    </Link>
                    <Link
                      href="/schools"
                      className="block text-gray-600 hover:text-gray-900 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Schools
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5" />
                    <span>Programs</span>
                  </h3>
                  <div className="pl-7 space-y-2">
                    <Link
                      href="/why-Ai"
                      className="block text-gray-600 hover:text-gray-900 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Why Ai
                    </Link>
                    <Link
                      href="/for-parents"
                      className="block text-gray-600 hover:text-gray-900 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      For Parents
                    </Link>
                    <Link
                      href="/for-educators"
                      className="block text-gray-600 hover:text-gray-900 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      For Educators
                    </Link>
                  </div>
                </div>

                <Link
                  href="/about"
                  className="flex items-center space-x-2 text-lg font-medium hover:text-sky-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Info className="w-5 h-5" />
                  <span>About</span>
                </Link>

                <div className="pt-6 border-t border-gray-200 space-y-3">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-2 border-pink-400 text-pink-500 hover:bg-pink-50 bg-transparent"
                    >
                      LOG IN
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700">
                      REGISTER
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
