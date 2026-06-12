-- ProcureX Master Schema
-- For dev: Hibernate updates tables automatically (ddl-auto: update)
-- For prod: run this file manually before starting the backend

DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS stock_transactions CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS purchase_orders CASCADE;
DROP TABLE IF EXISTS requests CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id           BIGSERIAL PRIMARY KEY,
    username     VARCHAR(50)   UNIQUE NOT NULL,
    password     VARCHAR(255)  NOT NULL,
    email        VARCHAR(100)  UNIQUE NOT NULL,
    role         VARCHAR(20)   NOT NULL,
    full_name    VARCHAR(100),
    department   VARCHAR(100),
    phone_number VARCHAR(20)
);

CREATE TABLE vendors (
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(255)  NOT NULL,
    contact_name VARCHAR(255),
    email        VARCHAR(255),
    phone        VARCHAR(50)
);

CREATE TABLE inventory (
    id                BIGSERIAL PRIMARY KEY,
    material          VARCHAR(255)  UNIQUE NOT NULL,
    quantity          INT           NOT NULL DEFAULT 0,
    price             DECIMAL(10,2),
    unit              VARCHAR(20)   NOT NULL DEFAULT 'pcs',
    min_stock_level   INT           NOT NULL DEFAULT 10,
    stock_level       VARCHAR(20)   NOT NULL DEFAULT 'OK'
);

CREATE TABLE requests (
    id           BIGSERIAL PRIMARY KEY,
    inventory_id BIGINT        NOT NULL REFERENCES inventory(id),
    quantity     INT           NOT NULL,
    location     VARCHAR(255)  NOT NULL,
    description  TEXT,
    status       VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    user_id      BIGINT        REFERENCES users(id),
    created_at   TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE purchase_orders (
    id           BIGSERIAL PRIMARY KEY,
    inventory_id BIGINT        NOT NULL REFERENCES inventory(id),
    vendor_id    BIGINT        NOT NULL REFERENCES vendors(id),
    quantity     INT           NOT NULL,
    status       VARCHAR(20)   NOT NULL DEFAULT 'CREATED',
    notes        TEXT,
    request_id   BIGINT        REFERENCES requests(id),
    created_at   TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
    id           BIGSERIAL PRIMARY KEY,
    message      TEXT          NOT NULL,
    is_read      BOOLEAN       NOT NULL DEFAULT FALSE,
    user_id      BIGINT        NOT NULL REFERENCES users(id),
    timestamp    TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE stock_transactions (
    id              BIGSERIAL PRIMARY KEY,
    inventory_id    BIGINT        NOT NULL REFERENCES inventory(id),
    quantity_change INT           NOT NULL,
    type            VARCHAR(10)   NOT NULL, -- 'IN' or 'OUT'
    reference       VARCHAR(100),           -- e.g., 'PO-101' or 'REQ-002'
    timestamp       TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT        REFERENCES users(id),
    action      VARCHAR(100)  NOT NULL,
    module      VARCHAR(50)   NOT NULL,
    description TEXT,
    timestamp   TIMESTAMP     NOT NULL DEFAULT NOW()
);
