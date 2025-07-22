"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface AddQuizModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (quizData: any) => void
  sections: { id: number; title: string }[]
}

export function AddQuizModal({ isOpen, onClose, onAdd, sections }: AddQuizModalProps) {
  const [quizData, setQuizData] = useState({
    title: "",
    section_id: "",
    instruction: "",
    maxAttempts: "3",
    timeLimit: "01:00",
  })

  const handleSubmit = () => {
    if (quizData.title && quizData.section_id) {
      onAdd({
        ...quizData,
        id: Date.now(),
      })
      handleClose()
    }
  }

  const handleClose = () => {
    setQuizData({
      title: "",
      section_id: "",
      instruction: "",
      maxAttempts: "3",
      timeLimit: "01:00",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add new quiz</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="quiz-title">Quiz title</Label>
            <Input
              id="quiz-title"
              value={quizData.title}
              onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
              placeholder="Enter quiz title"
            />
          </div>

          <div>
            <Label htmlFor="section">Section</Label>
            <Select
              value={quizData.section_id}
              onValueChange={(value) => setQuizData({ ...quizData, section_id: value })}
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
            <Label htmlFor="instruction">Instruction</Label>
            <Textarea
              id="instruction"
              value={quizData.instruction}
              onChange={(e) => setQuizData({ ...quizData, instruction: e.target.value })}
              placeholder="Enter quiz instructions"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="max-attempts">Max quiz Attempts</Label>
            <Input
              id="max-attempts"
              type="number"
              value={quizData.maxAttempts}
              onChange={(e) => setQuizData({ ...quizData, maxAttempts: e.target.value })}
              min="1"
              max="10"
            />
          </div>

          <div>
            <Label htmlFor="time-limit">Timer value in (mm:ss) format :- press up/down arrow to change time</Label>
            <Input
              id="time-limit"
              value={quizData.timeLimit}
              onChange={(e) => setQuizData({ ...quizData, timeLimit: e.target.value })}
              placeholder="01:00"
            />
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
