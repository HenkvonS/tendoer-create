import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
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
import { Loader2 } from "lucide-react"

export default function Settings() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [organizationName, setOrganizationName] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          navigate("/login")
          return
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (error) throw error

        setOrganizationName(profile.organization_name || "")
      } catch (error) {
        console.error("Error loading profile:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile settings.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [navigate, toast])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      const { error } = await supabase
        .from("profiles")
        .update({ organization_name: organizationName })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Settings updated successfully.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization Settings</CardTitle>
          <CardDescription>
            Update your organization information and preferences.
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
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}