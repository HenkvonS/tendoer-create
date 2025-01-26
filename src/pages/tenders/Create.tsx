import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useTenderAI } from "@/hooks/use-tender-ai"
import { useAIPrompts } from "@/hooks/use-ai-prompts"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ArrowLeft, FileText } from "lucide-react"
import { TenderBasicInfo } from "@/components/tender/TenderBasicInfo"
import { TenderContactInfo } from "@/components/tender/TenderContactInfo"
import { TenderDetails } from "@/components/tender/TenderDetails"
import { TenderDates } from "@/components/tender/TenderDates"
import { TenderSiteVisit } from "@/components/tender/TenderSiteVisit"
import { TenderOpening } from "@/components/tender/TenderOpening"
import { TenderVisibility } from "@/components/tender/TenderVisibility"
import { tenderFormSchema } from "@/lib/validations/tender"
import { z } from "zod"

const CreateTender = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { generateContent, isGenerating } = useTenderAI()
  const { prompts, isLoading: isLoadingPrompts, refetchPrompts } = useAIPrompts([
    'description',
    'objective',
    'scope_of_work',
    'eligibility_criteria'
  ])

  const form = useForm<z.infer<typeof tenderFormSchema>>({
    resolver: zodResolver(tenderFormSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: "",
      deadline: "",
      reference_number: "",
      contact_person: "",
      contact_email: "",
      contact_phone: "",
      category: "",
      objective: "",
      scope_of_work: "",
      eligibility_criteria: "",
      contract_duration: "",
      submission_format: "",
      questions_deadline: "",
      site_visit_required: false,
      site_visit_date: "",
      site_visit_location: "",
      tender_opening_date: "",
      tender_opening_type: "",
      approval_authority: "",
      is_public: true,
    },
  })

  const onSubmit = async (values: z.infer<typeof tenderFormSchema>) => {
    try {
      const { data: tender, error } = await supabase.from("tenders").insert({
        title: values.title,
        description: values.description,
        budget: values.budget ? parseFloat(values.budget) : null,
        deadline: values.deadline ? new Date(values.deadline).toISOString() : null,
        reference_number: values.reference_number,
        contact_person: values.contact_person,
        contact_email: values.contact_email,
        contact_phone: values.contact_phone,
        category: values.category,
        objective: values.objective,
        scope_of_work: values.scope_of_work,
        eligibility_criteria: values.eligibility_criteria,
        contract_duration: values.contract_duration,
        submission_format: values.submission_format,
        questions_deadline: values.questions_deadline ? new Date(values.questions_deadline).toISOString() : null,
        site_visit_required: values.site_visit_required,
        site_visit_date: values.site_visit_date ? new Date(values.site_visit_date).toISOString() : null,
        site_visit_location: values.site_visit_location,
        tender_opening_date: values.tender_opening_date ? new Date(values.tender_opening_date).toISOString() : null,
        tender_opening_type: values.tender_opening_type,
        approval_authority: values.approval_authority,
        is_public: values.is_public,
      }).select().single()

      if (error) throw error

      const generatedContent = await generateContent('description', values)
      
      if (generatedContent) {
        const { error: updateError } = await supabase
          .from("tenders")
          .update({ description: generatedContent })
          .eq("id", tender.id)

        if (updateError) throw updateError
      }

      toast({
        title: "Success",
        description: "Tender created successfully",
      })

      navigate(`/tenders/edit/${tender.id}`)
    } catch (error) {
      console.error("Error creating tender:", error)
      toast({
        title: "Error",
        description: "Failed to create tender. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-[900px] mx-auto">
      <Card className="bg-background/60 shadow-none border-none">
        <CardHeader className="space-y-2 pb-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">{t("Create New Tender")}</CardTitle>
          </div>
          <CardDescription className="text-sm">
            {t("Create a new tender for your organization.")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <TenderBasicInfo control={form.control} />
              <TenderContactInfo control={form.control} />
              <TenderDetails control={form.control} />
              <TenderDates control={form.control} />
              <TenderSiteVisit control={form.control} />
              <TenderOpening control={form.control} />
              <TenderVisibility control={form.control} />

              <div className="flex flex-col space-y-2 pt-2">
                <Button 
                  type="submit" 
                  className="h-9 text-sm font-medium"
                >
                  Create Tender
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  Back
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateTender