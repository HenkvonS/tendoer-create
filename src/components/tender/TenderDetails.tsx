import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { MarkdownEditor } from "@/components/ui/markdown-editor"
import { AIButton } from "./AIButton"
import { Control } from "react-hook-form"
import { z } from "zod"
import { tenderFormSchema } from "@/lib/validations/tender"

type TenderDetailsProps = {
  control: Control<z.infer<typeof tenderFormSchema>>
}

export function TenderDetails({ control }: TenderDetailsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Tender Details</h3>
      <FormField
        control={control}
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
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
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
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
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