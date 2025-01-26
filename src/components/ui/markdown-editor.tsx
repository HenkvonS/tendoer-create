import React from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

interface MarkdownEditorProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string
}

const MarkdownEditor = React.forwardRef<HTMLTextAreaElement, MarkdownEditorProps>(
  ({ className, value, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Textarea
          ref={ref}
          value={value}
          className={cn("min-h-[150px]", className)}
          {...props}
        />
      </div>
    )
  }
)
MarkdownEditor.displayName = "MarkdownEditor"

export { MarkdownEditor }