import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { AuthLayout } from "@/components/layout/AuthLayout"
import { Toaster } from "@/components/ui/toaster"

// Public Pages
import HomePage from "@/pages/HomePage"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import ForgotPasswordPage from "@/pages/ForgotPasswordPage"
import NotFoundPage from "@/pages/NotFoundPage"

// Receiver Pages
import ReceiverDashboard from "@/pages/receiver/ReceiverDashboard"
import CreateRequestPage from "@/pages/receiver/CreateRequestPage"
import MyRequestsPage from "@/pages/receiver/MyRequestsPage"
import ReceiverNotificationsPage from "@/pages/receiver/NotificationsPage"
import ReceiverProfilePage from "@/pages/receiver/ProfilePage"

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard"
import PendingRequestsPage from "@/pages/admin/PendingRequestsPage"
import AllRequestsPage from "@/pages/admin/AllRequestsPage"
import AdminInventoryPage from "@/pages/admin/AdminInventoryPage"
import AdminPurchaseOrdersPage from "@/pages/admin/AdminPurchaseOrdersPage"
import AuditLogsPage from "@/pages/admin/AuditLogsPage"
import UsersPage from "@/pages/admin/UsersPage"
import ReportsPage from "@/pages/admin/ReportsPage"
import AdminNotificationsPage from "@/pages/admin/AdminNotificationsPage"
import AdminSettingsPage from "@/pages/admin/SettingsPage"

// Procurement Pages
import ProcurementDashboard from "@/pages/procurement/ProcurementDashboard"
import ProcurementApprovedRequestsPage from "@/pages/procurement/ProcurementApprovedRequestsPage"
import ProcurementInventoryPage from "@/pages/procurement/ProcurementInventoryPage"
import PurchaseOrdersPage from "@/pages/procurement/PurchaseOrdersPage"
import VendorsPage from "@/pages/procurement/VendorsPage"
import ProcurementNotificationsPage from "@/pages/procurement/ProcurementNotificationsPage"
import ProcurementProfilePage from "@/pages/procurement/ProcurementProfilePage"

// Icons
import { LayoutDashboard, PlusCircle, ClipboardList, Bell, User, Clock, Package, ShoppingCart, Activity, Users, Settings, FileText, CheckCircle, Truck } from "lucide-react"

const receiverLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/app/receiver/dashboard" },
  { icon: PlusCircle, label: "Create Request", href: "/app/receiver/create" },
  { icon: ClipboardList, label: "My Requests", href: "/app/receiver/requests" },
  { icon: Bell, label: "Notifications", href: "/app/receiver/notifications" },
  { icon: User, label: "Profile", href: "/app/receiver/profile" },
]

const adminLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/app/admin/dashboard" },
  { icon: Clock, label: "Pending Requests", href: "/app/admin/requests/pending" },
  { icon: ClipboardList, label: "All Requests", href: "/app/admin/requests/all" },
  { icon: Package, label: "Inventory", href: "/app/admin/inventory" },
  { icon: ShoppingCart, label: "Purchase Orders", href: "/app/admin/purchase-orders" },
  { icon: Activity, label: "Audit Logs", href: "/app/admin/audit-logs" },
  { icon: Users, label: "Users", href: "/app/admin/users" },
  { icon: FileText, label: "Reports", href: "/app/admin/reports" },
  { icon: Bell, label: "Notifications", href: "/app/admin/notifications" },
  { icon: Settings, label: "Settings", href: "/app/admin/settings" },
]

const procurementLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/app/procurement/dashboard" },
  { icon: CheckCircle, label: "Approved Requests", href: "/app/procurement/requests" },
  { icon: Package, label: "Inventory", href: "/app/procurement/inventory" },
  { icon: ShoppingCart, label: "Purchase Orders", href: "/app/procurement/purchase-orders" },
  { icon: Truck, label: "Vendors", href: "/app/procurement/vendors" },
  { icon: Bell, label: "Notifications", href: "/app/procurement/notifications" },
  { icon: User, label: "Profile", href: "/app/procurement/profile" },
]

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Receiver Routes */}
          <Route path="/app/receiver" element={<ProtectedRoute roles={["receiver"]}><AuthLayout links={receiverLinks}><Navigate to="/app/receiver/dashboard" replace /></AuthLayout></ProtectedRoute>} />
          <Route path="/app/receiver/dashboard" element={<ProtectedRoute roles={["receiver"]}><AuthLayout links={receiverLinks}><ReceiverDashboard /></AuthLayout></ProtectedRoute>} />
          <Route path="/app/receiver/create" element={<ProtectedRoute roles={["receiver"]}><AuthLayout links={receiverLinks}><CreateRequestPage /></AuthLayout></ProtectedRoute>} />
          <Route path="/app/receiver/requests" element={<ProtectedRoute roles={["receiver"]}><AuthLayout links={receiverLinks}><MyRequestsPage /></AuthLayout></ProtectedRoute>} />
          <Route path="/app/receiver/notifications" element={<ProtectedRoute roles={["receiver"]}><AuthLayout links={receiverLinks}><ReceiverNotificationsPage /></AuthLayout></ProtectedRoute>} />
          <Route path="/app/receiver/profile" element={<ProtectedRoute roles={["receiver"]}><AuthLayout links={receiverLinks}><ReceiverProfilePage /></AuthLayout></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/app/admin" element={<ProtectedRoute roles={["admin"]}><AuthLayout links={adminLinks}><Navigate to="/app/admin/dashboard" replace /></AuthLayout></ProtectedRoute>} />
          <Route path="/app/admin/dashboard" element={<ProtectedRoute roles={["admin"]}><AuthLayout links={adminLinks}><AdminDashboard /></AuthLayout></ProtectedRoute>} />
          <Route path="/app/admin/requests/pending" element={<ProtectedRoute roles={["admin"]}><AuthLayout links={adminLinks}><PendingRequestsPage /></AuthLayout></ProtectedRoute>} />
          <Route path="/app/admin/requests/all" element={<ProtectedRoute roles={["admin"]}><AuthLayout links={adminLinks}><AllRequestsPage /></AuthLayout></ProtectedRoute>} />
          <Route path="/app/admin/inventory" element={<ProtectedRoute roles={["admin"]}><AuthLayout links={adminLinks}><AdminInventoryPage /></AuthLayout></ProtectedRoute>} />
          <Route path="/app/admin/purchase-orders" element={<ProtectedRoute roles={["admin"]}><AuthLayout links={adminLinks}><AdminPurchaseOrdersPage /></AuthLayout></ProtectedRoute>} />
          <Route path="/app/admin/audit-logs" element={<ProtectedRoute roles={["admin"]}><AuthLayout links={adminLinks}><AuditLogsPage /></AuthLayout></ProtectedRoute>} />
          <Route path="/app/admin/users" element={<ProtectedRoute roles={["admin"]}><AuthLayout links={adminLinks}><UsersPage /></AuthLayout></ProtectedRoute>} />
          <Route path="/app/admin/reports" element={<ProtectedRoute roles={["admin"]}><AuthLayout links={adminLinks}><ReportsPage /></AuthLayout></ProtectedRoute>} />
          <Route path="/app/admin/notifications" element={<ProtectedRoute roles={["admin"]}><AuthLayout links={adminLinks}><AdminNotificationsPage /></AuthLayout></ProtectedRoute>} />
          <Route path="/app/admin/settings" element={<ProtectedRoute roles={["admin"]}><AuthLayout links={adminLinks}><AdminSettingsPage /></AuthLayout></ProtectedRoute>} />

          {/* Procurement Routes */}
          <Route path="/app/procurement" element={<ProtectedRoute roles={["procurement"]}><AuthLayout links={procurementLinks}><Navigate to="/app/procurement/dashboard" replace /></AuthLayout></ProtectedRoute>} />
          <Route path="/app/procurement/dashboard" element={<ProtectedRoute roles={["procurement"]}><AuthLayout links={procurementLinks}><ProcurementDashboard /></AuthLayout></ProtectedRoute>} />
          <Route path="/app/procurement/requests" element={<ProtectedRoute roles={["procurement"]}><AuthLayout links={procurementLinks}><ProcurementApprovedRequestsPage /></AuthLayout></ProtectedRoute>} />
          <Route path="/app/procurement/inventory" element={<ProtectedRoute roles={["procurement"]}><AuthLayout links={procurementLinks}><ProcurementInventoryPage /></AuthLayout></ProtectedRoute>} />
          <Route path="/app/procurement/purchase-orders" element={<ProtectedRoute roles={["procurement"]}><AuthLayout links={procurementLinks}><PurchaseOrdersPage /></AuthLayout></ProtectedRoute>} />
          <Route path="/app/procurement/vendors" element={<ProtectedRoute roles={["procurement"]}><AuthLayout links={procurementLinks}><VendorsPage /></AuthLayout></ProtectedRoute>} />
          <Route path="/app/procurement/notifications" element={<ProtectedRoute roles={["procurement"]}><AuthLayout links={procurementLinks}><ProcurementNotificationsPage /></AuthLayout></ProtectedRoute>} />
          <Route path="/app/procurement/profile" element={<ProtectedRoute roles={["procurement"]}><AuthLayout links={procurementLinks}><ProcurementProfilePage /></AuthLayout></ProtectedRoute>} />

          {/* Catch All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
      <Toaster />
    </BrowserRouter>
  )
}
