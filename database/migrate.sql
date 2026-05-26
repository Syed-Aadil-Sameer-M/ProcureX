ALTER TABLE inventory ADD COLUMN IF NOT EXISTS stock_level VARCHAR(20) NOT NULL DEFAULT 'OK';
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS notes TEXT;

UPDATE inventory SET stock_level = CASE
    WHEN quantity = 0 THEN 'CRITICAL'
    WHEN quantity < min_stock_level THEN 'LOW'
    ELSE 'OK'
END;

SELECT id, material, quantity, min_stock_level, stock_level FROM inventory;
