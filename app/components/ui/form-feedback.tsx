"use client"

import { cn } from "../../../lib/utils"

interface FormFeedbackProps {
  variant: "error" | "success"
  message: string
}

export function FormFeedback({ variant, message }: FormFeedbackProps) {
  return (
    <div
      className={`p-4 rounded-md ${
        variant === "error" 
          ? "bg-red-50 text-red-700 border border-red-200" 
          : "bg-green-50 text-green-700 border border-green-200"
      }`}
    >
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
} 