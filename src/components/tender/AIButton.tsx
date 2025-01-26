import { Button } from "@/components/ui/button"
import { Wand2 } from "lucide-react"
import { AIPromptEditor } from "@/components/tender/AIPromptEditor"

type AIButtonProps = {
  field: string
  onGenerate?: () => void
  disabled?: boolean
}

export function AIButton({ field, onGenerate, disabled }: AIButtonProps) {
  return (
    <div className="flex items-center">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={disabled}
        onClick={onGenerate}
      >
        <Wand2 className="h-4 w-4" />
      </Button>
      <AIPromptEditor
        fieldName={field}
        currentPrompt=""
        onPromptUpdate={() => {}}
      />
    </div>
  )
}