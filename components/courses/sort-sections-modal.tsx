"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GripVertical } from "lucide-react"

interface SortSectionsModalProps {
  isOpen: boolean
  onClose: () => void
  sections: string[]
  onUpdateSorting: (sections: string[]) => void
}

export function SortSectionsModal({ isOpen, onClose, sections, onUpdateSorting }: SortSectionsModalProps) {
  const [sortedSections, setSortedSections] = useState([...sections])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedIndex === null) return

    const newSections = [...sortedSections]
    const draggedSection = newSections[draggedIndex]

    // Remove the dragged item
    newSections.splice(draggedIndex, 1)

    // Insert at new position
    newSections.splice(dropIndex, 0, draggedSection)

    setSortedSections(newSections)
    setDraggedIndex(null)
  }

  const handleUpdateSorting = () => {
    onUpdateSorting(sortedSections)
    onClose()
  }

  const handleClose = () => {
    setSortedSections([...sections])
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Sort sections</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">List of sections</h3>
            <Button onClick={handleUpdateSorting} className="bg-blue-600 hover:bg-blue-700">
              Update sorting
            </Button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2 max-h-96 overflow-y-auto">
            {sortedSections.map((section, index) => (
              <div
                key={`${section}-${index}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`
                  flex items-center gap-3 p-3 bg-white rounded border cursor-move hover:bg-gray-50 transition-colors
                  ${draggedIndex === index ? "opacity-50" : ""}
                `}
              >
                <GripVertical className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{section}</span>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-600">💡 Drag and drop sections to reorder them</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
