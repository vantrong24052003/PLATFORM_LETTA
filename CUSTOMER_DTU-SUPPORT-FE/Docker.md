# Docker

## Port Mapping
- FE (Nuxt): 4000:3000

## Commands
```bash
# Build
docker compose build

# Development
ENV_FILE=.env.development docker compose up -d

# Production
ENV_FILE=.env.production docker compose up -d
```
