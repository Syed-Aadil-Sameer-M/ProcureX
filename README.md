# ProcureX

A modern enterprise procurement system.

## Stack
- **Backend:** Spring Boot, Spring Security (JWT), Spring Data JPA, PostgreSQL
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn/ui

## Running Locally

### 1. Database Setup
Ensure PostgreSQL is running and create a database named `ProcureX_DB`.

### 2. Backend
Copy `.env.example` to `.env` inside `Backend` directory or configure your environment variables.
```bash
cd Backend
mvn spring-boot:run
```

### 3. Frontend
```bash
cd Frontend
npm install
npm run dev
```

### 4. Admin Login
By default, you can use the default data initialized or create an admin account directly in the database.
