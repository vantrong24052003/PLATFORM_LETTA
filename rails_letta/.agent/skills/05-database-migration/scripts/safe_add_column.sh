#!/bin/bash
# scripts/safe_add_column.sh
# Safely add a nullable column to a table
# Usage: ./safe_add_column.sh TABLE_NAME COLUMN_NAME COLUMN_TYPE

set -e

if [ "$#" -ne 3 ]; then
    echo "Usage: $0 TABLE_NAME COLUMN_NAME COLUMN_TYPE"
    echo "Example: $0 users phone string"
    exit 1
fi

TABLE_NAME=$1
COLUMN_NAME=$2
COLUMN_TYPE=$3

echo "=== Safe Add Column Wizard ==="
echo "Table: $TABLE_NAME"
echo "Column: $COLUMN_NAME ($COLUMN_TYPE)"
echo ""

# Generate migration
TIMESTAMP=$(date +%Y%m%d%H%M%S)
MIGRATION_NAME="add_${COLUMN_NAME}_to_${TABLE_NAME}"
MIGRATION_FILE="db/migrate/${TIMESTAMP}_${MIGRATION_NAME}.rb"

cat > "$MIGRATION_FILE" <<EOF
class Add${COLUMN_NAME^}To${TABLE_NAME^} < ActiveRecord::Migration[8.0]
  def change
    # Step 1: Add column as nullable (safe)
    add_column :${TABLE_NAME}, :${COLUMN_NAME}, :${COLUMN_TYPE}
    
    # Step 2: (Optional) Backfill data if needed
    # ${TABLE_NAME^}.where(${COLUMN_NAME}: nil).update_all(${COLUMN_NAME}: 'default_value')
    
    # Step 3: (Later migration) Add NOT NULL constraint if needed
    # change_column_null :${TABLE_NAME}, :${COLUMN_NAME}, false
  end
end
EOF

echo "✅ Migration created: $MIGRATION_FILE"
echo ""
echo "Next steps:"
echo "1. Review migration file"
echo "2. Run: bundle exec rails db:migrate"
echo "3. Test in development"
echo "4. Deploy to production"
