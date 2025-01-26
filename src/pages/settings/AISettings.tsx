import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MarkdownEditor } from "@/components/ui/markdown-editor"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MessageSquare, Settings, Terminal } from "lucide-react"

interface AIPrompt {
  id: string
  field_name: string
  prompt_text: string
  description: string
  created_at: string
  updated_at: string
}

export default function AISettings() {
  const { toast } = useToast()
  const [prompts, setPrompts] = useState<AIPrompt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null)

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

      setPrompts(prompts.map(p => 
        p.id === id ? { ...p, prompt_text: promptText } : p
      ))
      setEditingPrompt(null)
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Settings</h1>
          <p className="text-muted-foreground">
            Manage AI prompts used in tender creation
          </p>
        </div>
        <Settings className="h-8 w-8 text-muted-foreground" />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin">
            <Terminal className="h-8 w-8 text-primary/50" />
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                AI Prompts
              </CardTitle>
              <CardDescription>
                Configure the prompts used to generate tender content using AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Prompt Template</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prompts.map((prompt) => (
                    <TableRow key={prompt.id}>
                      <TableCell className="font-medium capitalize">
                        {prompt.field_name.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell>{prompt.description}</TableCell>
                      <TableCell>
                        {editingPrompt === prompt.id ? (
                          <MarkdownEditor
                            value={prompt.prompt_text}
                            onChange={(e) => {
                              const newPrompts = [...prompts]
                              const index = newPrompts.findIndex(p => p.id === prompt.id)
                              newPrompts[index] = { ...prompt, prompt_text: e.target.value }
                              setPrompts(newPrompts)
                            }}
                            className="min-h-[100px]"
                          />
                        ) : (
                          <div className="whitespace-pre-wrap">{prompt.prompt_text}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingPrompt === prompt.id ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updatePrompt(prompt.id, prompt.prompt_text)}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingPrompt(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingPrompt(prompt.id)}
                          >
                            Edit
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}