"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface AddAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (assignmentData: any) => void
  sections: { id: number; title: string }[]
}

const assignmentCriteria = ["Creativity", "Technical Skills", "Problem Solving", "Code Quality", "Documentation"]

export function AddAssignmentModal({ isOpen, onClose, onAdd, sections }: AddAssignmentModalProps) {
  const [assignmentData, setAssignmentData] = useState({
    title: "",
    section_id: "",
    question: "",
    file: null as File | null,
    criteria: [] as string[],
  })

  const handleSubmit = () => {
    if (assignmentData.title && assignmentData.section_id && assignmentData.question) {
      onAdd({
        ...assignmentData,
        id: Date.now(),
      })
      handleClose()
    }
  }

  const handleClose = () => {
    setAssignmentData({
      title: "",
      section_id: "",
      question: "",
      file: null,
      criteria: [],
    })
    onClose()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setAssignmentData({ ...assignmentData, file })
  }

  const handleCriteriaChange = (criterion: string) => {
    const newCriteria = assignmentData.criteria.includes(criterion)
      ? assignmentData.criteria.filter((c) => c !== criterion)
      : [...assignmentData.criteria, criterion]
    setAssignmentData({ ...assignmentData, criteria: newCriteria })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add new assignment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="assignment-title">Assignment title</Label>
            <Input
              id="assignment-title"
              value={assignmentData.title}
              onChange={(e) => setAssignmentData({ ...assignmentData, title: e.target.value })}
              placeholder="Enter assignment title"
            />
          </div>

          <div>
            <Label htmlFor="section">Section</Label>
            <Select
              value={assignmentData.section_id}
              onValueChange={(value) => setAssignmentData({ ...assignmentData, section_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section.id} value={String(section.id)}>
                    {section.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="question">Assignment Question</Label>
            <Textarea
              id="question"
              value={assignmentData.question}
              onChange={(e) => setAssignmentData({ ...assignmentData, question: e.target.value })}
              placeholder="Enter assignment question"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="file">Assignment Sheet</Label>
            <p className="text-sm text-gray-600 mb-2">
              Upload Assignment sheet here
              <br />
              Allowed file type :- 'doc', 'docx', 'pdf', 'txt', 'png', 'jpg', 'jpeg','csv'
            </p>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept=".doc,.docx,.pdf,.txt,.png,.jpg,.jpeg,.csv"
            />
          </div>

          <div>
            <Label>Assignment Criteria ( Select upto 5 criteria )</Label>
            <div className="mt-2 space-y-2">
              {assignmentCriteria.map((criterion) => (
                <div key={criterion} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={criterion}
                    checked={assignmentData.criteria.includes(criterion)}
                    onChange={() => handleCriteriaChange(criterion)}
                    disabled={assignmentData.criteria.length >= 5 && !assignmentData.criteria.includes(criterion)}
                  />
                  <Label htmlFor={criterion}>{criterion}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
