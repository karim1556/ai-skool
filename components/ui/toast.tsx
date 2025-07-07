"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  onClose?: () => void
}

export function Toast({ title, description, variant = "default", onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 w-full max-w-sm rounded-lg border p-4 shadow-lg",
        variant === "default" && "bg-white border-gray-200",
        variant === "destructive" && "bg-red-50 border-red-200",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {title && <div className={cn("font-semibold", variant === "destructive" && "text-red-900")}>{title}</div>}
          {description && (
            <div className={cn("text-sm", variant === "destructive" ? "text-red-700" : "text-gray-600")}>
              {description}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className={cn(
            "rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100",
            variant === "destructive" ? "text-red-900" : "text-gray-900",
          )}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const toast = React.useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toastWithId = { ...props, id }
    setToasts((prev) => [...prev, toastWithId])
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return {
    toast,
    dismiss,
    toasts,
  }
}
