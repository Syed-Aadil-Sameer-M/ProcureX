import ProfileCard from "@/components/shared/ProfileCard"
import { mockRequests, mockNotifications } from "@/lib/mockData"

export default function ProfilePage() {
  const pending = mockRequests.filter(r => r.status === "PENDING").length
  const unread = mockNotifications.filter(n => !n.read).length

  return (
    <ProfileCard
      requestCount={mockRequests.length}
      pendingCount={pending}
      notificationCount={unread}
    />
  )
}