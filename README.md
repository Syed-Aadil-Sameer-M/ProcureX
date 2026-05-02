# 🛡️ ProcureX: Enterprise Procurement & Request Management

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.0-brightgreen.svg?logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg?logo=postgresql)](https://www.postgresql.org/)

**ProcureX** is an enterprise-grade, end-to-end procurement and inventory management system designed for security professionals and operational teams. It provides a centralized command center to seamlessly manage equipment requests, multi-tier approvals, vendor relations, and real-time inventory tracking.

---

## ✨ Key Features

- 🔐 **Robust Authentication & RBAC:** Secure JWT-ready authentication with strictly enforced Role-Based Access Control (RBAC). 
- 👥 **Role-Specific Dashboards:**
  - **Receiver:** Submit material requests, track request statuses, and monitor notifications.
  - **Admin:** Oversee system-wide activity, approve/reject pending requests, manage users, and review audit logs.
  - **Procurement:** Process approved requests, manage inventory levels, interact with vendors, and generate Purchase Orders.
- 📦 **Inventory Management:** Real-time tracking of critical stock levels with automated low-stock threshold alerts.
- 🛒 **Purchase Order Generation:** Direct vendor integration to seamlessly turn approved requests into actionable Purchase Orders.
- 📜 **Immutable Audit Trails:** Comprehensive logging of all system actions for stringent compliance and accountability.
- 🎨 **Enterprise Design System:** Built on an advanced Dark Navy aesthetic using **Tailwind CSS v4** and **Shadcn UI** for a premium, responsive user experience.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn UI (Radix Primitives)
- **Routing:** React Router DOM v7
- **Form Handling:** React Hook Form & Zod Validation
- **State/Fetching:** TanStack React Query & Axios

### Backend
- **Framework:** Spring Boot 3.1.0
- **Language:** Java
- **Security:** Spring Security (BCrypt password encoding)
- **Data Access:** Spring Data JPA / Hibernate
- **Database:** PostgreSQL

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Java JDK** (v17+)
- **Maven**
- **PostgreSQL** (v15+)

### 1. Database Setup
1. Create a PostgreSQL database named `procurex`.
2. Ensure your PostgreSQL credentials match the configurations in `Backend/src/main/resources/application.yml` (default: `username: postgres`, `password: password`).
3. Run the database migrations/seeder located at `database/seed.sql` to populate initial demo data.

### 2. Running the Backend (Spring Boot)
Open a terminal in the `Backend` directory:
```bash
cd Backend
mvn spring-boot:run
```
*The backend will start and listen on `http://localhost:8080`.*

### 3. Running the Frontend (Vite/React)
Open a new terminal in the `Frontend` directory:
```bash
cd Frontend
npm install
npm run dev
```
*The frontend will start and be accessible at `http://localhost:5173`.*

---

## 🔑 Demo Credentials

If the database was seeded using `seed.sql`, you can log in using the following demo accounts (All passwords are **`aadil@123`**):

- **Admin Access:** `admin@procurex.com`
- **Receiver Access:** `receiver1@procurex.com`
- **Procurement Access:** `procurement1@procurex.com`

---

## 📂 Project Structure

```text
ProcureX/
├── Backend/                 # Spring Boot API & Java Domain Logic
│   ├── src/main/java/...    # Controllers, Services, Entities, Repositories
│   └── src/main/resources/  # application.yml and static assets
├── Frontend/                # React Vite TypeScript UI
│   ├── src/components/      # Reusable Shadcn UI & Layout Components
│   ├── src/contexts/        # Global React Contexts (e.g., AuthContext)
│   ├── src/pages/           # 23+ Role-Segmented Dashboard Views
│   └── src/services/        # Axios API Client & Data Fetching logic
└── database/                # SQL Schema and Seeder Files
```

---

## 📝 License

This project is proprietary and confidential. Unauthorized copying of this file, via any medium, is strictly prohibited.
