import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Settings() {
  const { toast } = useToast()
  const [organizationName, setOrganizationName] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      const { data, error } = await supabase
        .from("profiles")
        .insert([{ organization_name: organizationName }])
        .select()

      if (error) throw error

      toast({
        title: "Success",
        description: "Organization created successfully.",
      })
      
      // Clear the form after successful creation
      setOrganizationName("")
    } catch (error) {
      console.error("Error saving organization:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create organization.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Create your organization.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization Settings</CardTitle>
          <CardDescription>
            Enter your organization information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization Name</Label>
            <Input
              id="organizationName"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="Enter your organization name"
            />
          </div>
          <Button onClick={handleSave} disabled={isSaving || !organizationName.trim()}>
            {isSaving ? "Creating..." : "Create Organization"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}