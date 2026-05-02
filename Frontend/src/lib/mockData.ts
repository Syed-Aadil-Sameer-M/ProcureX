export interface Request {
  id: string
  material: string
  quantity: number
  location: string
  description: string
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED"
  date: string
  requestedBy: string
}

export const mockRequests: Request[] = [
  { id: "REQ-001", material: "4K Dome Cameras", quantity: 12, location: "Sector Alpha", description: "Replacement for damaged units", status: "COMPLETED", date: "2023-10-01", requestedBy: "John Doe" },
  { id: "REQ-002", material: "PTZ Security Camera", quantity: 4, location: "Perimeter B", description: "New installation", status: "APPROVED", date: "2023-10-05", requestedBy: "Jane Smith" },
  { id: "REQ-003", material: "NVR 32-Channel", quantity: 1, location: "Control Room", description: "Storage upgrade", status: "PENDING", date: "2023-10-10", requestedBy: "Bob Builder" },
  { id: "REQ-004", material: "Cat6 Ethernet Cable (1000ft)", quantity: 5, location: "Warehouse", description: "Wiring new sector", status: "APPROVED", date: "2023-10-12", requestedBy: "Alice Cooper" },
  { id: "REQ-005", material: "Motion Sensors", quantity: 20, location: "Level 4", description: "Upgrading legacy sensors", status: "REJECTED", date: "2023-10-15", requestedBy: "Charlie Brown" },
  { id: "REQ-006", material: "27-inch Surveillance Monitor", quantity: 4, location: "Security Desk", description: "Additional screens", status: "PENDING", date: "2023-10-18", requestedBy: "David Clark" },
  { id: "REQ-007", material: "Server Rack Battery Backup", quantity: 2, location: "Server Room", description: "Redundancy", status: "APPROVED", date: "2023-10-20", requestedBy: "Eve Adams" },
  { id: "REQ-008", material: "Biometric Access Reader", quantity: 8, location: "Main Entrances", description: "", status: "COMPLETED", date: "2023-10-22", requestedBy: "Frank White" },
  { id: "REQ-009", material: "Thermal Imaging Camera", quantity: 2, location: "Exterior Gate", description: "Night time visibility", status: "PENDING", date: "2023-10-24", requestedBy: "Grace Lee" },
  { id: "REQ-010", material: "PoE Injectors", quantity: 15, location: "Sector Gamma", description: "", status: "APPROVED", date: "2023-10-25", requestedBy: "Hank Green" },
]

export interface Notification {
  id: string
  message: string
  read: boolean
  timestamp: string
}

export const mockNotifications: Notification[] = [
  { id: "NOT-1", message: "Request REQ-002 has been approved.", read: false, timestamp: "2023-10-28T09:00:00Z" },
  { id: "NOT-2", message: "New inventory alert: Cat6 Ethernet Cable stock is LOW.", read: false, timestamp: "2023-10-28T08:30:00Z" },
  { id: "NOT-3", message: "Request REQ-005 was rejected.", read: false, timestamp: "2023-10-27T15:45:00Z" },
  { id: "NOT-4", message: "Purchase Order PO-101 has been sent to vendor.", read: true, timestamp: "2023-10-26T11:20:00Z" },
  { id: "NOT-5", message: "System maintenance scheduled for weekend.", read: true, timestamp: "2023-10-25T14:00:00Z" },
  { id: "NOT-6", message: "Request REQ-001 has been marked as COMPLETED.", read: true, timestamp: "2023-10-24T10:15:00Z" },
]

export const mockInventory = [
  { id: "INV-1", material: "4K Dome Cameras", quantity: 50, unit: "pcs", stockLevel: "OK", price: 150.0 },
  { id: "INV-2", material: "Cat6 Ethernet Cable", quantity: 2, unit: "rolls", stockLevel: "LOW", price: 120.0 },
  { id: "INV-3", material: "PTZ Security Camera", quantity: 0, unit: "pcs", stockLevel: "CRITICAL", price: 450.0 },
  { id: "INV-4", material: "NVR 32-Channel", quantity: 5, unit: "pcs", stockLevel: "OK", price: 800.0 },
  { id: "INV-5", material: "Motion Sensors", quantity: 15, unit: "pcs", stockLevel: "LOW", price: 35.0 },
  { id: "INV-6", material: "Biometric Access Reader", quantity: 10, unit: "pcs", stockLevel: "OK", price: 250.0 },
  { id: "INV-7", material: "Thermal Imaging Camera", quantity: 1, unit: "pcs", stockLevel: "CRITICAL", price: 1200.0 },
  { id: "INV-8", material: "PoE Injectors", quantity: 40, unit: "pcs", stockLevel: "OK", price: 25.0 },
]

export const mockPurchaseOrders = [
  { id: "PO-101", material: "Cat6 Ethernet Cable", quantity: 10, status: "SENT", vendor: "CableCo", date: "2023-10-26" },
  { id: "PO-102", material: "PTZ Security Camera", quantity: 5, status: "CREATED", vendor: "SecureTech", date: "2023-10-28" },
  { id: "PO-103", material: "Thermal Imaging Camera", quantity: 2, status: "RECEIVED", vendor: "VisionSystems", date: "2023-10-20" },
  { id: "PO-104", material: "Motion Sensors", quantity: 50, status: "COMPLETED", vendor: "SecureTech", date: "2023-10-15" },
]

export const mockVendors = [
  { id: "V-1", name: "SecureTech", contact: "Alice", email: "alice@securetech.com", materials: ["Cameras", "Sensors"] },
  { id: "V-2", name: "CableCo", contact: "Bob", email: "bob@cableco.com", materials: ["Cables", "Connectors"] },
  { id: "V-3", name: "VisionSystems", contact: "Charlie", email: "charlie@visionsystems.com", materials: ["Thermal Cameras", "Monitors"] },
]

export const mockAuditLogs = [
  { id: "LOG-1", user: "Alice Cooper", action: "Approved Request", module: "Requests", description: "Approved REQ-002", timestamp: "2023-10-28T09:00:00Z" },
  { id: "LOG-2", user: "John Doe", action: "Created Request", module: "Requests", description: "Created REQ-012", timestamp: "2023-10-27T10:00:00Z" },
]
