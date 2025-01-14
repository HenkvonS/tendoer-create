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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
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
      <div className="container max-w-3xl px-3 py-4 mx-auto sm:px-4 md:py-6">
        <Card className="w-full shadow-none border-0">
          <CardHeader className="space-y-3 pb-4 sm:pb-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <CardTitle className="text-2xl sm:text-3xl font-bold">{t("Create New Tender")}</CardTitle>
            </div>
            <CardDescription className="text-base sm:text-lg">
              {t("Create a new tender for your organization. Fill in the details below or use AI to help generate content.")}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-lg font-medium">{t("Title")}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t("Enter tender title")}
                          className="text-base sm:text-lg py-5 hover:border-primary/50 transition-colors"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-sm sm:text-base">
                        {t("Give your tender a clear and descriptive title")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-lg font-medium">{t("Description")}</FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleGenerateDescription}
                          disabled={isGenerating}
                          className="hover:border-primary/50 transition-colors text-sm"
                          size="sm"
                        >
                          <Wand2 className="mr-1.5 h-3.5 w-3.5" />
                          {isGenerating ? t("Generating...") : t("Generate with AI")}
                        </Button>
                      </div>
                      <FormControl>
                        <Textarea 
                          placeholder={t("Describe the tender requirements and specifications")}
                          className="min-h-[160px] text-base sm:text-lg leading-relaxed hover:border-primary/50 transition-colors resize-y"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-sm sm:text-base">
                        {t("Provide detailed information about the tender or use AI to generate a description")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Coins className="h-4 w-4 text-muted-foreground" />
                          <FormLabel className="text-lg font-medium">{t("Budget")}</FormLabel>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder={t("Enter budget amount")}
                              className="pl-9 text-base sm:text-lg py-5 hover:border-primary/50 transition-colors"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-sm">
                          {t("Optional: Specify the tender budget")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <FormLabel className="text-lg font-medium">{t("Deadline")}</FormLabel>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="datetime-local"
                              className="pl-9 text-base sm:text-lg py-5 hover:border-primary/50 transition-colors"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-sm">
                          {t("Optional: Set a submission deadline")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col space-y-3 pt-4">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full text-base sm:text-lg py-5 font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    {t("Create Tender")}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => navigate(-1)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t("Back")}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTender;