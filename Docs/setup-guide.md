# Setup Guide

## Prerequisites
- Java 17
- Node.js 16+
- Maven
- PostgreSQL (for prod)

## Backend Setup
1. Navigate to `backend/`
2. Run `mvn install`
3. Run `mvn spring-boot:run`

## Frontend Setup
1. Navigate to `frontend/`
2. Run `npm install`
3. Run `npm run dev`

## Database
- For dev: H2 is used automatically
- For prod: Set up PostgreSQL and update `application-prod.yml`
