# frozen_string_literal: true

class RemovePaymentAndSubscriptionTables < ActiveRecord::Migration[8.0]
  def change
    # First remove the foreign key reference from users
    if column_exists?(:users, :subscription_plan_id)
      remove_reference :users, :subscription_plan, foreign_key: true
    end

    # Then drop the tables with cascade to be safe
    drop_table :payments, force: :cascade if table_exists?(:payments)
    drop_table :subscription_plans, force: :cascade if table_exists?(:subscription_plans)
  end
end
