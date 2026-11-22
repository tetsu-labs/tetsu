# Time-to-Event Analysis Platform v13

汎用の **Time-to-Event / Survival Analysis Platform** です。ハムスター寿命研究を起点に、SaaS解約、機械故障、サーバー障害、臨床生存などへ一般化しています。

## Architecture

```text
React / TypeScript / Vite
        ↓ REST
FastAPI
        ↓
lifelines / pandas / numpy / scipy
        ↓
PostgreSQL

+ JWT authentication
+ Projects / Analysis Jobs
+ Docker Compose
+ GitHub Actions
+ Terraform
+ AWS ECS Fargate / RDS baseline
```

## Analysis

- Kaplan–Meier
- 95% confidence interval
- log-rank test
- Cox proportional hazards model
- right censoring
- group comparison
- covariates
- CSV import / mapping

## Full-stack features

- Register / Login
- JWT authentication
- user-scoped projects
- project CRUD
- persisted analysis jobs
- PostgreSQL
- FastAPI REST API
- React / TypeScript UI

## Verified CI

GitHub Actionsで以下を実行し、**すべてPASS**しています。

- Backend: `pytest -q`
- Frontend: TypeScript + Vite production build
- Terraform: `fmt -check`
- Terraform: `init -backend=false`
- Terraform: `validate`
- Docker Compose: `up -d --build`
- API health check
- JWT user registration
- project creation
- survival analysis smoke test
- Docker Compose teardown

Verified run: https://github.com/tetsu-labs/tetsu/actions/runs/45023203280

## Local start

```bash
docker compose up --build
```

Frontend:

```text
http://localhost:5173
```

Backend / OpenAPI:

```text
http://localhost:8000
http://localhost:8000/docs
```

## AWS / Terraform

Current Terraform baseline includes:

- VPC
- public subnets
- ALB
- ECS Fargate
- RDS PostgreSQL
- security groups
- ECS task/service

The Terraform configuration is syntax-validated in CI. **Actual AWS deployment has not yet been performed**, so the cloud infrastructure should be treated as a validated baseline rather than a production-proven deployment.

## Portfolio value

This project demonstrates more than CRUD. It covers:

- domain generalization from a research-specific prototype
- statistical analysis
- frontend/backend integration
- authentication
- database persistence
- containerization
- automated testing
- CI
- Infrastructure as Code
- AWS architecture

## Current next priorities

1. Alembic migration workflow
2. real public dataset validation
3. production-grade README screenshots / architecture diagram
4. HTTPS / Secrets Manager
5. actual AWS deployment
6. SQS or worker-based asynchronous analysis
7. CloudWatch observability
