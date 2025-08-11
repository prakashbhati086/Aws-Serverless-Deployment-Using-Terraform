output "api_gateway_url" {
  description = "API Gateway URL"
  value       = "${aws_api_gateway_deployment.main.invoke_url}"
}

output "cloudfront_url" {
  description = "CloudFront distribution URL"
  value       = module.frontend.cloudfront_url
}

output "s3_bucket_name" {
  description = "S3 bucket name for frontend"
  value       = module.frontend.s3_bucket_name
}
