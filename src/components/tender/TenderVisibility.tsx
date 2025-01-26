import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Control } from "react-hook-form"
import { z } from "zod"
import { tenderFormSchema } from "@/lib/validations/tender"

type TenderVisibilityProps = {
  control: Control<z.infer<typeof tenderFormSchema>>
}

export function TenderVisibility({ control }: TenderVisibilityProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Visibility Settings</h3>
      <FormField
        control={control}
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
  )
}