variable "aws_region" { type = string  default = "ap-northeast-1" }
variable "app_name"   { type = string  default = "tte-platform" }
variable "db_username"{ type = string  default = "tte" }
variable "db_password"{ type = string  sensitive = true }
variable "jwt_secret" { type = string  sensitive = true }
variable "backend_image" { type = string }
