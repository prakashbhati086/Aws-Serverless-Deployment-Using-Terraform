# 🚀 AWS Serverless Full-Stack Application

A production-ready serverless web application built with **React**, **Node.js**, **AWS Lambda**, **DynamoDB**, and deployed using **Terraform** Infrastructure as Code.

![AWS Architecture](https://img.shields.io/badge/AWS-Serverless-orange) ![Terraform](https://img.shields.io/badge/Terraform-IaC-purple) ![React](https://img.shields.io/badge/React-Frontend-blue) ![Node.js](https://img.shields.io/badge/Node.js-Backend-green)

## 📋 Table of Contents

- [🏗️ Architecture](#️-architecture)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📊 Project Structure](#-project-structure)
- [⚡ Quick Start](#-quick-start)
- [🔧 Installation](#-installation)
- [🚀 Deployment](#-deployment)
- [🌐 Environment Management](#-environment-management)
- [📈 Monitoring](#-monitoring)
- [🧪 Testing](#-testing)
- [💰 Cost Optimization](#-cost-optimization)
- [🔒 Security](#-security)
- [📝 API Documentation](#-api-documentation)
- [🤝 Contributing](#-contributing)

## 🏗️ Architecture

### System Architecture Diagram

graph TB
User[👤 User] --> CF[☁️ CloudFront CDN]
CF --> S3[🗂️ S3 Static Website]
S3 --> React[⚛️ React App]
React --> AG[🌐 API Gateway]
AG --> Lambda[⚡ Lambda Functions]
Lambda --> DDB[🗄️ DynamoDB]

subgraph "AWS Cloud"
    CF
    S3
    AG
    Lambda
    DDB
    CW[📊 CloudWatch Logs]
    IAM[🔐 IAM Roles]
end

Lambda --> CW
Lambda --> IAM

style User fill:#e1f5fe
style CF fill:#fff3e0
style S3 fill:#e8f5e8
style React fill:#e3f2fd
style AG fill:#f3e5f5
style Lambda fill:#fff8e1
style DDB fill:#fce4ec



### Request Flow

sequenceDiagram
participant U as User
participant CF as CloudFront
participant S3 as S3 Bucket
participant AG as API Gateway
participant L as Lambda
participant DB as DynamoDB

U->>CF: 1. Request Website
CF->>S3: 2. Fetch Static Files
S3-->>CF: 3. Return HTML/JS/CSS
CF-->>U: 4. Serve Website

U->>AG: 5. API Request (CRUD)
AG->>L: 6. Invoke Lambda
L->>DB: 7. Database Operation
DB-->>L: 8. Return Data
L-->>AG: 9. Response
AG-->>U: 10. JSON Response




### Infrastructure Components

| Component | Purpose | Configuration |
|-----------|---------|---------------|
| **CloudFront** | Global CDN for fast content delivery | Custom domain, SSL, caching |
| **S3** | Static website hosting | Public read access, website config |
| **API Gateway** | REST API endpoint management | CORS enabled, Lambda integration |
| **Lambda** | Serverless compute for business logic | Node.js 18.x, 256MB memory |
| **DynamoDB** | NoSQL database for user data | Pay-per-request, single table |
| **IAM** | Security and access management | Least privilege policies |
| **CloudWatch** | Monitoring and logging | Lambda logs, custom metrics |

## ✨ Features

- ⚡ **Serverless Architecture** - Zero server management, auto-scaling
- 🌍 **Global CDN** - Fast content delivery worldwide via CloudFront
- 🔒 **SSL/HTTPS** - Secure communications with ACM certificates
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🏗️ **Infrastructure as Code** - Fully automated with Terraform
- 🔄 **Multi-Environment** - Separate dev/staging/production environments
- 📊 **Monitoring** - CloudWatch dashboards and alerting
- 💰 **Cost-Optimized** - Pay-per-request pricing model
- 🚀 **One-Click Deployment** - Automated deployment scripts
- 🧪 **API Testing** - Built-in testing utilities

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **JavaScript ES6+** - Modern JavaScript features
- **Axios** - Promise-based HTTP client
- **CSS3** - Responsive styling

### Backend
- **Node.js 18** - JavaScript runtime
- **AWS Lambda** - Serverless compute
- **AWS SDK** - AWS service integration
- **Webpack** - Module bundling

### Infrastructure
- **Terraform** - Infrastructure as Code
- **AWS Provider** - AWS resource management
- **Random Provider** - Unique resource naming

### AWS Services
- **Lambda** - Serverless functions
- **API Gateway** - REST API management
- **DynamoDB** - NoSQL database
- **S3** - Object storage
- **CloudFront** - Content Delivery Network
- **Route 53** - DNS management
- **ACM** - SSL certificates
- **IAM** - Identity and access management
- **CloudWatch** - Monitoring and logging

## 📊 Project Structure


my-serverless-app/
├── 📁 backend/ # Node.js Lambda functions
│ ├── 📁 src/
│ │ ├── 📄 index.js # Main Lambda handler
│ │ ├── 📁 handlers/
│ │ │ └── 📄 userHandler.js # User CRUD operations
│ │ └── 📁 utils/
│ │ ├── 📄 dynamodb.js # Database utilities
│ │ └── 📄 validation.js # Input validation
│ ├── 📄 package.json # Dependencies
│ └── 📄 webpack.config.js # Build configuration
├── 📁 frontend/ # React application
│ ├── 📁 src/
│ │ ├── 📄 App.js # Main React component
│ │ ├── 📄 App.css # Styling
│ │ └── 📄 index.js # React entry point
│ ├── 📁 public/
│ │ └── 📄 index.html # HTML template
│ ├── 📄 package.json # Dependencies
│ └── 📄 deploy.js # S3 deployment script
├── 📁 terraform/ # Infrastructure as Code
│ ├── 📄 main.tf # Main configuration
│ ├── 📄 variables.tf # Input variables
│ ├── 📄 outputs.tf # Output values
│ ├── 📁 modules/ # Reusable modules
│ │ ├── 📁 lambda/ # Lambda configuration
│ │ ├── 📁 api_gateway/ # API Gateway setup
│ │ ├── 📁 dynamodb/ # Database configuration
│ │ ├── 📁 frontend/ # S3 + CloudFront
│ │ └── 📁 monitoring/ # CloudWatch setup
│ └── 📁 environments/ # Environment configs
│ ├── 📄 dev.tfvars # Development settings
│ └── 📄 prod.tfvars # Production settings
├── 📄 deploy.sh # Automated deployment
├── 📄 test.sh # API testing script
└── 📄 README.md # This file




## ⚡ Quick Start

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [AWS CLI](https://aws.amazon.com/cli/) (configured with credentials)
- [Terraform](https://terraform.io/) (v1.0 or higher)
- [Git](https://git-scm.com/)

### 1. Clone Repository


git clone https://github.com/yourusername/my-serverless-app.git
cd my-serverless-app


## 📈 Monitoring

### CloudWatch Dashboard

The deployment creates a comprehensive monitoring dashboard with:

- **Lambda Metrics:** Invocations, errors, duration
- **API Gateway Metrics:** Request count, latency, errors
- **DynamoDB Metrics:** Read/write capacity, throttles
- **CloudFront Metrics:** Cache hit ratio, origin latency

### Alerts and Notifications

Automated alerts for:
- Lambda function errors (>5 errors in 10 minutes)
- API Gateway 5XX errors
- DynamoDB throttling events
- High Lambda duration

### Accessing Monitoring

1. Go to [AWS CloudWatch Console](https://console.aws.amazon.com/cloudwatch/)
2. Navigate to "Dashboards"
3. Select `my-serverless-app-[environment]-dashboard`

### Log Analysis


