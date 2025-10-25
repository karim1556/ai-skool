"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GripVertical } from "lucide-react"

// Define the Section type to match the parent component's structure
interface Section {
  id: string;
  title: string;
  order: number;
}

interface SortSectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: Section[];
  onSort: (sections: Section[]) => void;
}

export function SortSectionsModal({ isOpen, onClose, sections, onSort }: SortSectionsModalProps) {
  const [sortedSections, setSortedSections] = useState(() => sections.map(s => ({ ...s, order: (s as any).order ?? 0 })) )
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

  const handleSaveSorting = () => {
    // Use numeric positions provided by the user (order property). If identical, fallback to current index.
    const byPosition = [...sortedSections].sort((a, b) => {
      const pa = Number((a as any).order ?? 0)
      const pb = Number((b as any).order ?? 0)
      if (pa === pb) return 0
      return pa - pb
    })

    // Normalize into 0-based ordered list and pass to parent
    onSort(byPosition.map((section, index) => ({ ...section, order: index })));
    onClose();
  };

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
            <Button onClick={handleSaveSorting} className="bg-blue-600 hover:bg-blue-700">
              Save Sorting
            </Button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2 max-h-96 overflow-y-auto">
            {sortedSections.map((section, index) => (
              <div key={section.id} className="flex items-center gap-3 p-3 bg-white rounded border hover:bg-gray-50 transition-colors">
                <GripVertical className="h-4 w-4 text-gray-400" />
                <div className="flex-1">
                  <div className="font-medium">{section.title}</div>
                  <div className="text-xs text-gray-500">Current position: {(section as any).order ?? index}</div>
                </div>
                <div className="w-28">
                  <label className="text-xs text-gray-600">Position</label>
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full border rounded px-2 py-1 text-sm"
                    value={(section as any).order ?? index}
                    onChange={(e) => {
                      const v = Number(e.target.value)
                      setSortedSections(prev => prev.map((s) => s.id === section.id ? { ...s, order: v } : s))
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-600">💡 Drag and drop sections to reorder them</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
