"use client"

import { useState, useMemo } from "react"

export function useSearch<T>(data: T[], searchFields: (keyof T)[]) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredData = useMemo(() => {
    if (!searchTerm) return data

    return data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field]
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchTerm.toLowerCase())
        }
        if (typeof value === "number") {
          return value.toString().includes(searchTerm)
        }
        return false
      }),
    )
  }, [data, searchFields, searchTerm])

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
  }
}
