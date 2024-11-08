import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import DashboardContent from "./_components/dashboard-content"
import CreateEventCategoryModal from "./_components/create-event-category-modal"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import DashboardLayout from "./_components/dashboard-layout"

export default async function Page() {
  const auth = await currentUser()

  if (!auth) {
    redirect("/sign-in")
  }

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  })

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <DashboardLayout
      cta={
        <CreateEventCategoryModal>
          <Button className="w-full sm:w-fit">
            <PlusIcon className="size-4 mr-2" />
            Add Category
          </Button>
        </CreateEventCategoryModal>
      }
      title="Dashboard"
    >
      <DashboardContent />
    </DashboardLayout>
  )
}
