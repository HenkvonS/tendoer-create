import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from "react-hook-form"
import { z } from "zod"
import { tenderFormSchema } from "@/lib/validations/tender"

type TenderDatesProps = {
  control: Control<z.infer<typeof tenderFormSchema>>
}

export function TenderDates({ control }: TenderDatesProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Dates & Deadlines</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={control}
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
          control={control}
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
  )
}