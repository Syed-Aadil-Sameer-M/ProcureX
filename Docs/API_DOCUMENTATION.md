# ProcureX API Documentation

Base URL: `http://localhost:8080`
All protected endpoints require: `Authorization: Bearer <token>`

---

## Authentication Endpoints

### POST /api/auth/login
**Description:** Login with username and password
**Auth Required:** No
**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}