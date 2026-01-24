# references/add_column_template.rb
# Template for safely adding a column to a table

class AddColumnNameToTableName < ActiveRecord::Migration[8.0]
  def change
    # Step 1: Add column as nullable (safe, no downtime)
    add_column :table_name, :column_name, :string
    
    # Optional: Add index if needed
    # add_index :table_name, :column_name, algorithm: :concurrently
  end
  
  # Alternative: Use separate up/down for complex changes
  # def up
  #   add_column :table_name, :column_name, :string
  # end
  #
  # def down
  #   remove_column :table_name, :column_name
  # end
end
