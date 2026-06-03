# TaskMaster - DevOps Pipeline Project

A full-stack Task Management application with a complete Jenkins CI/CD pipeline.

## Features
- User authentication (JWT)
- CRUD operations for tasks
- Beautiful responsive dashboard
- Prometheus metrics
- Health checks

## Tech Stack
- **Backend**: Node.js, Express
- **Frontend**: Vanilla HTML/CSS/JS
- **CI/CD**: Jenkins
- **Container**: Docker
- **Monitoring**: Prometheus

## Quick Start

```bash
# Clone repo
git clone <your-repo>

# Backend
cd backend
npm install
npm run dev

# Or with Docker
docker compose up --build
```

## Jenkins Pipeline Stages
1. **Build** - Docker image
2. **Test** - Jest
3. **Code Quality** - ESLint
4. **Security** - npm audit
5. **Deploy** - Staging container
6. **Release** - Git tag
7. **Monitoring** - Health & metrics

**Perfect for SIT223/SIT753 High Distinction submission!**