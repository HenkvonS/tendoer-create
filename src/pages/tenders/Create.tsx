import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
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
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { ArrowLeft, DollarSign, Calendar, Wand2, FileText, Clock, Coins } from "lucide-react"
import { useTenderAI } from "@/hooks/use-tender-ai"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  budget: z.string().optional(),
  deadline: z.string().optional(),
})

const CreateTender = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { generateDescription, isGenerating } = useTenderAI()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: "",
      deadline: "",
    },
  })

  const handleGenerateDescription = async () => {
    const title = form.getValues("title")
    if (!title) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a title first",
      })
      return
    }

    const description = await generateDescription(title)
    if (description) {
      form.setValue("description", description)
      toast({
        title: "Success",
        description: "AI description generated successfully",
      })
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a tender",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("tenders").insert({
        title: values.title,
        description: values.description || null,
        budget: values.budget ? parseFloat(values.budget) : null,
        deadline: values.deadline ? new Date(values.deadline).toISOString() : null,
        organization_id: user.id,
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl px-4 py-8 mx-auto">
        <Button
          variant="ghost"
          className="mb-8 text-muted-foreground hover:text-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("Back")}
        </Button>

        <Card className="w-full border-2">
          <CardHeader className="space-y-4 pb-8">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <CardTitle className="text-3xl font-bold">{t("Create New Tender")}</CardTitle>
            </div>
            <CardDescription className="text-lg">
              {t("Create a new tender for your organization. Fill in the details below or use AI to help generate content.")}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-xl font-medium">{t("Title")}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t("Enter tender title")}
                          className="text-lg py-6 border-2 hover:border-primary/50 transition-colors"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-base">
                        {t("Give your tender a clear and descriptive title")}
                      </FormDescription>
                      <FormMessage className="text-base" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-xl font-medium">{t("Description")}</FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleGenerateDescription}
                          disabled={isGenerating}
                          className="border-2 hover:border-primary/50 transition-colors"
                        >
                          <Wand2 className="mr-2 h-4 w-4" />
                          {isGenerating ? t("Generating...") : t("Generate with AI")}
                        </Button>
                      </div>
                      <FormControl>
                        <Textarea 
                          placeholder={t("Describe the tender requirements and specifications")}
                          className="min-h-[200px] text-lg leading-relaxed border-2 hover:border-primary/50 transition-colors resize-y"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-base">
                        {t("Provide detailed information about the tender or use AI to generate a description")}
                      </FormDescription>
                      <FormMessage className="text-base" />
                    </FormItem>
                  )}
                />

                <div className="grid gap-8 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Coins className="h-5 w-5 text-muted-foreground" />
                          <FormLabel className="text-xl font-medium">{t("Budget")}</FormLabel>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder={t("Enter budget amount")}
                              className="pl-10 text-lg py-6 border-2 hover:border-primary/50 transition-colors"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-base">
                          {t("Optional: Specify the tender budget")}
                        </FormDescription>
                        <FormMessage className="text-base" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                          <FormLabel className="text-xl font-medium">{t("Deadline")}</FormLabel>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                            <Input 
                              type="datetime-local"
                              className="pl-10 text-lg py-6 border-2 hover:border-primary/50 transition-colors"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-base">
                          {t("Optional: Set a submission deadline")}
                        </FormDescription>
                        <FormMessage className="text-base" />
                      </FormItem>
                    )}
                  />
                </div>

                <CardFooter className="px-0 pb-0 pt-6">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full text-lg py-6 font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    {t("Create Tender")}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CreateTender