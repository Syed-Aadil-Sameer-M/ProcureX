package com.procurex.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String material;

    @Column(nullable = false)
    private Integer quantity = 0;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, length = 20)
    private String unit = "pcs";

    @Column(name = "min_stock_level", nullable = false)
    private Integer minStockLevel = 10;

    @Column(name = "stock_level", nullable = false, length = 20)
    private String stockLevel = "OK";

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public Integer getMinStockLevel() { return minStockLevel; }
    public void setMinStockLevel(Integer minStockLevel) { this.minStockLevel = minStockLevel; }
    public String getStockLevel() { return stockLevel; }
    public void setStockLevel(String stockLevel) { this.stockLevel = stockLevel; }

    public void recalculateStockLevel() {
        if (quantity == null || quantity <= 0) {
            this.stockLevel = "CRITICAL";
        } else if (quantity < minStockLevel) {
            this.stockLevel = "LOW";
        } else {
            this.stockLevel = "OK";
        }
    }
}
