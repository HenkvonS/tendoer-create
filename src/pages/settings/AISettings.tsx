import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Wand2 } from "lucide-react"

interface AIPrompt {
  id: string
  field_name: string
  prompt_text: string
  description: string
}

export default function AISettings() {
  const { toast } = useToast()
  const [prompts, setPrompts] = useState<AIPrompt[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPrompts()
  }, [])

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from("ai_prompts")
        .select("*")
        .order("field_name")

      if (error) throw error

      setPrompts(data || [])
    } catch (error) {
      console.error("Error fetching prompts:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load AI prompts.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updatePrompt = async (id: string, promptText: string) => {
    try {
      const { error } = await supabase
        .from("ai_prompts")
        .update({ prompt_text: promptText })
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Prompt updated successfully.",
      })

      // Update local state
      setPrompts(prompts.map(p => 
        p.id === id ? { ...p, prompt_text: promptText } : p
      ))
    } catch (error) {
      console.error("Error updating prompt:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update prompt.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Settings</h1>
        <p className="text-muted-foreground">
          Manage AI prompts used in tender creation.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin">
            <Wand2 className="h-8 w-8 text-primary/50" />
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {prompts.map((prompt) => (
            <Card key={prompt.id}>
              <CardHeader>
                <CardTitle className="capitalize">
                  {prompt.field_name.replace(/_/g, " ")}
                </CardTitle>
                <CardDescription>{prompt.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Prompt Template</Label>
                  <Textarea
                    defaultValue={prompt.prompt_text}
                    onBlur={(e) => updatePrompt(prompt.id, e.target.value)}
                    rows={4}
                    placeholder="Enter prompt template..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Use {"{context}"} as a placeholder for the tender title or other context.
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}