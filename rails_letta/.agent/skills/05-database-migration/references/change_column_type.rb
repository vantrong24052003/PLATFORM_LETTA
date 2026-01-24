# references/change_column_type.rb
# Template for safely changing column type (multi-step approach)

# STEP 1: Add new column with new type
class AddNewColumnToTableName < ActiveRecord::Migration[8.0]
  def change
    add_column :table_name, :column_name_new, :new_type
  end
end

# STEP 2: Backfill data (can be done in batches)
class BackfillNewColumnInTableName < ActiveRecord::Migration[8.0]
  disable_ddl_transaction!  # Allow batching
  
  def up
    # Simple backfill
    execute <<-SQL
      UPDATE table_name 
      SET column_name_new = CAST(column_name_old AS new_type)
      WHERE column_name_new IS NULL
    SQL
    
    # Or batch processing for large tables:
    # TableName.in_batches(of: 1000) do |batch|
    #   batch.update_all("column_name_new = CAST(column_name_old AS new_type)")
    # end
  end
  
  def down
    # Optional rollback
  end
end

# STEP 3: Switch column names (after code deployment reads from new column)
class SwitchColumnNamesInTableName < ActiveRecord::Migration[8.0]
  def change
    rename_column :table_name, :column_name_old, :column_name_temp
    rename_column :table_name, :column_name_new, :column_name
    rename_column :table_name, :column_name_temp, :column_name_old
  end
end

# STEP 4: Remove old column (after verification)
class RemoveOldColumnFromTableName < ActiveRecord::Migration[8.0]
  def change
    remove_column :table_name, :column_name_old
  end
end
