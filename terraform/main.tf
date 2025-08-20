locals {
  full_name = "${var.project_name}-${var.env}"
}

# DynamoDB: Users table
resource "aws_dynamodb_table" "users_table" {
  name         = "${local.full_name}-users"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "userId"

  attribute {
    name = "userId"
    type = "S"
  }

  tags = {
    Project     = var.project_name
    Environment = var.env
  }
}

# IAM Role for Lambda
data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda_role" {
  name               = "${local.full_name}-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

# Basic execution policy (logs) + DynamoDB access
resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "aws_iam_policy_document" "ddb_access" {
  statement {
    actions = [
      "dynamodb:PutItem",
      "dynamodb:GetItem",
      "dynamodb:Scan",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem"
    ]
    resources = [aws_dynamodb_table.users_table.arn]
  }
}

resource "aws_iam_policy" "ddb_policy" {
  name   = "${local.full_name}-ddb-policy"
  policy = data.aws_iam_policy_document.ddb_access.json
}

resource "aws_iam_role_policy_attachment" "lambda_ddb_policy_attach" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.ddb_policy.arn
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../backend"
  output_path = "${path.module}/lambda.zip"

  excludes = [
    ".git",
    ".gitignore"
  ]
}



# Lambda function
resource "aws_lambda_function" "api_handler" {
  function_name    = "${local.full_name}-api"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = filebase64sha256(data.archive_file.lambda_zip.output_path)
  timeout          = 10
  memory_size      = 256
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.users_table.name
    }
  }
}

# API Gateway HTTP API
resource "aws_apigatewayv2_api" "http_api" {
  name          = "${local.full_name}-http-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins  = ["*"]
    allow_methods  = ["GET", "POST","DELETE", "OPTIONS"]
    allow_headers  = ["Content-Type"]
    expose_headers = []
    max_age        = 0
  }
}

# Lambda integration
resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.api_handler.arn
  payload_format_version = "2.0"
  integration_method     = "POST"
}

# Routes
resource "aws_apigatewayv2_route" "post_user" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /users"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_route" "get_users" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "GET /users"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_route" "delete_user" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "DELETE /users/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}


# Stage (auto-deploy)
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}

# Allow API Gateway to invoke Lambda
resource "aws_lambda_permission" "apigw_invoke" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_handler.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}
