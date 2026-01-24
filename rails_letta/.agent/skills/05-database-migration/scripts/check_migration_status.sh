#!/bin/bash
# scripts/check_migration_status.sh
# Check current migration status and pending migrations

set -e

echo "=== Migration Status Check ==="
echo ""

echo "Current Schema Version:"
bundle exec rails db:version

echo ""
echo "Migration Status:"
bundle exec rails db:migrate:status

echo ""
echo "Pending Migrations:"
bundle exec rails db:migrate:status | grep " down" || echo "No pending migrations"

echo ""
echo "=== Check Complete ==="
