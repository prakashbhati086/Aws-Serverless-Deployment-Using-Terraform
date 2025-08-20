output "http_api_url" {
  description = "Invoke URL for the HTTP API"
  value       = aws_apigatewayv2_api.http_api.api_endpoint
}

output "dynamodb_table_name" {
  description = "DynamoDB table name"
  value       = aws_dynamodb_table.users_table.name
}
