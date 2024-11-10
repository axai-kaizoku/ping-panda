import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import DashboardLayout from "../../_components/dashboard-layout"
import UpgradePageContent from "./_components/upgrade-page-content"

export default async function Page() {
  const auth = await currentUser()

  if (!auth) redirect("/sign-in")

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  })

  if (!user) redirect("/sign-in")

  return (
    <DashboardLayout title="Pro Membership">
      <UpgradePageContent plan={user.plan} />
    </DashboardLayout>
  )
}
