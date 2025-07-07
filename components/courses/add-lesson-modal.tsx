"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface AddLessonModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (lessonData: any) => void
  sections: string[]
}

const lessonTypes = [
  { value: "youtube", label: "YouTube Video" },
  { value: "vimeo", label: "Vimeo Video" },
  { value: "video-file", label: "Video file" },
  { value: "video-url", label: "Video url ( .mp4 )" },
  { value: "document", label: "Document" },
  { value: "image", label: "Image file" },
  { value: "iframe", label: "Iframe embed" },
]

export function AddLessonModal({ isOpen, onClose, onAdd, sections }: AddLessonModalProps) {
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState("youtube")
  const [lessonData, setLessonData] = useState({
    title: "",
    section: "",
    url: "",
    file: null as File | null,
    description: "",
    duration: "",
  })

  const handleNext = () => {
    setStep(2)
  }

  const handleSubmit = () => {
    const finalData = {
      ...lessonData,
      type: selectedType,
      id: Date.now(),
    }
    onAdd(finalData)
    handleClose()
  }

  const handleClose = () => {
    setStep(1)
    setSelectedType("youtube")
    setLessonData({
      title: "",
      section: "",
      url: "",
      file: null,
      description: "",
      duration: "",
    })
    onClose()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setLessonData({ ...lessonData, file })
  }

  const renderStepTwo = () => {
    const needsUrl = ["youtube", "vimeo", "video-url", "iframe"].includes(selectedType)
    const needsFile = ["video-file", "document", "image"].includes(selectedType)

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Lesson Title</Label>
          <Input
            id="title"
            value={lessonData.title}
            onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
            placeholder="Enter lesson title"
          />
        </div>

        <div>
          <Label htmlFor="section">Section</Label>
          <Select
            value={lessonData.section}
            onValueChange={(value) => setLessonData({ ...lessonData, section: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {sections.map((section, index) => (
                <SelectItem key={index} value={section}>
                  {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {needsUrl && (
          <div>
            <Label htmlFor="url">
              {selectedType === "youtube"
                ? "YouTube URL"
                : selectedType === "vimeo"
                  ? "Vimeo URL"
                  : selectedType === "video-url"
                    ? "Video URL (.mp4)"
                    : "Embed URL"}
            </Label>
            <Input
              id="url"
              value={lessonData.url}
              onChange={(e) => setLessonData({ ...lessonData, url: e.target.value })}
              placeholder={`Enter ${selectedType} URL`}
            />
          </div>
        )}

        {needsFile && (
          <div>
            <Label htmlFor="file">
              {selectedType === "video-file"
                ? "Video File"
                : selectedType === "document"
                  ? "Document File"
                  : "Image File"}
            </Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept={
                selectedType === "video-file"
                  ? "video/*"
                  : selectedType === "document"
                    ? ".pdf,.doc,.docx,.txt"
                    : selectedType === "image"
                      ? "image/*"
                      : "*"
              }
            />
          </div>
        )}

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={lessonData.description}
            onChange={(e) => setLessonData({ ...lessonData, description: e.target.value })}
            placeholder="Enter lesson description"
          />
        </div>

        <div>
          <Label htmlFor="duration">Duration (Optional)</Label>
          <Input
            id="duration"
            value={lessonData.duration}
            onChange={(e) => setLessonData({ ...lessonData, duration: e.target.value })}
            placeholder="e.g., 10:30"
          />
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add new lesson</DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">Course: A-Tiny</p>
            </div>

            <div>
              <Label>Select lesson type</Label>
              <RadioGroup value={selectedType} onValueChange={setSelectedType} className="mt-2">
                {lessonTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.value} id={type.value} />
                    <Label htmlFor={type.value}>{type.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                Next
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {renderStepTwo()}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                Add Lesson
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
