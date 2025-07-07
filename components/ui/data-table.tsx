"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSearch } from "@/hooks/use-search"
import { usePagination } from "@/hooks/use-pagination"

interface DataTableProps<T> {
  data: T[]
  searchFields: (keyof T)[]
  children: (data: T[]) => React.ReactNode
  title: string
}

export function DataTable<T>({ data, searchFields, children, title }: DataTableProps<T>) {
  const { searchTerm, setSearchTerm, filteredData } = useSearch(data, searchFields)
  const {
    currentPage,
    pageSize,
    setPageSize,
    paginatedData,
    totalPages,
    startItem,
    endItem,
    goToPage,
    nextPage,
    prevPage,
    totalItems,
  } = usePagination(filteredData)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">Show</span>
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm">entries</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Search:</span>
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {children(paginatedData)}

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Showing {startItem} to {endItem} of {totalItems} entries
          {searchTerm && ` (filtered from ${data.length} total entries)`}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1}>
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant="outline"
              size="sm"
              onClick={() => goToPage(page)}
              className={currentPage === page ? "bg-blue-600 text-white" : ""}
            >
              {page}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
