import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MarkdownEditor } from "@/components/ui/markdown-editor"
import { AIButton } from "./AIButton"
import { Control } from "react-hook-form"
import { z } from "zod"
import { tenderFormSchema } from "@/lib/validations/tender"

type TenderBasicInfoProps = {
  control: Control<z.infer<typeof tenderFormSchema>>
}

export function TenderBasicInfo({ control }: TenderBasicInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Basic Information</h3>
      <FormField
        control={control}
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
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center justify-between">
              Description
              <AIButton 
                field="description" 
                onGenerate={(content) => field.onChange(content)}
                context={control._formValues}
              />
            </FormLabel>
            <FormControl>
              <MarkdownEditor 
                placeholder="Enter tender description"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}