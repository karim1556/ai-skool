"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Filter, MapPin } from "lucide-react"
import { useMemo, useState } from "react"

interface SchoolFilterProps {
  onFilterChange?: (filters: { type: string; location: string; size: string }) => void
  types?: string[]
  locations?: string[]
  sizes?: string[]
}

export function SchoolFilter({ onFilterChange, types, locations, sizes }: SchoolFilterProps) {
  const typeOptions = useMemo(() => ["All types", ...(types?.filter(Boolean) || [
    "Primary School",
    "Secondary School",
    "STEM Academy",
    "Coding Bootcamp",
    "Online School",
  ])], [types])
  const locationOptions = useMemo(() => ["All locations", ...(locations?.filter(Boolean) || [
    "New York",
    "California",
    "Texas",
    "Florida",
    "Online",
  ])], [locations])
  const sizeOptions = useMemo(() => ["All", ...(sizes?.filter(Boolean) || [
    "Small (< 500)",
    "Medium (500-1500)",
    "Large (> 1500)",
  ])], [sizes])

  const [selectedType, setSelectedType] = useState(typeOptions[0])
  const [selectedLocation, setSelectedLocation] = useState(locationOptions[0])
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0])

  const handleFilterChange = (type: string, value: string) => {
    const filters = {
      type: type === "type" ? value : selectedType,
      location: type === "location" ? value : selectedLocation,
      size: type === "size" ? value : selectedSize,
    }

    if (type === "type") setSelectedType(value)
    if (type === "location") setSelectedLocation(value)
    if (type === "size") setSelectedSize(value)

    onFilterChange?.(filters)
  }

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-lg">Filter</h3>
        </div>

        {/* School Type */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-gray-900">School Type</h4>
          <div className="space-y-2">
            {typeOptions.map((type) => (
              <label key={type} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value={type}
                  checked={selectedType === type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Location */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-gray-900 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </h4>
          <div className="space-y-2">
            {locationOptions.map((location) => (
              <label key={location} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="location"
                  value={location}
                  checked={selectedLocation === location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">{location}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* School Size */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-gray-900">School Size</h4>
          <div className="space-y-2">
            {sizeOptions.map((size) => (
              <label key={size} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="size"
                  value={size}
                  checked={selectedSize === size}
                  onChange={(e) => handleFilterChange("size", e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">{size}</span>
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
