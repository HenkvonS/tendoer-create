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
import { useRef, useEffect } from "react"

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
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: "",
      deadline: "",
    },
  })

  const adjustTextareaHeight = () => {
    const textarea = descriptionRef.current
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto'
      // Add extra padding to prevent scrollbar flicker
      textarea.style.height = `${textarea.scrollHeight + 2}px`
    }
  }

  // Watch for description changes and adjust height
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'description') {
        // Use RAF to ensure DOM has updated
        requestAnimationFrame(adjustTextareaHeight)
      }
    })
    return () => subscription.unsubscribe()
  }, [form.watch])

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
      // Use multiple timeouts to ensure proper resizing after content update
      setTimeout(() => {
        adjustTextareaHeight()
        // Double-check the height after a brief delay
        setTimeout(adjustTextareaHeight, 50)
      }, 0)
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
    <div className="max-w-[900px] mx-auto">
      <Card className="bg-background/60 shadow-none border-none">
        <CardHeader className="space-y-2 pb-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">{t("Create New Tender")}</CardTitle>
          </div>
          <CardDescription className="text-sm">
            {t("Create a new tender for your organization. Fill in the details below or use AI to help generate content.")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">{t("Title")}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t("Enter tender title")}
                        className="h-9 text-sm hover:border-primary/50 transition-colors"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
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
                  <FormItem className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-medium">{t("Description")}</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleGenerateDescription}
                        disabled={isGenerating}
                        className="h-7 px-2 text-xs hover:bg-primary/5"
                        size="sm"
                      >
                        <Wand2 className="mr-1 h-3 w-3" />
                        {isGenerating ? t("Generating...") : t("Generate with AI")}
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea 
                        placeholder={t("Describe the tender requirements and specifications")}
                        className="min-h-[40px] text-sm leading-relaxed hover:border-primary/50 transition-colors resize-none overflow-hidden"
                        ref={descriptionRef}
                        onInput={adjustTextareaHeight}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      {t("Provide detailed information about the tender or use AI to generate a description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Coins className="h-3.5 w-3.5 text-muted-foreground" />
                        <FormLabel className="text-sm font-medium">{t("Budget")}</FormLabel>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder={t("Enter budget amount")}
                            className="h-9 pl-8 text-sm hover:border-primary/50 transition-colors"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs">
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
                    <FormItem className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <FormLabel className="text-sm font-medium">{t("Deadline")}</FormLabel>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                          <Input 
                            type="datetime-local"
                            className="h-9 pl-8 text-sm hover:border-primary/50 transition-colors"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs">
                        {t("Optional: Set a submission deadline")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col space-y-2 pt-2">
                <Button 
                  type="submit" 
                  className="h-9 text-sm font-medium"
                >
                  {t("Create Tender")}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  {t("Back")}
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