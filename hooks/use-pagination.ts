"use client"

import { useState, useMemo } from "react"

export function usePagination<T>(data: T[], initialPageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const totalPages = Math.ceil(data.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize

  const paginatedData = useMemo(() => {
    return data.slice(startIndex, endIndex)
  }, [data, startIndex, endIndex])

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const startItem = startIndex + 1
  const endItem = Math.min(endIndex, data.length)
  const totalItems = data.length

  return {
    currentPage,
    pageSize,
    setPageSize: (size: number) => {
      setPageSize(size)
      setCurrentPage(1)
    },
    paginatedData,
    totalPages,
    startItem,
    endItem,
    totalItems,
    goToPage,
    nextPage,
    prevPage,
  }
}
