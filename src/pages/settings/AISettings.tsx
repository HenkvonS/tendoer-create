import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
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
import { MessageSquare, Settings, Terminal, FileText, Wand2 } from "lucide-react"

interface AIPrompt {
  id: string
  field_name: string
  prompt_text: string
  description: string
  created_at: string
  updated_at: string
}

const TENDER_FIELDS = [
  'description',
  'objective',
  'scope_of_work',
  'eligibility_criteria'
];

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
        .in('field_name', TENDER_FIELDS)
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

  const getFieldIcon = (fieldName: string) => {
    switch (fieldName) {
      case 'description':
        return <FileText className="h-4 w-4 text-muted-foreground" />
      case 'objective':
        return <MessageSquare className="h-4 w-4 text-muted-foreground" />
      case 'scope_of_work':
        return <Terminal className="h-4 w-4 text-muted-foreground" />
      case 'eligibility_criteria':
        return <Wand2 className="h-4 w-4 text-muted-foreground" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tender AI Settings</h1>
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
                Tender Creation Prompts
              </CardTitle>
              <CardDescription>
                Configure the AI prompts used to generate content when creating new tenders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Field</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Prompt Template</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prompts.map((prompt) => (
                    <TableRow key={prompt.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getFieldIcon(prompt.field_name)}
                          <span className="capitalize">
                            {prompt.field_name.replace(/_/g, " ")}
                          </span>
                        </div>
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