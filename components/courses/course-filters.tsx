"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CourseFiltersProps {
  filters: {
    category: string
    status: string
    instructor: string
    price: string
  }
  onFilterChange: (key: string, value: string) => void
  onApplyFilters: () => void
}

export function CourseFilters({ filters, onFilterChange, onApplyFilters }: CourseFiltersProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">COURSE LIST</h3>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-2">Categories</label>
          <Select value={filters.category} onValueChange={(value) => onFilterChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <Select value={filters.status} onValueChange={(value) => onFilterChange("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Instructor</label>
          <Select value={filters.instructor} onValueChange={(value) => onFilterChange("instructor", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="aiskool-mumbai">Aiskool Mumbai</SelectItem>
              <SelectItem value="john-smith">John Smith</SelectItem>
              <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Price</label>
          <Select value={filters.price} onValueChange={(value) => onFilterChange("price", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={onApplyFilters} className="bg-blue-600 hover:bg-blue-700">
          Filter
        </Button>
      </div>
    </div>
  )
}
