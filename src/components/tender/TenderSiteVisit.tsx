import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Control, useWatch } from "react-hook-form"
import { z } from "zod"
import { tenderFormSchema } from "@/lib/validations/tender"

type TenderSiteVisitProps = {
  control: Control<z.infer<typeof tenderFormSchema>>
}

export function TenderSiteVisit({ control }: TenderSiteVisitProps) {
  const siteVisitRequired = useWatch({
    control,
    name: "site_visit_required",
  })

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Site Visit</h3>
      <FormField
        control={control}
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

      {siteVisitRequired && (
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={control}
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
            control={control}
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
  )
}