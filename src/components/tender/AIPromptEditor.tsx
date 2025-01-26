import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MarkdownEditor } from "@/components/ui/markdown-editor"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Settings2 } from "lucide-react"

interface AIPromptEditorProps {
  fieldName: string
  currentPrompt: string
  onPromptUpdate: () => void
}

export function AIPromptEditor({ fieldName, currentPrompt, onPromptUpdate }: AIPromptEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [promptText, setPromptText] = useState(currentPrompt)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("ai_prompts")
        .update({ prompt_text: promptText })
        .eq("field_name", fieldName)

      if (error) throw error

      toast({
        title: "Success",
        description: "AI prompt updated successfully",
      })
      onPromptUpdate()
      setIsOpen(false)
    } catch (error) {
      console.error("Error updating prompt:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update prompt",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 ml-2"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Edit AI Prompt for {fieldName.replace(/_/g, " ")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <MarkdownEditor
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            className="min-h-[200px]"
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}