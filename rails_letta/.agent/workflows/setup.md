---
description: Setup project dependencies and database
---

# /setup - Project Setup

// turbo-all

1. Install Ruby dependencies:
```bash
bundle install
```

2. Create database (if not exists):
```bash
rails db:create
```

3. Run migrations:
```bash
rails db:migrate
```

4. Seed data (optional):
```bash
rails db:seed
```

5. Verify setup:
```bash
rails db:version
```
