"use client"

import { SchoolFilter } from "@/components/school-filter"
import { Card, CardContent } from "@/components/ui/card"
import { Grid, List, RefreshCw, MapPin, Users, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useState, useMemo } from "react"

const allSchools = [
  {
    id: 1,
    name: "Ai Academy",
    location: "New York",
    type: "Primary School",
    size: "Medium (500-1500)",
    description:
      "Located in the heart of the city, Ai Academy has created a wonderful environment for children to develop and experience childhood. Every stakeholder is a learner and every day is an opportunity to learn and discover.",
    logo: "/placeholder.svg?height=150&width=200",
    students: 850,
    phone: "+1 (555) 123-4567",
    email: "info@Aiacademy.edu",
    address: "123 Skool St, New York, NY 10001",
  },
  {
    id: 2,
    name: "STEM Learning Center",
    location: "California",
    type: "STEM Academy",
    size: "Large (> 1500)",
    description:
      "At STEM Learning Center, we take a personalized approach to Skool. We recognize that every individual is unique, with their own set of skills, experiences, and learning aspirations. That's why we take the time to get to know our students on a personal level, so we can offer tailored guidance and support that meets their specific needs.",
    logo: "/placeholder.svg?height=150&width=200",
    students: 1200,
    phone: "+1 (555) 987-6543",
    email: "contact@stemlearning.edu",
    address: "456 Innovation Ave, San Francisco, CA 94102",
  },
  {
    id: 3,
    name: "Future Coders Institute",
    location: "Texas",
    type: "Coding Bootcamp",
    size: "Small (< 500)",
    description:
      "Future Coders Institute specializes in intensive coding Skool for students of all ages. Our immersive programs prepare students for the digital future with hands-on projects and real-world applications.",
    logo: "/placeholder.svg?height=150&width=200",
    students: 300,
    phone: "+1 (555) 456-7890",
    email: "hello@futurecoders.edu",
    address: "789 Tech Blvd, Austin, TX 73301",
  },
  {
    id: 4,
    name: "Digital Minds Academy",
    location: "Florida",
    type: "Secondary School",
    size: "Medium (500-1500)",
    description:
      "Digital Minds Academy focuses on preparing high school students for careers in technology and digital innovation. Our curriculum combines traditional academics with cutting-edge technology Skool.",
    logo: "/placeholder.svg?height=150&width=200",
    students: 750,
    phone: "+1 (555) 321-0987",
    email: "admissions@digitalminds.edu",
    address: "321 Future Dr, Miami, FL 33101",
  },
]

export default function SchoolsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState({
    type: "All types",
    location: "All locations",
    size: "All",
  })

  const filteredSchools = useMemo(() => {
    return allSchools.filter((school) => {
      if (filters.type !== "All types" && school.type !== filters.type) return false
      if (filters.location !== "All locations" && school.location !== filters.location) return false
      if (filters.size !== "All" && school.size !== filters.size) return false
      return true
    })
  }, [filters])

  const handleLearnMore = (schoolId: number) => {
    // Navigate to school detail page or show more info
    console.log(`Learn more about school ${schoolId}`)
  }

  const handleContact = (school: any) => {
    // Open contact modal or navigate to contact page
    window.open(`mailto:${school.email}`, "_blank")
  }

  const handleRefresh = () => {
    setFilters({
      type: "All types",
      location: "All locations",
      size: "All",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
     

      {/* Breadcrumb */}
      <div className="bg-gray-800 text-white px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm">
            <span className="text-gray-300">Home</span>
            <span className="mx-2">/</span>
            <span className="text-gray-300">Schools</span>
            <span className="mx-2">/</span>
            <span>All category</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-blue-600 font-medium">Showing on this page: {filteredSchools.length}</p>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filter */}
          <div className="lg:col-span-1">
            <SchoolFilter onFilterChange={setFilters} />
          </div>

          {/* Schools Grid */}
          <div className="lg:col-span-3">
            {filteredSchools.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No results found</p>
                <Button onClick={handleRefresh} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
                {filteredSchools.map((school) => (
                  <Card key={school.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className={viewMode === "grid" ? "space-y-4" : "grid grid-cols-1 md:grid-cols-4 gap-6"}>
                        <div
                          className={viewMode === "grid" ? "flex justify-center" : "md:col-span-1 flex justify-center"}
                        >
                          <Image
                            src={school.logo || "/placeholder.svg"}
                            alt={school.name}
                            width={200}
                            height={150}
                            className="w-full max-w-[200px] h-auto object-contain"
                          />
                        </div>
                        <div className={viewMode === "grid" ? "space-y-4" : "md:col-span-3 space-y-4"}>
                          <div>
                            <h3 className="text-xl font-bold text-blue-600 mb-1">{school.name}</h3>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge variant="secondary">{school.type}</Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {school.location}
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {school.students} students
                              </Badge>
                            </div>
                          </div>

                          <p className="text-gray-700 text-sm leading-relaxed">{school.description}</p>

                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{school.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{school.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span>{school.email}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button
                              className="bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700"
                              onClick={() => handleLearnMore(school.id)}
                            >
                              Learn More
                            </Button>
                            <Button variant="outline" onClick={() => handleContact(school)}>
                              Contact
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
