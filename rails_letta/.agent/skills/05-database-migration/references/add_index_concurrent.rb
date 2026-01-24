# references/add_index_concurrent.rb
# Template for adding index without locking table (PostgreSQL)

class AddIndexToTableName < ActiveRecord::Migration[8.0]
  disable_ddl_transaction!  # Required for concurrent index creation
  
  def change
    add_index :table_name, :column_name, algorithm: :concurrently
    
    # For composite index:
    # add_index :table_name, [:column1, :column2], algorithm: :concurrently
    
    # For unique index:
    # add_index :table_name, :column_name, unique: true, algorithm: :concurrently
  end
end
