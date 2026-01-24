class AddCustomerDomainToBotTemplates < ActiveRecord::Migration[8.1]
  def change
    add_column :bot_templates, :customer_domain, :string
  end
end
