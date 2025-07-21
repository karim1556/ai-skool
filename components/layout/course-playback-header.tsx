"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Book, Star, Users } from "lucide-react"

interface CoursePlaybackHeaderProps {
  courseTitle: string
}

export function CoursePlaybackHeader({ courseTitle }: CoursePlaybackHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6 dark:bg-gray-950">
      <div className="flex items-center gap-4">
        <Link href="/courses" className="flex items-center gap-2 font-semibold" prefetch={false}>
          <Book className="h-6 w-6" />
          <span className="text-lg">{courseTitle}</span>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center gap-4 px-4">
        <div className="flex w-full max-w-sm items-center gap-2">
          <Button variant="ghost" size="icon">
            <Star className="h-5 w-5" />
            <span className="sr-only">Rate this course</span>
          </Button>
          <Progress value={75} className="w-full" />
          <span className="text-sm font-medium">75%</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm">
          Share
        </Button>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          prefetch={false}
        >
          <Users className="h-5 w-5" />
          Leave
        </Link>
      </div>
    </header>
  )
} 