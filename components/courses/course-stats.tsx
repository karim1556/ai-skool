import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Clock, Star, DollarSign } from "lucide-react"

interface CourseStatsProps {
  stats: {
    active: number
    pending: number
    free: number
    paid: number
  }
}

export function CourseStats({ stats }: CourseStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6 text-center">
          <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
          <div className="text-3xl font-bold text-blue-600">{stats.active}</div>
          <div className="text-sm text-gray-600">Active courses</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 text-center">
          <Clock className="h-8 w-8 mx-auto mb-2 text-orange-600" />
          <div className="text-3xl font-bold text-orange-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending courses</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 text-center">
          <Star className="h-8 w-8 mx-auto mb-2 text-green-600" />
          <div className="text-3xl font-bold text-green-600">{stats.free}</div>
          <div className="text-sm text-gray-600">Free courses</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 text-center">
          <DollarSign className="h-8 w-8 mx-auto mb-2 text-purple-600" />
          <div className="text-3xl font-bold text-purple-600">{stats.paid}</div>
          <div className="text-sm text-gray-600">Paid courses</div>
        </CardContent>
      </Card>
    </div>
  )
}
