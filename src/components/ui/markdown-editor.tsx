import React from "react"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Eye, Edit } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface MarkdownEditorProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  preview?: boolean
  onPreviewChange?: (preview: boolean) => void
  value: string
}

const MarkdownEditor = React.forwardRef<HTMLTextAreaElement, MarkdownEditorProps>(
  ({ className, preview = false, onPreviewChange, value, ...props }, ref) => {
    const togglePreview = () => {
      if (onPreviewChange) {
        onPreviewChange(!preview)
      }
    }

    return (
      <div className="space-y-2">
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePreview}
            className="h-8"
          >
            {preview ? (
              <>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </>
            )}
          </Button>
        </div>
        {preview ? (
          <div
            className={cn(
              "min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              className
            )}
          >
            <ReactMarkdown className="prose prose-sm dark:prose-invert">
              {value || "No content"}
            </ReactMarkdown>
          </div>
        ) : (
          <Textarea
            ref={ref}
            value={value}
            className={cn("min-h-[150px]", className)}
            {...props}
          />
        )}
      </div>
    )
  }
)
MarkdownEditor.displayName = "MarkdownEditor"

export { MarkdownEditor }