output "api_url" {
  value = "http://${aws_lb.main.dns_name}"
}

output "db_endpoint" {
  value = aws_db_instance.postgres.address
}

output "ecr_repository_url" {
  value = aws_ecr_repository.backend.repository_url
}
