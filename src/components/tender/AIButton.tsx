import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wand2, Loader2 } from "lucide-react"
import { AIPromptEditor } from "@/components/tender/AIPromptEditor"
import { useTenderAI } from "@/hooks/use-tender-ai"
import { useAIPrompts } from "@/hooks/use-ai-prompts"

type AIButtonProps = {
  field: string
  onGenerate?: (content: string) => void
  context?: any
  disabled?: boolean
}

export function AIButton({ field, onGenerate, context, disabled }: AIButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { generateContent, isGenerating } = useTenderAI()
  const { prompts, isLoading: isLoadingPrompts, refetchPrompts } = useAIPrompts([field])

  const handleGenerate = async () => {
    const generatedContent = await generateContent(field, context)
    if (generatedContent && onGenerate) {
      onGenerate(generatedContent)
    }
  }

  return (
    <div className="flex items-center">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={disabled || isGenerating}
        onClick={handleGenerate}
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="h-4 w-4" />
        )}
      </Button>
      <AIPromptEditor
        fieldName={field}
        currentPrompt={prompts[field] || ""}
        onPromptUpdate={refetchPrompts}
      />
    </div>
  )
}