import ProfileCard from "@/components/shared/ProfileCard"
import { mockPurchaseOrders, mockNotifications } from "@/lib/mockData"

export default function ProcurementProfilePage() {
  const pending = mockPurchaseOrders.filter(p => p.status === "CREATED").length
  const unread = mockNotifications.filter(n => !n.read).length

  return (
    <ProfileCard
      requestCount={mockPurchaseOrders.length}
      pendingCount={pending}
      notificationCount={unread}
    />
  )
}