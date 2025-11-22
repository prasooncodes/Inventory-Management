# CI/CD Pipeline with GitHub Actions and Docker for MERN Stack

This project includes a complete CI/CD pipeline using GitHub Actions and Docker to deploy your Inventory Management MERN application.

## Prerequisites

- A GitHub account
- A Docker Hub account
- Docker installed on your local machine (for local testing)

## Setup Instructions

### Step 1: Configure GitHub Secrets

Go to your GitHub repository settings → Secrets and variables → Actions, and add these secrets:

1. `DOCKER_HUB_USERNAME` - Your Docker Hub username
2. `DOCKER_HUB_ACCESS_TOKEN` - Your Docker Hub access token (create one at https://hub.docker.com/settings/security)

### Step 2: Test Locally

Build and run the containers locally:

```bash
# Build images
docker-compose build

# Run containers
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### Step 3: Push to GitHub

Commit and push your changes to the `main` branch:

```bash
git add .
git commit -m "Add CI/CD pipeline"
git push origin main
```

The GitHub Actions workflow will automatically:
1. Install dependencies for both frontend and backend
2. Run linting checks
3. Build the frontend
4. Build Docker images for both services
5. Push images to Docker Hub

### Step 4: Deploy to Production

Once images are pushed to Docker Hub, you can deploy them on any server:

```bash
# Pull images
docker pull <your-dockerhub-username>/inventory-backend:latest
docker pull <your-dockerhub-username>/inventory-frontend:latest

# Run with docker-compose
docker-compose up -d
```

## Environment Variables

Make sure to set these environment variables in your production environment:

- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Backend port (default: 4000)

## Docker Images

The pipeline creates two Docker images:

1. **Backend** (`inventory-backend`): Node.js API server
2. **Frontend** (`inventory-frontend`): React app served with Nginx

## Workflow Details

The GitHub Actions workflow (`.github/workflows/main.yml`) runs on:
- Push to `main` branch
- Pull requests to `main` branch

It performs:
- Dependency installation
- Code linting
- Frontend build
- Docker image building and pushing
- Image tagging with both `latest` and commit SHA

## Troubleshooting

- Check GitHub Actions logs for build errors
- Verify Docker Hub credentials are correct
- Ensure all required secrets are configured
- Test Docker builds locally before pushing
