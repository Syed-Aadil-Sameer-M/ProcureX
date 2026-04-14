# Database Schema

## Tables

### users
- id (BIGINT, PK)
- username (VARCHAR(50), UNIQUE)
- password (VARCHAR(255))
- email (VARCHAR(100), UNIQUE)
- role (VARCHAR(20))

### requests
- id (BIGINT, PK)
- title (VARCHAR(255))
- description (TEXT)
- status (VARCHAR(20))
- user_id (BIGINT, FK to users)
- created_at (TIMESTAMP)

### inventory
- id (BIGINT, PK)
- name (VARCHAR(255))
- quantity (INT)
- price (DECIMAL(10,2))
