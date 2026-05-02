-- ProcureX Master Schema - matches Java entities exactly
-- For dev: Hibernate creates tables automatically (ddl-auto: create-drop)
-- For prod: run this file manually before starting the backend

CREATE TABLE users (
    id        BIGSERIAL PRIMARY KEY,
    username  VARCHAR(50)   UNIQUE NOT NULL,
    password  VARCHAR(255)  NOT NULL,
    email     VARCHAR(100)  UNIQUE NOT NULL,
    role      VARCHAR(20)   NOT NULL,
    plaintext_password VARCHAR(255)
);

CREATE TABLE requests (
    id          BIGSERIAL PRIMARY KEY,
    material    VARCHAR(255)  NOT NULL,
    quantity    INT           NOT NULL,
    location    VARCHAR(255)  NOT NULL,
    description TEXT,
    status      VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    user_id     BIGINT        REFERENCES users(id),
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE inventory (
    id          BIGSERIAL PRIMARY KEY,
    material    VARCHAR(255)  UNIQUE NOT NULL,
    quantity    INT           NOT NULL DEFAULT 0,
    price       DECIMAL(10,2)
);

CREATE TABLE purchase_orders (
    id          BIGSERIAL PRIMARY KEY,
    material    VARCHAR(255)  NOT NULL,
    quantity    INT           NOT NULL,
    status      VARCHAR(20)   NOT NULL DEFAULT 'CREATED',
    request_id  BIGINT        REFERENCES requests(id),
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT        REFERENCES users(id),
    action      VARCHAR(100)  NOT NULL,
    module      VARCHAR(50)   NOT NULL,
    description TEXT,
    timestamp   TIMESTAMP     NOT NULL DEFAULT NOW()
);
