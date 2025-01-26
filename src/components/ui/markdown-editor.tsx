import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Eye, Edit2 } from "lucide-react"

interface MarkdownEditorProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string
}

const MarkdownEditor = React.forwardRef<HTMLTextAreaElement, MarkdownEditorProps>(
  ({ className, value, ...props }, ref) => {
    const [isPreview, setIsPreview] = useState(false)

    return (
      <div className="space-y-2">
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="h-8"
          >
            {isPreview ? (
              <>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </>
            )}
          </Button>
        </div>
        {isPreview ? (
          <div className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
              {value || ""}
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