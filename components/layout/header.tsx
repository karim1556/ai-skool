"use client"

import { Logo } from "@/components/layout/logo"
import { NavLinks } from "@/components/layout/nav-links"
import { UserButton } from "@/components/layout/user-button"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white shadow-sm dark:bg-gray-950">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col gap-4 p-4">
              <NavLinks />
            </div>
          </SheetContent>
        </Sheet>
        <Logo />
      </div>
      <div className="hidden lg:flex items-center gap-4">
        <NavLinks />
      </div>
      <UserButton />
    </header>
  )
} 