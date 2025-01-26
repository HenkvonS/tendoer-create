import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MarkdownEditor } from "@/components/ui/markdown-editor"
import { useToast } from "@/hooks/use-toast"
import { Wand2, Loader2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

interface AITextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function AITextEditor({ value, onChange, placeholder, className }: AITextEditorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleAIGenerate = async () => {
    setIsGenerating(true)
    try {
      const { data, error } = await supabase.functions.invoke('generate-text', {
        body: { prompt: value },
      })

      if (error) throw error

      if (data?.generatedText) {
        onChange(data.generatedText)
        toast({
          title: "Content Generated",
          description: "AI-generated content has been added to the editor.",
        })
      }
    } catch (error) {
      console.error('Error generating content:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate content. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="relative">
      <div className="absolute right-2 top-2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={handleAIGenerate}
          disabled={isGenerating}
          className="h-8 w-8"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      <MarkdownEditor
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
    </div>
  )
}