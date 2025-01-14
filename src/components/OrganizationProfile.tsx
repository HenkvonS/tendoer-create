import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

const OrganizationProfile = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [organizationName, setOrganizationName] = useState("")

  // Fetch profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')
      
      const { data, error } = await supabase
        .from('profiles')
        .select('organization_name')
        .eq('id', user.id)
        .single()
      
      if (error) throw error
      setOrganizationName(data.organization_name || '')
      return data
    }
  })

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (newOrgName: string) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('profiles')
        .update({ organization_name: newOrgName })
        .eq('id', user.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast({
        title: "Success",
        description: "Organization name updated successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update organization name",
        variant: "destructive",
      })
      console.error('Error updating profile:', error)
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile.mutate(organizationName)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization Name</Label>
            <Input
              id="organizationName"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="Enter your organization name"
            />
          </div>
          <Button 
            type="submit"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? "Updating..." : "Update Organization"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default OrganizationProfile