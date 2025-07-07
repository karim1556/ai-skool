"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, UserCheck, UserX } from "lucide-react"

interface ActionDropdownProps {
  actions?: Array<{
    label: string
    value: string
    icon?: React.ReactNode
    variant?: "default" | "destructive"
  }>
  onAction?: (action: string) => void
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onApprove?: () => void
  onReject?: () => void
  showApprove?: boolean
}

export function ActionDropdown({
  actions,
  onAction,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  showApprove,
}: ActionDropdownProps) {
  // If actions prop is provided, use it
  if (actions && onAction) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions.map((action) => (
            <DropdownMenuItem
              key={action.value}
              onClick={() => onAction(action.value)}
              className={action.variant === "destructive" ? "text-red-600" : ""}
            >
              {action.icon}
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Fallback to individual handlers
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onView && (
          <DropdownMenuItem onClick={onView}>
            <Eye className="h-4 w-4 mr-2" />
            View
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
        )}
        {showApprove && onApprove && (
          <DropdownMenuItem onClick={onApprove}>
            <UserCheck className="h-4 w-4 mr-2" />
            Approve
          </DropdownMenuItem>
        )}
        {showApprove && onReject && (
          <DropdownMenuItem onClick={onReject}>
            <UserX className="h-4 w-4 mr-2" />
            Reject
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem onClick={onDelete} className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
