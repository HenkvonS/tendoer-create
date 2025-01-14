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
import { ArrowLeft, DollarSign, Calendar, Wand2 } from "lucide-react"
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
    <div className="container max-w-3xl py-4 px-4 md:py-8 md:px-0">
      <Button
        variant="ghost"
        className="mb-4 md:mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">{t("Create New Tender")}</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Create a new tender for your organization. Fill in the details below or use AI to help generate content.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Title")}</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tender title" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs md:text-sm">
                      Give your tender a clear and descriptive title
                    </FormDescription>
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
                      {t("Description")}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateDescription}
                        disabled={isGenerating}
                        className="text-xs md:text-sm"
                      >
                        <Wand2 className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                        {isGenerating ? "Generating..." : "Generate with AI"}
                      </Button>
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the tender requirements and specifications"
                        className="min-h-[120px] md:min-h-[160px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-xs md:text-sm">
                      Provide detailed information about the tender or use AI to generate a description
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Budget")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="Enter budget amount"
                            className="pl-10"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs md:text-sm">
                        Optional: Specify the tender budget
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Deadline")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="datetime-local"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs md:text-sm">
                        Optional: Set a submission deadline
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <CardFooter className="px-0 pb-0">
                <Button type="submit" className="w-full">
                  {t("Create Tender")}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateTender