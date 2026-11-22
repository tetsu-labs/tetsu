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


## Verified database migrations

Alembic is now the schema migration mechanism. CI verifies the full round-trip:

```text
alembic upgrade head
alembic downgrade base
alembic upgrade head
```

Result: PASS.

## Verified public-data analysis

The platform is cross-checked against the public NCCTG advanced lung cancer dataset distributed with R `survival`.

Verified values:

- N: 228
- Events: 165
- Kaplan–Meier median: 310 days
- Log-rank p-value (sex groups): 0.0013111645203554782
- Cox age hazard ratio: 1.018896487608979

The exact same rows are analyzed by R `survival` and the Python platform, and the CI asserts numerical agreement.

Verified run:
https://github.com/tetsu-labs/tetsu/actions/runs/45055788425

## AWS deployment status

The deployment workflow has been implemented for:

```text
GitHub OIDC
  -> S3 remote Terraform state
  -> ECR backend image
  -> Terraform plan/apply
  -> VPC / ALB / ECS Fargate / RDS PostgreSQL
  -> /health verification
```

The first real deployment attempt stopped at credential preflight because these GitHub Actions secrets are not configured yet:

- `AWS_ROLE_ARN`
- `TTE_DB_PASSWORD`
- `TTE_JWT_SECRET`

No AWS resources were created and no AWS charges were incurred by that failed attempt.

Deployment attempt:
https://github.com/tetsu-labs/tetsu/actions/runs/45055876239
