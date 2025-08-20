locals {
  site_bucket_name = "${var.project_name}-${var.env}-site"
}

# S3 bucket for static site
resource "aws_s3_bucket" "site_bucket" {
  bucket = local.site_bucket_name
}

# Block all public access (we'll use CloudFront OAC)
resource "aws_s3_bucket_public_access_block" "site_block" {
  bucket                  = aws_s3_bucket.site_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Bucket versioning (optional but useful for rollbacks)
resource "aws_s3_bucket_versioning" "site_versioning" {
  bucket = aws_s3_bucket.site_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

# CloudFront Origin Access Control (OAC)
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "${local.full_name}-oac"
  description                       = "OAC for ${aws_s3_bucket.site_bucket.bucket}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront distribution
resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  comment             = "${local.full_name} static site"
  default_root_object = "index.html"

  origin {
    origin_id   = "s3-origin"
    domain_name = aws_s3_bucket.site_bucket.bucket_regional_domain_name

    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
  }

  default_cache_behavior {
    target_origin_id       = "s3-origin"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods  = ["GET", "HEAD"]

    compress = true

    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
    }
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  depends_on = [aws_s3_bucket_public_access_block.site_block]
}

# Allow CloudFront to read from S3 via OAC
data "aws_iam_policy_document" "site_bucket_policy_doc" {
  statement {
    sid       = "AllowCloudFrontAccessViaOAC"
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site_bucket.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.cdn.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "site_bucket_policy" {
  bucket = aws_s3_bucket.site_bucket.id
  policy = data.aws_iam_policy_document.site_bucket_policy_doc.json
}

# Outputs
output "site_bucket_name" {
  value       = aws_s3_bucket.site_bucket.bucket
  description = "S3 bucket for static site"
}

output "cloudfront_domain_name" {
  value       = aws_cloudfront_distribution.cdn.domain_name
  description = "CloudFront domain for the site"
}
