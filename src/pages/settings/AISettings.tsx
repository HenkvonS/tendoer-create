import { useState } from "react"
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
import { MessageSquare, Settings, Terminal, FileText, Wand2, Save, X } from "lucide-react"
import { useAIPrompts } from "@/hooks/use-ai-prompts"

const TENDER_FIELDS = [
  'description',
  'objective',
  'scope_of_work',
  'eligibility_criteria'
] as const;

export default function AISettings() {
  const { prompts, isLoading, refetchPrompts } = useAIPrompts(TENDER_FIELDS)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editedPrompt, setEditedPrompt] = useState("")
  const { toast } = useToast()

  const handleEdit = (fieldName: string, promptText: string) => {
    setEditingField(fieldName)
    setEditedPrompt(promptText)
  }

  const handleSave = async (fieldName: string) => {
    try {
      const { error } = await supabase
        .from("ai_prompts")
        .update({ prompt_text: editedPrompt })
        .eq("field_name", fieldName)

      if (error) throw error

      toast({
        title: "Success",
        description: "Prompt updated successfully.",
      })

      refetchPrompts()
      setEditingField(null)
    } catch (error) {
      console.error("Error updating prompt:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update prompt.",
      })
    }
  }

  const handleCancel = () => {
    setEditingField(null)
    setEditedPrompt("")
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
                    <TableHead>Prompt Template</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {TENDER_FIELDS.map((fieldName) => (
                    <TableRow key={fieldName}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getFieldIcon(fieldName)}
                          <span className="capitalize">
                            {fieldName.replace(/_/g, " ")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {editingField === fieldName ? (
                          <MarkdownEditor
                            value={editedPrompt}
                            onChange={(e) => setEditedPrompt(e.target.value)}
                            className="min-h-[100px]"
                          />
                        ) : (
                          <div className="whitespace-pre-wrap">
                            {prompts[fieldName] || 'No prompt configured'}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingField === fieldName ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSave(fieldName)}
                              className="h-8"
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancel}
                              className="h-8"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(fieldName, prompts[fieldName] || '')}
                            className="h-8"
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