"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Filter, Star } from "lucide-react"
import { useState } from "react"

interface FilterProps {
  onFilterChange?: (filters: any) => void
}

export function SidebarFilter({ onFilterChange }: FilterProps) {
  const [selectedCategory, setSelectedCategory] = useState("All category")
  const [selectedPrice, setSelectedPrice] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [selectedLanguage, setSelectedLanguage] = useState("All")
  const [selectedRating, setSelectedRating] = useState("All")

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-lg">Filter</h3>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-gray-900">Categories</h4>
          <div className="space-y-2">
            {[
              "All category",
              "Competency",
              "Professional",
              "Beginner",
              "Intermediate",
              "Advanced",
              "Summer workshop",
            ].map((category) => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Price */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-gray-900">Price</h4>
          <div className="space-y-2">
            {["All", "Free", "Paid"].map((price) => (
              <label key={price} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  value={price}
                  checked={selectedPrice === price}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">{price}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Level */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-gray-900">Level</h4>
          <div className="space-y-2">
            {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
              <label key={level} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="level"
                  value={level}
                  checked={selectedLevel === level}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">{level}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Language */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-gray-900">Language</h4>
          <div className="space-y-2">
            {["All", "English", "Spanish", "French"].map((language) => (
              <label key={language} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  value={language}
                  checked={selectedLanguage === language}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">{language}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Ratings */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-gray-900">Ratings</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                value="All"
                checked={selectedRating === "All"}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">All</span>
            </label>
            {[5, 4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={selectedRating === rating.toString()}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
