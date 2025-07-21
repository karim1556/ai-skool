import Link from "next/link"
import { BookOpen } from "lucide-react"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <BookOpen className="h-6 w-6" />
      <span className="font-semibold">Skool</span>
    </Link>
  )
} 