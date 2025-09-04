"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (sectionTitle: string) => void;
  onEdit: (sectionId: string, newTitle: string) => void;
  sectionToEdit: { id: string; title: string } | null;
}

export function AddSectionModal({ isOpen, onClose, onAdd, onEdit, sectionToEdit }: AddSectionModalProps) {
  const [title, setTitle] = useState("");

  const isEditMode = sectionToEdit !== null;

  useEffect(() => {
    if (isEditMode) {
      setTitle(sectionToEdit.title);
    } else {
      setTitle('');
    }
  }, [sectionToEdit, isOpen]);

  const handleSubmit = () => {
    if (title.trim()) {
      if (isEditMode) {
        onEdit(sectionToEdit.id, title.trim());
      } else {
        onAdd(title.trim());
      }
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit section' : 'Add new section'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Provide a section name"
              className="mt-1"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              {isEditMode ? 'Save Changes' : 'Submit'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
