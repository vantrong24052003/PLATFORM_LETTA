# Docker

## Port Mapping
- Web: 4001:3000
- PostgreSQL: 5434:5432
- Redis: 6379:6379

## Commands
```bash
# Build
docker compose build

# Development
ENV_FILE=.env.development docker compose up -d

# Production
ENV_FILE=.env.production docker compose up -d
```
