import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from "react-hook-form"
import { z } from "zod"
import { tenderFormSchema } from "@/lib/validations/tender"

type TenderOpeningProps = {
  control: Control<z.infer<typeof tenderFormSchema>>
}

export function TenderOpening({ control }: TenderOpeningProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Tender Opening</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={control}
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
          control={control}
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
  )
}