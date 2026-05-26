package com.procurex.util;

public class MessageTemplates {

    public static String requestCreated(String material, Integer quantity, String requestId) {
        return String.format(
            "ProcureX Alert: Your request for %s (Qty: %d) has been submitted successfully. Request ID: %s. Status: PENDING approval.",
            material, quantity, requestId
        );
    }

    public static String requestApproved(String material, Integer quantity, String requestId) {
        return String.format(
            "ProcureX Alert: Great news! Your request for %s (Qty: %d) has been APPROVED. Request ID: %s. Materials will be allocated soon.",
            material, quantity, requestId
        );
    }

    public static String requestRejected(String material, Integer quantity, String requestId, String reason) {
        return String.format(
            "ProcureX Alert: Your request for %s (Qty: %d) has been REJECTED. Request ID: %s. Reason: %s. Contact admin for details.",
            material, quantity, requestId, reason != null ? reason : "Not specified"
        );
    }

    public static String purchaseOrderReceived(String material, Integer quantity, String poId) {
        return String.format(
            "ProcureX Alert: Purchase Order for %s (Qty: %d) has been RECEIVED. PO ID: %s. Inventory has been restocked.",
            material, quantity, poId
        );
    }

    public static String lowStockAlert(String material, Integer currentStock, Integer minStock) {
        return String.format(
            "ProcureX Alert: LOW STOCK WARNING for %s. Current stock: %d units (Min: %d). Please create a purchase order.",
            material, currentStock, minStock
        );
    }
}