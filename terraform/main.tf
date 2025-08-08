terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# S3 bucket for Lambda deployment packages
resource "aws_s3_bucket" "lambda_artifacts" {
  bucket = "${var.project_name}-lambda-artifacts-${random_string.suffix.result}"
}

resource "aws_s3_bucket_versioning" "lambda_artifacts" {
  bucket = aws_s3_bucket.lambda_artifacts.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

# DynamoDB Module
module "dynamodb" {
  source       = "./modules/dynamodb"
  project_name = var.project_name
  environment  = var.environment
}

# Lambda Module
module "lambda" {
  source                = "./modules/lambda"
  project_name         = var.project_name
  environment          = var.environment
  lambda_artifacts_bucket = aws_s3_bucket.lambda_artifacts.id
  dynamodb_table_name  = module.dynamodb.table_name
  dynamodb_table_arn   = module.dynamodb.table_arn
}

# API Gateway Module
module "api_gateway" {
  source              = "./modules/api_gateway"
  project_name       = var.project_name
  environment        = var.environment
  lambda_function_arn = module.lambda.function_arn
  lambda_function_name = module.lambda.function_name
}

# Frontend Module (S3 + CloudFront)
module "frontend" {
  source         = "./modules/frontend"
  project_name   = var.project_name
  environment    = var.environment
  api_gateway_url = module.api_gateway.api_url
}
