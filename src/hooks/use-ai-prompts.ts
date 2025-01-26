import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function useAIPrompts(fields: string[]) {
  const [prompts, setPrompts] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from("ai_prompts")
        .select("field_name, prompt_text")
        .in("field_name", fields)

      if (error) throw error

      const promptsMap = Object.fromEntries(
        data.map(({ field_name, prompt_text }) => [field_name, prompt_text])
      )
      setPrompts(promptsMap)
    } catch (error) {
      console.error("Error fetching prompts:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load AI prompts",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPrompts()
  }, [])

  return {
    prompts,
    isLoading,
    refetchPrompts: fetchPrompts,
  }
}