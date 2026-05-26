package com.procurex.dto;

public class StatsResponseDTO {

    private Long totalRequests;
    private Long pendingCount;
    private Long approvedCount;
    private Long rejectedCount;
    private Long completedCount;
    private Long inventoryItems;
    private Long lowStockCount;
    private Long criticalStockCount;
    private Long totalPurchaseOrders;
    private Long totalVendors;
    private Long totalUsers;

    public StatsResponseDTO() {}

    public Long getTotalRequests() { return totalRequests; }
    public void setTotalRequests(Long totalRequests) { this.totalRequests = totalRequests; }

    public Long getPendingCount() { return pendingCount; }
    public void setPendingCount(Long pendingCount) { this.pendingCount = pendingCount; }

    public Long getApprovedCount() { return approvedCount; }
    public void setApprovedCount(Long approvedCount) { this.approvedCount = approvedCount; }

    public Long getRejectedCount() { return rejectedCount; }
    public void setRejectedCount(Long rejectedCount) { this.rejectedCount = rejectedCount; }

    public Long getCompletedCount() { return completedCount; }
    public void setCompletedCount(Long completedCount) { this.completedCount = completedCount; }

    public Long getInventoryItems() { return inventoryItems; }
    public void setInventoryItems(Long inventoryItems) { this.inventoryItems = inventoryItems; }

    public Long getLowStockCount() { return lowStockCount; }
    public void setLowStockCount(Long lowStockCount) { this.lowStockCount = lowStockCount; }

    public Long getCriticalStockCount() { return criticalStockCount; }
    public void setCriticalStockCount(Long criticalStockCount) { this.criticalStockCount = criticalStockCount; }

    public Long getTotalPurchaseOrders() { return totalPurchaseOrders; }
    public void setTotalPurchaseOrders(Long totalPurchaseOrders) { this.totalPurchaseOrders = totalPurchaseOrders; }

    public Long getTotalVendors() { return totalVendors; }
    public void setTotalVendors(Long totalVendors) { this.totalVendors = totalVendors; }

    public Long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }
}