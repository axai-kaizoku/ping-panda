import { Card } from "@/components/ui/card"
import { NumericFieldSumsType } from "./category-page-content"
import { BarChart } from "lucide-react"

export const NumericFieldsSumCards = ({
  numericFieldSums,
  activeTab,
}: {
  numericFieldSums: NumericFieldSumsType
  activeTab: "today" | "week" | "month"
}) => {
  if (Object.keys(numericFieldSums).length === 0) return null
  return Object.entries(numericFieldSums).map(([field, sums]) => {
    const relevantSum =
      activeTab === "today"
        ? sums.today
        : activeTab === "week"
        ? sums.thisWeek
        : sums.thisMonth

    return (
      <Card key={field} className="border-2 border-brand-700">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <p className="text-sm/6 font-medium">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </p>
          <BarChart className="size-4 text-muted-foreground" />
        </div>

        <div>
          <p className="text-2xl font-bold">{relevantSum.toFixed(2)}</p>
          <p className="text-xs/5 text-muted-foreground">
            Events{" "}
            {activeTab === "today"
              ? "today"
              : activeTab === "week"
              ? "this week"
              : "this month"}
          </p>
        </div>
      </Card>
    )
  })
}
