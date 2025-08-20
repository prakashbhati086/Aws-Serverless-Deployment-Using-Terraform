variable "project_name" {
  description = "Project name prefix"
  type        = string
  default     = "aws-serverless-app-deploy"
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "env" {
  description = "Environment name"
  type        = string
  default     = "dev"
}
