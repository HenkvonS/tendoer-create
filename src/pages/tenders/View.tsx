import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, Calendar, MapPin, User, Mail, Phone, Building2 } from "lucide-react"

const ViewTender = () => {
  const { id } = useParams()

  const { data: tender, isLoading } = useQuery({
    queryKey: ['tender', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error) throw error
      return data
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <FileText className="h-8 w-8 text-primary/50" />
        </div>
      </div>
    )
  }

  if (!tender) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">Tender Not Found</h2>
        <p className="text-muted-foreground">The tender you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{tender.title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created: {new Date(tender.created_at).toLocaleDateString()}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Description</h3>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {tender.description}
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {tender.contact_person && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{tender.contact_person}</span>
                </div>
              )}
              {tender.contact_email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{tender.contact_email}</span>
                </div>
              )}
              {tender.contact_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{tender.contact_phone}</span>
                </div>
              )}
              {tender.category && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{tender.category}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Site Visit Information */}
          {tender.site_visit_required && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Site Visit Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {tender.site_visit_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(tender.site_visit_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {tender.site_visit_location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{tender.site_visit_location}</span>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Additional Details */}
          {tender.objective && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Objective</h3>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {tender.objective}
              </div>
            </div>
          )}

          {tender.scope_of_work && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Scope of Work</h3>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {tender.scope_of_work}
              </div>
            </div>
          )}

          {tender.eligibility_criteria && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Eligibility Criteria</h3>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {tender.eligibility_criteria}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ViewTender