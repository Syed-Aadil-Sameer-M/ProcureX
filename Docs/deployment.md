# Deployment

## Docker
- Backend: `docker build -t procurex-backend backend/`
- Frontend: Use Vite build and serve static files

## CI/CD
- GitHub Actions workflow in `.github/workflows/ci.yml`

## Production
- Use PostgreSQL
- Set environment variables for DB credentials
