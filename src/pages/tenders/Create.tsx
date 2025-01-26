import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useTenderAI } from "@/hooks/use-tender-ai"
import { useAIPrompts } from "@/hooks/use-ai-prompts"
import { supabase } from "@/integrations/supabase/client"
import { AIPromptEditor } from "@/components/tender/AIPromptEditor"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MarkdownEditor } from "@/components/ui/markdown-editor"
import { Switch } from "@/components/ui/switch"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ArrowLeft, FileText, Wand2 } from "lucide-react"
import { useState } from "react"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  budget: z.string().optional(),
  deadline: z.string().optional(),
  reference_number: z.string().optional(),
  contact_person: z.string().optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  category: z.string().optional(),
  objective: z.string().optional(),
  scope_of_work: z.string().optional(),
  eligibility_criteria: z.string().optional(),
  contract_duration: z.string().optional(),
  submission_format: z.string().optional(),
  questions_deadline: z.string().optional(),
  site_visit_required: z.boolean().default(false),
  site_visit_date: z.string().optional(),
  site_visit_location: z.string().optional(),
  tender_opening_date: z.string().optional(),
  tender_opening_type: z.string().optional(),
  approval_authority: z.string().optional(),
  is_public: z.boolean().default(true),
})

const TENDER_AI_FIELDS = [
  'description',
  'objective',
  'scope_of_work',
  'eligibility_criteria'
] as const;

const CreateTender = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { generateContent, isGenerating } = useTenderAI()
  const { prompts, isLoading: isLoadingPrompts, refetchPrompts } = useAIPrompts(TENDER_AI_FIELDS)
  const [previewStates, setPreviewStates] = useState({
    description: false,
    objective: false,
    scope_of_work: false,
    eligibility_criteria: false,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase.from("tenders").insert({
        title: values.title,
        description: values.description,
        budget: values.budget ? parseFloat(values.budget) : null,
        deadline: values.deadline ? new Date(values.deadline).toISOString() : null,
        organization_id: '00000000-0000-0000-0000-000000000000', // Default organization ID for guest users
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
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Tender created successfully",
      })

      navigate("/")
    } catch (error) {
      console.error("Error creating tender:", error)
      toast({
        title: "Error",
        description: "Failed to create tender. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAIGenerate = async (field: string) => {
    const title = form.getValues('title');
    if (!title) {
      toast({
        title: "Title Required",
        description: "Please enter a tender title first to generate relevant content.",
        variant: "destructive",
      });
      return;
    }

    const content = await generateContent(field, title);
    if (content) {
      form.setValue(field as any, content, { shouldValidate: true });
      toast({
        title: "Content Generated",
        description: `AI-generated content for ${field} has been added.`,
      });
    }
  };

  const togglePreview = (field: keyof typeof previewStates) => {
    setPreviewStates(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const AIButton = ({ field }: { field: string }) => (
    <div className="flex items-center">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={isGenerating}
        onClick={() => handleAIGenerate(field)}
      >
        <Wand2 className="h-4 w-4" />
      </Button>
      <AIPromptEditor
        fieldName={field}
        currentPrompt={prompts[field] || ""}
        onPromptUpdate={refetchPrompts}
      />
    </div>
  );

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
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter tender title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        Description
                        <AIButton field="description" />
                      </FormLabel>
                      <FormControl>
                        <MarkdownEditor 
                          placeholder="Enter tender description"
                          preview={previewStates.description}
                          onPreviewChange={() => togglePreview('description')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contact Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="contact_person"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Person</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter contact person name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter contact email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Tender Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tender Details</h3>
                <FormField
                  control={form.control}
                  name="objective"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        Objective
                        <AIButton field="objective" />
                      </FormLabel>
                      <FormControl>
                        <MarkdownEditor 
                          placeholder="Enter tender objective"
                          preview={previewStates.objective}
                          onPreviewChange={() => togglePreview('objective')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scope_of_work"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        Scope of Work
                        <AIButton field="scope_of_work" />
                      </FormLabel>
                      <FormControl>
                        <MarkdownEditor 
                          placeholder="Enter scope of work"
                          preview={previewStates.scope_of_work}
                          onPreviewChange={() => togglePreview('scope_of_work')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eligibility_criteria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        Eligibility Criteria
                        <AIButton field="eligibility_criteria" />
                      </FormLabel>
                      <FormControl>
                        <MarkdownEditor 
                          placeholder="Enter eligibility criteria"
                          preview={previewStates.eligibility_criteria}
                          onPreviewChange={() => togglePreview('eligibility_criteria')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Dates & Deadlines */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dates & Deadlines</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Submission Deadline</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="questions_deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Questions Deadline</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Site Visit */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Site Visit</h3>
                <FormField
                  control={form.control}
                  name="site_visit_required"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Site Visit Required</FormLabel>
                        <FormDescription>
                          Toggle if a site visit is required for this tender
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("site_visit_required") && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="site_visit_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Visit Date</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="site_visit_location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Visit Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter site visit location" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Tender Opening */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tender Opening</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="tender_opening_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opening Date</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tender_opening_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opening Type</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter opening type" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Visibility */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Visibility Settings</h3>
                <FormField
                  control={form.control}
                  name="is_public"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Public Tender</FormLabel>
                        <FormDescription>
                          Make this tender visible to all users
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

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
