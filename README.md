# My Serverless App

A full-stack serverless application built with AWS Lambda, API Gateway, DynamoDB, and S3, deployed using Terraform.

## Architecture
- Frontend: React app hosted on S3 with CloudFront
- Backend: Node.js Lambda functions
- Database: DynamoDB
- Infrastructure: Terraform

## Prerequisites
- AWS CLI configured
- Terraform >= 1.0
- Node.js >= 16

## Deployment
1. Install dependencies: `npm install` in both frontend and backend directories
2. Build backend: `cd backend && npm run build`
3. Build frontend: `cd frontend && npm run build`
4. Deploy infrastructure: `cd terraform && terraform init && terraform apply`

## Environment Variables
Copy `.env.example` to `.env` and configure your AWS region and other settings.
