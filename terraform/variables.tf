variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "my-serverless-app"
}

variable "environment" {
  description = "Environment"
  type        = string
  default     = "dev"
}
