import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import DashboardLayout from "../../_components/dashboard-layout"
import AccountSettings from "./_components/settings-page-content"

export default async function Page() {
  const auth = await currentUser()

  if (!auth) redirect("/sign-in")

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  })

  if (!user) redirect("/sign-in")

  return (
    <DashboardLayout title="Account Settings">
      <AccountSettings discordId={user.discordId ?? ""} />
    </DashboardLayout>
  )
}