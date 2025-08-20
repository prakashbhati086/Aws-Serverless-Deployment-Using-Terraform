AWS Serverless User Management
A beginner‑friendly, end‑to‑end serverless app:

React + Vite + TypeScript frontend

AWS Lambda (Node.js 18) + API Gateway HTTP API

DynamoDB for storage

Terraform for IaC

Hosted on S3 + CloudFront

Live demo

Frontend: https://d18df0n5tiv9r2.cloudfront.net//

API:  https://xxxxx.execute-api.us-east-1.amazonaws.com


<img width="1486" height="817" alt="image" src="https://github.com/user-attachments/assets/21e1331b-0003-4da9-b840-2cc0b956dc17" />
<img width="946" height="366" alt="image" src="https://github.com/user-attachments/assets/b30fef13-0725-4c08-90a0-9c4d81555a42" />
<img width="1530" height="286" alt="image" src="https://github.com/user-attachments/assets/98547f22-f27e-4fee-9351-a9d37e251f97" />
<img width="587" height="571" alt="image" src="https://github.com/user-attachments/assets/da3f137a-7d55-4316-997b-8bd6eef6fc0b" />
<img width="1119" height="601" alt="image" src="https://github.com/user-attachments/assets/b71738a3-a82e-4e45-98ee-f5fd74dace4c" />
Repository structure

backend/ — Lambda handler (Node.js 18, AWS SDK v3)

frontend/ — React + Vite + TypeScript app

terraform/ — Terraform configs for all AWS resources

Quick start

Prerequisites

Node.js 18+

AWS CLI v2 configured (aws configure)

Terraform 1.5+

Clone and install

git clone <REPO_URL>

cd aws-serverless-app-deploy

cd frontend && npm install && cd ..

Configure API URL for the frontend

Create frontend/.env:

VITE_API_BASE_URL=https://x....xxxxxxxxx

Deploy infrastructure (Terraform)

cd terraform

terraform init

terraform plan -out tfplan

terraform apply "tfplan"

Note the outputs:

http_api_url

site_bucket_name

cloudfront_domain_name

Test the API (PowerShell examples)

Create:
$body = @{ name = "Alice"; email = "alice@example.com" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "<HTTP_API_URL>/users" -ContentType "application/json" -Body $body

List:
Invoke-RestMethod -Method Get -Uri "<HTTP_API_URL>/users"

Run frontend locally

cd frontend

npm run dev

Open http://localhost:5173

Deploy frontend to S3 + CloudFront

Build:
cd frontend && npm run build && cd ..

Upload:
aws s3 sync ./frontend/dist s3://<site_bucket_name> --delete

Invalidate cache:
aws cloudfront list-distributions --query "DistributionList.Items[].{Id:Id,Domain:DomainName}" --output table
aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/*"

Visit:
https://d18df0n5tiv9r2.cloudfront.net/

Features

Create user: POST /users

List users: GET /users

Delete user: DELETE /users/{id}

CORS enabled for browser calls

Minimal, modern UI with React + TypeScript

One Lambda function handling all routes via API Gateway

Code highlights

Lambda handler (backend/index.js)

Node.js 18

AWS SDK v3

Routes:

POST /users: PutItem with generated UUID

GET /users: Scan

DELETE /users/{id}: DeleteItem

Returns JSON with CORS headers

Frontend (frontend/src/App.tsx)

React + TypeScript

Axios for API calls

Environment‑driven API URL (VITE_API_BASE_URL)

Simple, responsive layout with improved styling

Terraform (terraform/)

DynamoDB table (PAY_PER_REQUEST)

IAM role/policies for Lambda (basic exec + DynamoDB actions)

Lambda built from backend/ directory and zipped for upload

API Gateway HTTP API with routes: GET/POST/DELETE /users

S3 bucket for static site (private)

CloudFront distribution with OAC

Outputs for API URL, bucket, CloudFront domain

Common commands

API via PowerShell

Create:
$body = @{ name = "Bob"; email = "bob@example.com" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "<HTTP_API_URL>/users" -ContentType "application/json" -Body $body

List:
Invoke-RestMethod -Method Get -Uri "<HTTP_API_URL>/users"

Delete:
$id = "<USER_ID>"
Invoke-RestMethod -Method Delete -Uri "<HTTP_API_URL>/users/$id" -StatusCodeVariable sc -SkipHttpErrorCheck
$sc # expect 204

Frontend build & deploy

npm --prefix ./frontend run build

aws s3 sync ./frontend/dist s3://<site_bucket_name> --delete

aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/*"

Terraform lifecycle

terraform fmt && terraform validate

terraform plan -out tfplan

terraform apply "tfplan"

Destroy (careful):

aws s3 rm s3://<site_bucket_name> --recursive

terraform destroy

Environment management

Use .env for local dev:

VITE_API_BASE_URL=...

Optional: frontend/.env.production for production builds.

Do not commit secrets. See .gitignore.

Costs

Minimal on free/low usage:

DynamoDB PAY_PER_REQUEST

Lambda usage-based

CloudFront/S3 data transfer as used

Roadmap

Update user (PUT /users/{id})

Form validation and better error toasts

Cognito user authentication

GitHub Actions for CI/CD (terraform validate, plan, apply; frontend build & deploy)

Custom domain + TLS via ACM and Route 53

Contributing

PRs welcome. Please run:

npm run lint (if configured)

terraform fmt && terraform validate
